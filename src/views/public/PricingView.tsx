import React, { useState } from 'react';
import { Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { CurrencyCode } from '../../types';

interface PricingViewProps {
  onNavigate: (tab: string) => void;
  onOpenAuth: () => void;
}

export const PricingView: React.FC<PricingViewProps> = ({ onNavigate, onOpenAuth }) => {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('USD');

  // Rates structured cleanly in minor/major units
  const pricingData: Record<
    CurrencyCode,
    { symbol: string; free: string; pro: string; agency: string; enterprise: string; note: string }
  > = {
    USD: { symbol: '$', free: '0', pro: '29', agency: '79', enterprise: '199', note: 'Billed monthly in USD. No long-term lock-in.' },
    NGN: { symbol: '₦', free: '0', pro: '42,000', agency: '115,000', enterprise: '290,000', note: 'Supported via Paystack with instant card & bank transfer.' },
    GBP: { symbol: '£', free: '0', pro: '24', agency: '65', enterprise: '165', note: 'Billed in GBP including UK VAT compliance.' },
    EUR: { symbol: '€', free: '0', pro: '27', agency: '74', enterprise: '185', note: 'Billed in EUR with EU invoicing support.' },
  };

  const curr = pricingData[selectedCurrency];

  const plans = [
    {
      name: 'Free Trial',
      target: 'For freelancers & website owners testing the waters',
      price: curr.free,
      cadence: 'Forever free',
      highlight: false,
      features: [
        '5 full website audits per month',
        'Mobile & desktop Lighthouse analysis',
        'Core Web Vitals diagnostic overview',
        'Basic Gemini action recommendations',
        '1 website project saved in workspace',
        'Standard community support',
      ],
      cta: 'Start Free',
      action: onOpenAuth,
    },
    {
      name: 'Pro Consultant',
      target: 'For independent web developers & SEO specialists',
      price: curr.pro,
      cadence: 'per month',
      highlight: true,
      badge: 'Most Popular',
      features: [
        '100 full website audits per month',
        'Continuous weekly automated site monitoring',
        'Full Gemini Action Plan with code fixes',
        'Branded client PDF report generation',
        'Clients CRM pipeline (up to 25 clients)',
        '3 automated regression alerts',
        'Multi-currency client proposal generator',
      ],
      cta: 'Upgrade to Pro',
      action: onOpenAuth,
    },
    {
      name: 'Agency Scale',
      target: 'For digital agencies, dev shops & marketing consultancies',
      price: curr.agency,
      cadence: 'per month',
      highlight: false,
      features: [
        '500 full website audits per month',
        'Daily automated monitoring schedules',
        'Unlimited website projects & client CRM records',
        'White-label PDF reports with your agency logo',
        'Unguessable public share links with revocation',
        'Up to 10 team seats with 5 RBAC roles',
        'Direct CSV exports & webhook notifications',
        'Priority technical support',
      ],
      cta: 'Start Agency Trial',
      action: onOpenAuth,
    },
    {
      name: 'Enterprise',
      target: 'For high-volume web hosts & multi-client enterprises',
      price: curr.enterprise,
      cadence: 'per month',
      highlight: false,
      features: [
        'Unlimited on-demand audits (fair-use)',
        'Custom monitoring intervals (hourly/daily)',
        'Dedicated workspace isolation & custom RBAC',
        'Custom PageSpeed Insights API key integration',
        'Dedicated account manager & SLA guarantee',
        'Custom webhook pipelines & CRM sync',
      ],
      cta: 'Contact Sales',
      action: () => onNavigate('contact'),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-16 px-6">
      <div className="max-w-6xl mx-auto space-y-14">
        {/* Header & Currency Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-900 pb-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">Transparent Plans</span>
            <h1 className="text-4xl font-bold tracking-tight text-white">Simple, region-aware pricing.</h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              No hidden usage traps. Choose the plan tailored for your freelance practice or scaling digital agency.
            </p>
          </div>

          {/* Region / Currency Switcher */}
          <div className="space-y-1.5 shrink-0">
            <label className="text-[11px] font-medium text-slate-400 block">Select Display Currency</label>
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
              {(['USD', 'NGN', 'GBP', 'EUR'] as CurrencyCode[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCurrency(c)}
                  className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors ${
                    selectedCurrency === c
                      ? 'bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {c === 'USD' ? '$ USD' : c === 'NGN' ? '₦ NGN' : c === 'GBP' ? '£ GBP' : '€ EUR'}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 italic max-w-xs">{curr.note}</p>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`p-6 rounded-2xl flex flex-col justify-between border relative transition-all ${
                plan.highlight
                  ? 'bg-slate-900/90 border-teal-500/60 shadow-xl shadow-teal-950/40 ring-1 ring-teal-500/40'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-6 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-500 text-slate-950 shadow-sm">
                  {plan.badge}
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 min-h-[32px]">{plan.target}</p>
                </div>

                <div className="pb-4 border-b border-slate-800">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold font-mono text-white tabular-nums">
                      {curr.symbol}
                      {plan.price}
                    </span>
                    <span className="text-xs text-slate-400">/{plan.cadence}</span>
                  </div>
                </div>

                {/* Features list */}
                <div className="space-y-2.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Included</span>
                  <ul className="space-y-2 text-xs">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2 text-slate-300">
                        <Check className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800/80">
                <button
                  onClick={plan.action}
                  className={`w-full py-2.5 px-4 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    plan.highlight
                      ? 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-md shadow-teal-950'
                      : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                  }`}
                >
                  <span>{plan.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Currency disclaimer */}
        <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-lg text-xs text-slate-400 flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
          <p>
            Regional currencies are displayed for international convenience. Charges are processed in the merchant currency specified during checkout via Paystack or Stripe. No raw credit card details are ever stored on SitePilot AI servers.
          </p>
        </div>
      </div>
    </div>
  );
};
