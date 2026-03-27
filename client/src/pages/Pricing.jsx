import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const FEATURES = [
  'All 6 courses — full access',
  '24-week Lean Muscle Blueprint',
  'Nutrition & meal planning guide',
  'Cardio & supplement guides',
  'Progress tracking tools',
  'Mindset & motivation framework',
];

function PlanCard({ title, price, period, badge, features, plan, onSubscribe, loading }) {
  return (
    <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-8 flex flex-col gap-6 flex-1">
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
          {badge}
        </div>
      )}
      <div>
        <h2 className="text-xl font-bold mb-1">{title}</h2>
        <div className="flex items-end gap-1">
          <span className="text-4xl font-extrabold">${price}</span>
          <span className="text-gray-400 mb-1">/{period}</span>
        </div>
        {plan === 'annual' && (
          <p className="text-green-400 text-sm mt-1 font-medium">Save 78% vs monthly</p>
        )}
      </div>

      <ul className="flex flex-col gap-2 text-sm text-gray-300">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <svg className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {f}
          </li>
        ))}
      </ul>

      <button
        onClick={() => onSubscribe(plan)}
        disabled={loading === plan}
        className="mt-auto bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-60"
      >
        {loading === plan ? 'Redirecting to checkout...' : 'Subscribe Now'}
      </button>
    </div>
  );
}

export default function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState('');

  async function handleSubscribe(plan) {
    if (!user) { navigate('/register'); return; }
    setError('');
    setLoading(plan);
    try {
      const { data } = await api.post('/subscriptions/stripe/create-checkout', { plan });
      window.location.href = data.url;
    } catch {
      setError('Failed to start checkout. Please try again.');
      setLoading(null);
    }
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold mb-3">Get Full Access</h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Everything you need for a complete 24-week body transformation. Cancel anytime.
        </p>
      </div>

      {error && (
        <p className="text-red-400 text-sm bg-red-950 border border-red-800 rounded-lg px-4 py-3 mb-6 text-center">
          {error}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-8">
        <PlanCard
          title="Monthly"
          price="24.99"
          period="month"
          plan="monthly"
          features={FEATURES}
          onSubscribe={handleSubscribe}
          loading={loading}
        />
        <PlanCard
          title="Annual"
          price="64.99"
          period="year"
          badge="BEST VALUE"
          plan="annual"
          features={[...FEATURES, '2 months free vs monthly']}
          onSubscribe={handleSubscribe}
          loading={loading}
        />
      </div>

      <p className="text-center text-gray-600 text-sm mt-8">
        Secure checkout powered by Stripe. Cancel anytime from your account.
      </p>
    </main>
  );
}
