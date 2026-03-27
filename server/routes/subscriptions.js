const router = require('express').Router();
const Stripe = require('stripe');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');

const prisma = new PrismaClient();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// GET /api/subscriptions/status
router.get('/status', authMiddleware, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { subscriptionStatus: true, subscriptionPlan: true, subscriptionEndsAt: true },
  });
  res.json(user);
});

// POST /api/subscriptions/stripe/create-checkout
router.post('/stripe/create-checkout', authMiddleware, async (req, res) => {
  const { plan } = req.body; // 'monthly' | 'annual'
  const priceId = plan === 'annual'
    ? process.env.STRIPE_ANNUAL_PRICE_ID
    : process.env.STRIPE_MONTHLY_PRICE_ID;

  const user = await prisma.user.findUnique({ where: { id: req.userId } });

  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({ email: user.email, name: user.name });
    customerId = customer.id;
    await prisma.user.update({ where: { id: req.userId }, data: { stripeCustomerId: customerId } });
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.CLIENT_URL}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/subscribe/cancel`,
    metadata: { userId: String(req.userId), plan },
  });

  res.json({ url: session.url });
});

// POST /api/subscriptions/stripe/webhook  (raw body — see index.js)
router.post('/stripe/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return res.status(400).send('Webhook signature verification failed');
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = Number(session.metadata.userId);
    const plan = session.metadata.plan;
    const subscription = await stripe.subscriptions.retrieve(session.subscription);
    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionStatus: 'ACTIVE',
        subscriptionPlan: plan === 'annual' ? 'ANNUAL' : 'MONTHLY',
        stripeSubscriptionId: subscription.id,
        subscriptionEndsAt: new Date(subscription.current_period_end * 1000),
      },
    });
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object;
    await prisma.user.updateMany({
      where: { stripeSubscriptionId: sub.id },
      data: { subscriptionStatus: 'CANCELLED', subscriptionPlan: null, stripeSubscriptionId: null },
    });
  }

  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object;
    await prisma.user.updateMany({
      where: { stripeSubscriptionId: invoice.subscription },
      data: { subscriptionStatus: 'PAST_DUE' },
    });
  }

  if (event.type === 'customer.subscription.updated') {
    const sub = event.data.object;
    if (sub.status === 'active') {
      await prisma.user.updateMany({
        where: { stripeSubscriptionId: sub.id },
        data: {
          subscriptionStatus: 'ACTIVE',
          subscriptionEndsAt: new Date(sub.current_period_end * 1000),
        },
      });
    }
  }

  res.json({ received: true });
});

// POST /api/subscriptions/stripe/cancel
router.post('/stripe/cancel', authMiddleware, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!user.stripeSubscriptionId) return res.status(400).json({ error: 'No active subscription found' });
  await stripe.subscriptions.update(user.stripeSubscriptionId, { cancel_at_period_end: true });
  res.json({ message: 'Subscription will cancel at end of billing period' });
});

module.exports = router;
