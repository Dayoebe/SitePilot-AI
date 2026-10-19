import React, { useState } from 'react';
import {
  CreditCard,
  Check,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { CurrencyCode, SubscriptionPlan } from '../../types';

export const SubscriptionView: React.FC = () => {
  const { workspace, setWorkspace, currency, setCurrency } = useWorkspace();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(workspace.plan);

  const pricingMap: Record<CurrencyCode, Record<SubscriptionPlan, { price: string; symbol: string }>> = {
    USD: {
      free: { price: '0', symbol: '$' },
      pro: { price: '29', symbol: '$' },
      agency: { price: '79', symbol: '$' },
      enterprise: { price: '199', symbol: '$' },
    },
    NGN: {
      free: { price: '0', symbol: '₦' },
      pro: { price: '42,000', symbol: '₦' },
      agency: { price: '115,000', symbol: '₦' },
      enterprise: { price: '290,000', symbol: '₦' },
    },
    GBP: {
      free: { price: '0', symbol: '£' },
      pro: { price: '24', symbol: '£' },
      agency: { price: '65', symbol: '£' },
      enterprise: { price: '165', symbol: '£' },
    },
    EUR: {
      free: { price: '0', symbol: '€' },
      pro: { price: '27', symbol: '€' },
      agency: { price: '74', symbol: '€' },
      enterprise: { price: '185', symbol: '€' },
    },
  };

  const handleUpgrade = (plan: SubscriptionPlan) => {
    const limits: Record<SubscriptionPlan, number> = {
      free: 25,
      pro: 100,
      agency: 500,
      enterprise: 2500,
    };
    setSelectedPlan(plan);
    setWorkspace((prev) => ({
      ...prev,
      plan,
      monthlyAuditsLimit: limits[plan],
    }));
    alert(`Switched workspace to ${plan.toUpperCase()} tier! Quota updated.`);
  };

  const currentPrices = pricingMap[currency];
  const quotaPercent = Math.min(100, Math.round((workspace.monthlyAuditsUsed / workspace.monthlyAuditsLimit) * 100));

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Subscription & Usage Quotas</h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor real audit consumption counters, switch regional display currencies, and manage tier entitlements.
          </p>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
          {(['USD', 'NGN', 'GBP', 'EUR'] as CurrencyCode[]).map((c) => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              className={`px-3 py-1 rounded text-xs font-mono font-medium transition-colors ${
                currency === c
                  ? 'bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {c === 'USD' ? '$' : c === 'NGN' ? '₦' : c === 'GBP' ? '£' : '€'} {c}
            </button>
          ))}
        </div>
      </div>

      {/* Usage Meter Card */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Monthly Audit Consumption</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Cycle resets on the 1st of every month. Includes scheduled and on-demand runs.
            </p>
          </div>
          <span className="text-lg font-bold font-mono text-white tabular-nums">
            {workspace.monthlyAuditsUsed} / {workspace.monthlyAuditsLimit}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              quotaPercent > 90 ? 'bg-rose-500' : quotaPercent > 70 ? 'bg-amber-500' : 'bg-teal-500'
            }`}
            style={{ width: `${quotaPercent}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-slate-400 font-mono">
          <span>{quotaPercent}% Quota Consumed</span>
          <span>{workspace.monthlyAuditsLimit - workspace.monthlyAuditsUsed} Audits Remaining</span>
        </div>
      </div>

      {/* Plans Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {(['free', 'pro', 'agency', 'enterprise'] as SubscriptionPlan[]).map((planKey) => {
          const isCurrent = workspace.plan === planKey;
          const p = currentPrices[planKey];
          return (
            <div
              key={planKey}
              className={`p-6 rounded-2xl border flex flex-col justify-between space-y-6 transition-all ${
                isCurrent
                  ? 'bg-slate-900 border-teal-500/60 shadow-lg shadow-teal-950/30'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="capitalize font-bold text-base text-white">{planKey}</span>
                  {isCurrent && (
                    <span className="text-[11px] font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                      Active Plan
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-1 pb-3 border-b border-slate-800">
                  <span className="text-2xl font-extrabold font-mono text-white tabular-nums">
                    {p.symbol}
                    {p.price}
                  </span>
                  <span className="text-xs text-slate-400">/mo</span>
                </div>

                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span>
                      {planKey === 'free'
                        ? '25 Audits / Month'
                        : planKey === 'pro'
                        ? '100 Audits / Month'
                        : planKey === 'agency'
                        ? '500 Audits / Month'
                        : 'Unlimited Fair-Use Audits'}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span>{planKey === 'free' ? 'Manual Audits' : 'Continuous Automated Monitoring'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span>{planKey === 'agency' || planKey === 'enterprise' ? 'White-Label PDF Reports' : 'SitePilot PDF Reports'}</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleUpgrade(planKey)}
                disabled={isCurrent}
                className={`w-full py-2 px-3 text-xs font-semibold rounded-lg transition-colors ${
                  isCurrent
                    ? 'bg-slate-800 text-slate-400 cursor-default'
                    : 'bg-teal-600 hover:bg-teal-500 text-white'
                }`}
              >
                {isCurrent ? 'Current Plan' : `Switch to ${planKey.toUpperCase()}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
