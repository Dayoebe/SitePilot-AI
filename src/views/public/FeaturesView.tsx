import React from 'react';
import {
  Gauge,
  Sparkles,
  Activity,
  Users2,
  FileText,
  Workflow,
  ShieldCheck,
  Zap,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface FeaturesViewProps {
  onNavigate: (tab: string) => void;
  onOpenAuth: () => void;
}

export const FeaturesView: React.FC<FeaturesViewProps> = ({ onNavigate, onOpenAuth }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-16 px-6">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">Features Directory</span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">Technical Depth & Agency Automation</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
            Everything web engineers and consultants need to deliver results.
          </h1>
          <p className="text-base text-slate-400 leading-relaxed">
            Eliminate guesswork with genuine Lighthouse telemetry, server-side Gemini intelligence, client pipeline tracking, and automated monitoring.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
            <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Gauge className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">PageSpeed Insights Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time measurement via Google PageSpeed Insights API v5. Tests mobile and desktop emulations across Performance, Accessibility, Best Practices, and SEO.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
            <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Core Web Vitals Telemetry</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              In-depth diagnostic breakdown of First Contentful Paint (FCP), Largest Contentful Paint (LCP), Cumulative Layout Shift (CLS), and Total Blocking Time (TBT).
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
            <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Gemini Action Plan</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Transforms raw diagnostic numbers into structured Quick Wins, High-Impact Improvements, and Long-Term Architecture with step-by-step code guidance.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
            <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Continuous Monitoring</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Schedule daily, weekly, or monthly audits automatically. Receive in-app notifications and trigger automated remediation workflows on score regressions.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
            <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Users2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Agency CRM Pipeline</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Track client relationships from initial audit outreach to closed retainer contracts. Manage deal sizes in USD, NGN, GBP, or EUR with overdue follow-up flags.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
            <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Branded Client Reports</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generate presentation-ready PDF audit reports, export CSV data, or generate secure, unguessable public share links with expiration and revocation controls.
            </p>
          </div>

          {/* Feature 7 */}
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
            <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Audit Version Comparison</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Side-by-side comparison of historical audits for the same URL. Quantifies score deltas, resolved opportunities, and introduced regressions over time.
            </p>
          </div>

          {/* Feature 8 */}
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
            <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Workflow className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Event Automation Builder</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Construct automated rules (Trigger → Condition → Action) to automatically generate remediation tasks or notifications when performance drops.
            </p>
          </div>

          {/* Feature 9 */}
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
            <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Zero-Trust Multi-Tenancy</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Isolated workspace tenant architecture backed by Firestore Security Rules and 5 granular RBAC tiers (Owner, Admin, Analyst, Member, Viewer).
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white">Ready to inspect your website?</h3>
            <p className="text-xs text-slate-400">Launch a live audit without upfront registration or credit card.</p>
          </div>
          <button
            onClick={() => onNavigate('home')}
            className="px-5 py-3 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 shadow-sm"
          >
            <span>Run Free Audit</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
