import React from 'react';
import {
  Globe,
  Gauge,
  Sparkles,
  Briefcase,
  ArrowRight,
  Shield,
  Layers,
  CheckCircle,
} from 'lucide-react';

interface HowItWorksViewProps {
  onNavigate: (tab: string) => void;
}

export const HowItWorksView: React.FC<HowItWorksViewProps> = ({ onNavigate }) => {
  const steps = [
    {
      number: '01',
      title: 'URL Normalization & Safe Reachability Probe',
      subtitle: 'Preliminary Security & HTTP Analysis',
      icon: Globe,
      description:
        'SitePilot AI normalizes your URL, guards against internal/SSRF addresses, verifies HTTPS certificates, and probes Time To First Byte (TTFB), server response headers, and compression encodings.',
      mechanisms: ['HTTPS protocol validation', 'DNS resolution check', 'Response header security inspection'],
    },
    {
      number: '02',
      title: 'Lighthouse PageSpeed Insights Engine',
      subtitle: 'Real Lab & Synthetic Emulation',
      icon: Gauge,
      description:
        'Your website is dispatched to Google PageSpeed Insights API v5 under mobile (Moto G Power simulation) or desktop emulation. Real audit categories are fetched for Performance, Accessibility, Best Practices, and SEO.',
      mechanisms: [
        'Core Web Vitals measurement (FCP, LCP, CLS, TBT)',
        'Unused JavaScript & CSS identification',
        'Image format and compression evaluation in KiB savings',
      ],
    },
    {
      number: '03',
      title: 'Gemini Strategic Synthesis & Action Planning',
      subtitle: 'Server-Side Intelligence by @google/genai',
      icon: Sparkles,
      description:
        'Raw telemetry numbers are bounded and passed to Gemini 3.8-flash on the server. The AI generates a plain-English executive briefing for non-technical founders, and a prioritized action plan for developers.',
      mechanisms: [
        'Quick Wins (Low effort, immediate score lift)',
        'High-Impact Core Web Vitals remediation',
        'Exact verification method and estimated developer hours',
      ],
    },
    {
      number: '04',
      title: 'Agency CRM & Continuous Automated Monitoring',
      subtitle: 'From Diagnosis to Revenue Growth',
      icon: Briefcase,
      description:
        'Link audit results to prospective clients in the built-in CRM. Automatically generate remediation proposals, assign follow-up tasks, and schedule recurring weekly audits to prevent regressions.',
      mechanisms: [
        'Branded client PDF exports & unguessable public share links',
        'Multi-currency deal tracking (USD, NGN, GBP, EUR)',
        'Score drop threshold alerts via in-app notifications',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-16 px-6">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Header */}
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">Pipeline Architecture</span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">Step-by-Step Transparency</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
            How SitePilot AI works under the hood.
          </h1>
          <p className="text-base text-slate-400 leading-relaxed">
            We separate genuine technical measurement from AI-generated interpretation. Here is the exact end-to-end audit lifecycle.
          </p>
        </div>

        {/* Step-by-Step Chain */}
        <div className="space-y-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="p-8 bg-slate-900/60 border border-slate-800 rounded-2xl grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
              >
                <div className="md:col-span-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-2xl font-bold text-teal-400">{step.number}.</span>
                    <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">{step.title}</h3>
                  <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">{step.subtitle}</p>
                </div>

                <div className="md:col-span-8 space-y-4">
                  <p className="text-sm text-slate-300 leading-relaxed">{step.description}</p>
                  <div className="pt-2 border-t border-slate-800/80 space-y-2">
                    {step.mechanisms.map((mech) => (
                      <div key={mech} className="flex items-center gap-2 text-xs text-slate-400">
                        <CheckCircle className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                        <span>{mech}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center pt-8">
          <button
            onClick={() => onNavigate('home')}
            className="px-6 py-3.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-lg transition-colors inline-flex items-center gap-2 shadow-sm"
          >
            <span>Run Your First Audit</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
