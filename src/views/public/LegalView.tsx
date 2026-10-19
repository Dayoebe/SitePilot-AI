import React from 'react';
import { Shield, FileCheck, Lock } from 'lucide-react';

interface LegalViewProps {
  type: 'privacy' | 'terms';
  onNavigate: (tab: string) => void;
}

export const LegalView: React.FC<LegalViewProps> = ({ type, onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-16 px-6">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="space-y-3 border-b border-slate-900 pb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">
              {type === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">Last Updated: October 2026</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {type === 'privacy'
              ? 'SitePilot AI Privacy & Data Security Policy'
              : 'SitePilot AI Platform Terms of Service'}
          </h1>
          <p className="text-xs text-slate-400">
            Our commitments to technical transparency, tenant isolation, zero data reselling, and responsible automated auditing.
          </p>
        </div>

        {type === 'privacy' ? (
          <div className="space-y-8 text-xs text-slate-300 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-semibold text-white">1. Information We Collect</h2>
              <p>
                When you initiate a website audit, we collect the publicly accessible URL provided, the selected device simulation strategy, and technical metrics returned by the Google PageSpeed Insights API and safe HTTP probes. For registered users, we record your email address and profile identifiers via Firebase Authentication.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-white">2. Multi-Tenant Workspace Isolation</h2>
              <p>
                Every client database record, website project, audit history, task, and automation rule is strictly associated with a verified workspace ID. Cross-tenant reads and unauthorized data access are prevented at the protocol level using hardened Firestore Security Rules.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-white">3. Public Report Link Safety</h2>
              <p>
                When generating shareable audit report links for clients, SitePilot AI uses cryptographically unguessable random tokens. Public reports expose only the verified technical audit measurements and sanitized recommendations. Private agency CRM notes, internal task assignees, and credential tokens are never exposed.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-white">4. No Data Reselling or Scraping</h2>
              <p>
                We do not sell, license, or monetize customer CRM records, client lists, or private audit findings. We do not engage in unauthorized email scraping.
              </p>
            </section>
          </div>
        ) : (
          <div className="space-y-8 text-xs text-slate-300 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-semibold text-white">1. Permitted Use & Responsible Auditing</h2>
              <p>
                SitePilot AI is designed for auditing publicly accessible web applications and domains owned by you or your authorized clients. You agree not to use the automated monitoring features to conduct denial-of-service tests or violate network abuse policies.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-white">2. AI Analysis Disclaimers</h2>
              <p>
                All Lighthouse scores and performance figures are derived from genuine testing algorithms. Strategic recommendations produced by Gemini AI are provided as professional guidance and must be reviewed by qualified developers prior to executing irreversible server or code changes.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-white">3. Subscriptions & Billing</h2>
              <p>
                Subscription quotas and monthly audit allowances reset on a 30-day billing cycle. Multi-currency payments are processed via authorized PCI-compliant processors (Stripe, Paystack). Subscriptions may be cancelled at any time from your account settings.
              </p>
            </section>
          </div>
        )}

        <div className="pt-6 border-t border-slate-900 flex items-center justify-between">
          <button
            onClick={() => onNavigate('home')}
            className="text-xs text-teal-400 hover:text-teal-300 font-medium"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};
