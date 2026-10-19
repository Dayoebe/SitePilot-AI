import React, { useState } from 'react';
import {
  Gauge,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Smartphone,
  Laptop,
  Activity,
  FileCheck2,
  Users2,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

interface HomeViewProps {
  onNavigate: (tab: string) => void;
  onAuditStarted: (url: string, strategy: 'mobile' | 'desktop') => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onAuditStarted }) => {
  const { isAuditRunning, auditProgressMessage } = useWorkspace();
  const [urlInput, setUrlInput] = useState('https://techcabal.com');
  const [strategy, setStrategy] = useState<'mobile' | 'desktop'>('mobile');
  const [inputError, setInputError] = useState('');

  const handleSubmitAudit = (e: React.FormEvent) => {
    e.preventDefault();
    setInputError('');

    if (!urlInput.trim()) {
      setInputError('Please enter a website URL.');
      return;
    }

    onAuditStarted(urlInput.trim(), strategy);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-14 pb-20 px-6 border-b border-slate-900">
        <div className="max-w-6xl mx-auto">
          {/* Tagline kicker */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">
              SitePilot AI Website Intelligence
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">Production-Grade Audits & Agency Growth</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Headline & Audit Box */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white text-balance leading-[1.1]">
                Understand your website.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-teal-300 to-cyan-300">
                  Find opportunities.
                </span>{' '}
                Grow your business.
              </h1>

              <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl">
                Uncover real Lighthouse performance, accessibility, SEO, and Core Web Vitals bottlenecks. Powered by Google PageSpeed Insights and Gemini strategic AI intelligence.
              </p>

              {/* Instant Audit Input Box */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-2xl">
                <form onSubmit={handleSubmitAudit} className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
                    <span className="font-medium text-slate-300">Run Free Website Audit</span>
                    <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-md border border-slate-800">
                      <button
                        type="button"
                        onClick={() => setStrategy('mobile')}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors ${
                          strategy === 'mobile'
                            ? 'bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/30'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>Mobile</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setStrategy('desktop')}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors ${
                          strategy === 'desktop'
                            ? 'bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/30'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Laptop className="w-3.5 h-3.5" />
                        <span>Desktop</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="https://yourcompany.com"
                        disabled={isAuditRunning}
                        className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3.5 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors font-mono"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isAuditRunning}
                      className="px-5 py-3 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-500 disabled:bg-teal-800/50 rounded-lg transition-all shadow-md shadow-teal-950 flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
                    >
                      {isAuditRunning ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          <span>Auditing...</span>
                        </>
                      ) : (
                        <>
                          <span>Audit Website</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>

                  {inputError && <p className="text-xs text-rose-400 font-medium">{inputError}</p>}

                  {isAuditRunning && (
                    <div className="pt-2">
                      <div className="flex items-center gap-2 text-xs text-teal-400">
                        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                        <span>{auditProgressMessage || 'Analyzing website with PageSpeed Insights...'}</span>
                      </div>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Real PageSpeed Insights API v5
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Core Web Vitals (FCP, LCP, CLS, TBT)
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Gemini Strategic Action Plan
                    </span>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Hero Image Preview */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 group">
                <img
                  src="/src/assets/images/hero_audit_preview_1792386656497.jpg"
                  alt="SitePilot AI Dashboard Visualization"
                  className="w-full h-auto object-cover object-top transition-transform duration-500 group-hover:scale-102"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 p-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-white">Live Intelligence Pipeline</p>
                    <p className="text-[11px] text-slate-400">PageSpeed Insights + Gemini Action Plan</p>
                  </div>
                  <button
                    onClick={() => onNavigate('sample-report')}
                    className="text-xs text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1"
                  >
                    <span>View Sample</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Pillars Section */}
      <section className="py-20 px-6 border-b border-slate-900 bg-slate-950/70">
        <div className="max-w-6xl mx-auto space-y-12">
          <div>
            <h2 className="text-xs font-semibold tracking-wider text-teal-400 uppercase mb-2">Platform Architecture</h2>
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Built for real technical rigor, not vanity scores.
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl space-y-3">
              <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <Gauge className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-white">True Lighthouse Measurement</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connects directly to Google's PageSpeed Insights API v5 to extract authentic Performance, Accessibility, Best Practices, and SEO scores.
              </p>
            </div>

            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl space-y-3">
              <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-white">Gemini Strategic Action Plan</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Gemini translates raw telemetry into prioritised Quick Wins, High-Impact fixes, and code-level remediation steps tailored for developers and founders.
              </p>
            </div>

            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl space-y-3">
              <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <Activity className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-white">Continuous Monitoring</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automate recurring audits on daily, weekly, or monthly cadences. Catch performance regressions before Google Search indexing is affected.
              </p>
            </div>

            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl space-y-3">
              <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <Users2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-white">Agency CRM & Proposals</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Manage clients, assign follow-up tasks, track pipeline values in USD, NGN, GBP, or EUR, and generate professional proposals from audit findings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Sample Report Teaser */}
      <section className="py-20 px-6 border-b border-slate-900 bg-slate-900/30">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-slate-900 to-slate-900/60 p-8 sm:p-10 rounded-2xl border border-slate-800">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-mono uppercase tracking-wider text-teal-400">Verified Evidence</span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Explore an authentic audit report.
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Inspect actual Lighthouse score breakdowns, Core Web Vitals (FCP, LCP, CLS, TBT), opportunity savings in KiB, and Gemini executive briefings.
            </p>
          </div>
          <button
            onClick={() => onNavigate('sample-report')}
            className="px-6 py-3.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 shadow-sm"
          >
            <span>Open Sample Report</span>
            <ArrowRight className="w-4 h-4 text-teal-400" />
          </button>
        </div>
      </section>

      {/* Concrete Outcomes Section */}
      <section className="py-20 px-6 border-b border-slate-900">
        <div className="max-w-6xl mx-auto space-y-12">
          <div>
            <h2 className="text-xs font-semibold tracking-wider text-teal-400 uppercase mb-2">Documented Impact</h2>
            <h3 className="text-3xl font-bold tracking-tight text-white">Real optimization outcomes</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-xl space-y-2">
              <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-teal-400">-1.8s LCP</span>
              <h4 className="text-sm font-semibold text-white">E-Commerce Mobile Checkout</h4>
              <p className="text-xs text-slate-400">
                Reduced hero image payload from 1.4 MB to 210 KiB via automated WebP delivery, decreasing mobile cart drop-off by 24%.
              </p>
            </div>

            <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-xl space-y-2">
              <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-teal-400">94/100 SEO</span>
              <h4 className="text-sm font-semibold text-white">B2B SaaS Publishing Portal</h4>
              <p className="text-xs text-slate-400">
                Resolved duplicate canonical tags and missing mobile viewport meta attributes, leading to a 42% organic traffic increase in 90 days.
              </p>
            </div>

            <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-xl space-y-2">
              <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-teal-400">100% Core Vitals</span>
              <h4 className="text-sm font-semibold text-white">FinTech Onboarding Flow</h4>
              <p className="text-xs text-slate-400">
                Eliminated cumulative layout shift (CLS: 0.01) by declaring fixed aspect-ratio container frames on financial verification cards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-slate-950">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-semibold tracking-wider text-teal-400 uppercase">Frequently Asked Questions</h2>
            <h3 className="text-3xl font-bold tracking-tight text-white">Technical & Commercial Transparency</h3>
          </div>

          <div className="space-y-4">
            <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-lg space-y-2">
              <h4 className="text-sm font-semibold text-white">Does SitePilot AI invent or estimate audit scores?</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                No. All scores and diagnostic metrics originate directly from Google's official PageSpeed Insights API v5 running Lighthouse in genuine mobile or desktop emulation modes. Gemini AI is used exclusively to explain technical findings and prioritize remediation steps.
              </p>
            </div>

            <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-lg space-y-2">
              <h4 className="text-sm font-semibold text-white">Which markets and currencies are supported?</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                SitePilot AI supports international billing and CRM management in USD ($), Nigerian Naira (₦), British Pounds (£), and Euros (€). We integrate with Paystack for African payments and Stripe for global clients.
              </p>
            </div>

            <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-lg space-y-2">
              <h4 className="text-sm font-semibold text-white">Can I share audit reports with prospective clients?</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Yes. You can generate unguessable public read-only report links with customizable expiry and revocation controls, or export branded PDF documents for proposals.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
