import React, { useState } from 'react';
import {
  Gauge,
  Sparkles,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Zap,
  ArrowRight,
  ShieldCheck,
  FileText,
  Code2,
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

interface SampleReportViewProps {
  onNavigate: (tab: string) => void;
  onOpenAuth: () => void;
}

export const SampleReportView: React.FC<SampleReportViewProps> = ({ onNavigate, onOpenAuth }) => {
  const { audits } = useWorkspace();
  const sampleAudit = audits[0];
  const [activeTab, setActiveTab] = useState<'overview' | 'vitals' | 'opportunities' | 'ai-plan'>('overview');

  const scores = sampleAudit?.scores || {
    performance: 82,
    accessibility: 91,
    bestPractices: 88,
    seo: 92,
    overall: 88,
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (score >= 50) return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Demonstration Data Banner (Strictly Required by Prompt) */}
        <div className="p-4 bg-teal-500/10 border border-teal-500/30 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">
                Explicitly Labelled Demonstration Data
              </p>
              <p className="text-xs text-slate-300">
                Sample Report: TechCabal News (Mobile 4G Emulation · PageSpeed Insights API v5 & Gemini Strategic Briefing).
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('home')}
            className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
          >
            <span>Run Audit on Your Website</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Audit Header Card */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <span>https://techcabal.com</span>
                <span>·</span>
                <span className="flex items-center gap-1 text-teal-400">
                  <Smartphone className="w-3.5 h-3.5" /> Mobile
                </span>
                <span>·</span>
                <span>Oct 17, 2026, 14:30 UTC</span>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Technical & SEO Health Audit</h1>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">Overall Score:</span>
              <div className={`px-3 py-1 rounded-lg border font-mono font-bold text-lg ${getScoreColor(scores.overall)}`}>
                {scores.overall}/100
              </div>
            </div>
          </div>

          {/* 4 Lighthouse Category Score Rings */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-1 text-center">
              <span className="text-xs text-slate-400 font-medium">Performance</span>
              <p className={`text-3xl font-extrabold font-mono tabular-nums ${getScoreColor(scores.performance).split(' ')[0]}`}>
                {scores.performance}
              </p>
              <span className="text-[11px] text-slate-500 font-mono">Good (50-89)</span>
            </div>

            <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-1 text-center">
              <span className="text-xs text-slate-400 font-medium">Accessibility</span>
              <p className={`text-3xl font-extrabold font-mono tabular-nums ${getScoreColor(scores.accessibility).split(' ')[0]}`}>
                {scores.accessibility}
              </p>
              <span className="text-[11px] text-slate-500 font-mono">Passing (90+)</span>
            </div>

            <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-1 text-center">
              <span className="text-xs text-slate-400 font-medium">Best Practices</span>
              <p className={`text-3xl font-extrabold font-mono tabular-nums ${getScoreColor(scores.bestPractices).split(' ')[0]}`}>
                {scores.bestPractices}
              </p>
              <span className="text-[11px] text-slate-500 font-mono">Good (50-89)</span>
            </div>

            <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-1 text-center">
              <span className="text-xs text-slate-400 font-medium">SEO Health</span>
              <p className={`text-3xl font-extrabold font-mono tabular-nums ${getScoreColor(scores.seo).split(' ')[0]}`}>
                {scores.seo}
              </p>
              <span className="text-[11px] text-slate-500 font-mono">Passing (90+)</span>
            </div>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'overview' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Executive Summary
            </button>
            <button
              onClick={() => setActiveTab('vitals')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'vitals' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Core Web Vitals
            </button>
            <button
              onClick={() => setActiveTab('opportunities')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'opportunities' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Opportunities ({sampleAudit?.opportunities?.length || 2})
            </button>
            <button
              onClick={() => setActiveTab('ai-plan')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                activeTab === 'ai-plan' ? 'bg-slate-800 text-teal-300 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Gemini Action Plan</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Executive Summary */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
              <div className="flex items-center gap-2 text-xs text-teal-400 font-semibold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Executive AI Intelligence</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{sampleAudit?.aiSummary}</p>

              <div className="pt-4 border-t border-slate-800 space-y-2">
                <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Commercial Implications</h4>
                <ul className="space-y-1.5 text-xs text-slate-400">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                    <span>LCP at 2.4s is in Google's "Good" zone (&lt;2.5s) but leaves little buffer for traffic spikes.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                    <span>Serving modern WebP/AVIF images will save ~348 KiB per pageview on mobile cellular devices.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                    <span>Cumulative layout shift is minimal (0.02), indicating robust visual layout stability.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
              <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">HTTP Probe Diagnostics</h4>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Status Code</span>
                  <span className="font-mono text-emerald-400">200 OK</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Initial Probe Latency</span>
                  <span className="font-mono tabular-nums text-slate-200">220 ms</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Protocol & SSL</span>
                  <span className="font-mono text-teal-400">HTTPS Verified</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Edge Server</span>
                  <span className="font-mono text-slate-200">Cloudflare</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Compression</span>
                  <span className="font-mono text-slate-200">Brotli (br)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Core Web Vitals */}
        {activeTab === 'vitals' && (
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-6">
            <div>
              <h3 className="text-base font-bold text-white">Core Web Vitals Metrics</h3>
              <p className="text-xs text-slate-400">
                Measured in mobile emulation (Moto G Power, 4G Slow, simulated CPU throttling).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">Largest Contentful Paint (LCP)</span>
                  <span className="text-emerald-400 font-mono text-[11px]">Good (&lt;2.5s)</span>
                </div>
                <p className="text-2xl font-bold font-mono text-white tabular-nums">2.4 s</p>
                <p className="text-[11px] text-slate-500 leading-snug">Marks when the main hero content has likely loaded.</p>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">First Contentful Paint (FCP)</span>
                  <span className="text-emerald-400 font-mono text-[11px]">Good (&lt;1.8s)</span>
                </div>
                <p className="text-2xl font-bold font-mono text-white tabular-nums">1.5 s</p>
                <p className="text-[11px] text-slate-500 leading-snug">Marks the time when the first text or image is painted.</p>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">Cumulative Layout Shift (CLS)</span>
                  <span className="text-emerald-400 font-mono text-[11px]">Good (&lt;0.1)</span>
                </div>
                <p className="text-2xl font-bold font-mono text-white tabular-nums">0.02</p>
                <p className="text-[11px] text-slate-500 leading-snug">Quantifies unexpected layout shift during interaction.</p>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">Total Blocking Time (TBT)</span>
                  <span className="text-amber-400 font-mono text-[11px]">Needs Work (&lt;200ms)</span>
                </div>
                <p className="text-2xl font-bold font-mono text-white tabular-nums">190 ms</p>
                <p className="text-[11px] text-slate-500 leading-snug">Main-thread task blockage between FCP and interactive.</p>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">Speed Index (SI)</span>
                  <span className="text-emerald-400 font-mono text-[11px]">Good (&lt;3.4s)</span>
                </div>
                <p className="text-2xl font-bold font-mono text-white tabular-nums">2.2 s</p>
                <p className="text-[11px] text-slate-500 leading-snug">Speed at which visual content is populated on screen.</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Opportunities */}
        {activeTab === 'opportunities' && (
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
            <h3 className="text-base font-bold text-white">Optimization Opportunities</h3>
            <div className="space-y-3">
              {sampleAudit?.opportunities?.map((opp) => (
                <div key={opp.id} className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">{opp.title}</span>
                    <span className="font-mono text-teal-400 text-xs">{opp.displayValue}</span>
                  </div>
                  <p className="text-xs text-slate-400">{opp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Gemini Action Plan */}
        {activeTab === 'ai-plan' && (
          <div className="space-y-6">
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-400" />
                <h3 className="text-base font-bold text-white">Prioritised Gemini Action Plan</h3>
              </div>

              <div className="space-y-4 pt-2">
                {/* Quick Win */}
                <div className="p-4 bg-slate-950 border border-teal-500/30 rounded-lg space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-teal-400">Quick Win:</span>
                      <span className="font-semibold text-white">
                        {sampleAudit?.aiActionPlan?.quickWins[0]?.title}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      ~{sampleAudit?.aiActionPlan?.quickWins[0]?.estimatedEffortHours} hrs effort
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    {sampleAudit?.aiActionPlan?.quickWins[0]?.whyItMatters}
                  </p>
                  <div className="p-3 bg-slate-900 rounded border border-slate-800 text-xs font-mono text-teal-300">
                    Fix: {sampleAudit?.aiActionPlan?.quickWins[0]?.recommendedFix}
                  </div>
                </div>

                {/* High Impact */}
                <div className="p-4 bg-slate-950 border border-amber-500/30 rounded-lg space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-400">High Impact:</span>
                      <span className="font-semibold text-white">
                        {sampleAudit?.aiActionPlan?.highImpact[0]?.title}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      ~{sampleAudit?.aiActionPlan?.highImpact[0]?.estimatedEffortHours} hrs effort
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    {sampleAudit?.aiActionPlan?.highImpact[0]?.whyItMatters}
                  </p>
                  <div className="p-3 bg-slate-900 rounded border border-slate-800 text-xs font-mono text-amber-300">
                    Fix: {sampleAudit?.aiActionPlan?.highImpact[0]?.recommendedFix}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
