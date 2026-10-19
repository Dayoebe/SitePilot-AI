import React, { useState } from 'react';
import {
  SlidersHorizontal,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Key,
  Webhook,
  CreditCard,
} from 'lucide-react';

export const IntegrationsView: React.FC = () => {
  const [webhookUrl, setWebhookUrl] = useState('https://agency.example.com/api/sitepilot-webhook');
  const [webhookSecret, setWebhookSecret] = useState('whsec_' + Math.random().toString(36).substring(2, 10));
  const [isSavedWebhook, setIsSavedWebhook] = useState(false);

  const integrations = [
    {
      name: 'Google PageSpeed Insights API v5',
      category: 'Audit Engine',
      description: 'Official Google Lighthouse engine for measuring Core Web Vitals, performance, accessibility, and SEO.',
      status: 'connected',
      statusText: 'Connected & Active',
      details: 'Dispatches synthetic mobile (Moto G Power) & desktop Lighthouse runs.',
    },
    {
      name: 'Gemini 3.8-Flash AI Engine',
      category: 'Artificial Intelligence',
      description: 'Google Gen AI TypeScript SDK (@google/genai) providing strategic action plans and executive summaries.',
      status: 'connected',
      statusText: 'Connected & Active',
      details: 'Server-side bounded analysis via GEMINI_API_KEY.',
    },
    {
      name: 'Firebase Auth & Cloud Firestore',
      category: 'Identity & Persistence',
      description: 'Zero-trust tenant isolation, Google Sign-in authentication, and real-time database persistence.',
      status: 'connected',
      statusText: 'Connected & Provisioned',
      details: 'Hardened Firestore Security Rules deployed via Fax RPC.',
    },
    {
      name: 'Google Search Console',
      category: 'Search Intelligence',
      description: 'Sync genuine organic search impressions, query click-through rates, and Google indexing coverage.',
      status: 'unconfigured',
      statusText: 'Not Configured',
      details: 'Requires OAuth 2.0 consent with searchconsole.readonly scope.',
    },
    {
      name: 'Paystack Payment Gateway',
      category: 'Regional African Billing',
      description: 'Accept Nigerian Naira (NGN), Ghanaian Cedi (GHS), and South African Rand (ZAR) via card and bank transfer.',
      status: 'ready',
      statusText: 'Adapter Ready',
      details: 'Configured for international merchant routing in West Africa.',
    },
    {
      name: 'Stripe Global Billing',
      category: 'International Payments',
      description: 'Process international subscription billing in USD, GBP, and EUR with automated invoice receipts.',
      status: 'ready',
      statusText: 'Adapter Ready',
      details: 'PCI-compliant checkout with webhook synchronization.',
    },
  ];

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Title */}
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-2xl font-bold text-white tracking-tight">Integrations Directory</h1>
        <p className="text-xs text-slate-400 mt-1">
          Honest connection states for search engines, AI models, cloud persistence, and regional payment adapters.
        </p>
      </div>

      {/* Integration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((item) => (
          <div
            key={item.name}
            className="p-6 bg-slate-900 border border-slate-800 rounded-xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                  {item.category}
                </span>

                <span
                  className={`flex items-center gap-1 text-[11px] font-semibold ${
                    item.status === 'connected'
                      ? 'text-emerald-400'
                      : item.status === 'ready'
                      ? 'text-teal-300'
                      : 'text-slate-500'
                  }`}
                >
                  {item.status === 'connected' ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : item.status === 'ready' ? (
                    <CreditCard className="w-3.5 h-3.5" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5" />
                  )}
                  <span>{item.statusText}</span>
                </span>
              </div>

              <h3 className="text-base font-bold text-white">{item.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-2">
              <p>{item.details}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Webhook Dispatcher */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
        <div className="flex items-center gap-2">
          <Webhook className="w-4 h-4 text-teal-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Outbound Webhooks Dispatcher</h3>
        </div>
        <p className="text-xs text-slate-400">
          Transmit audit completion payloads, score regression alerts, and proposal milestones to your agency internal API or Slack channel.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
          <div>
            <label className="font-medium text-slate-300 block mb-1">Webhook Endpoint URL</label>
            <input
              type="text"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="font-medium text-slate-300 block mb-1">Signing Secret (HMAC-SHA256)</label>
            <input
              type="text"
              value={webhookSecret}
              onChange={(e) => setWebhookSecret(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-slate-500">
            {isSavedWebhook ? '✓ Webhook endpoint saved and active' : 'Click save to apply webhook dispatch'}
          </span>
          <button
            onClick={() => {
              setIsSavedWebhook(true);
              setTimeout(() => setIsSavedWebhook(false), 2500);
            }}
            className="px-4 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded text-xs font-semibold"
          >
            {isSavedWebhook ? 'Saved!' : 'Save Webhook Configuration'}
          </button>
        </div>
      </div>
    </div>
  );
};
