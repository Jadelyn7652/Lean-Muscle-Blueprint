const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function subscriptionMiddleware(req, res, next) {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { subscriptionStatus: true },
  });
  if (!user || user.subscriptionStatus !== 'ACTIVE') {
    return res.status(403).json({ error: 'Active subscription required' });
  }
  next();
}

module.exports = subscriptionMiddleware;
