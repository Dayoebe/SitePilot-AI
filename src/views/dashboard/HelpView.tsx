import React from 'react';
import { HelpCircle, BookOpen, ExternalLink, Zap, ShieldCheck } from 'lucide-react';

export const HelpView: React.FC = () => {
  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-4xl mx-auto">
      {/* Title */}
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-2xl font-bold text-white tracking-tight">Help & Knowledge Base</h1>
        <p className="text-xs text-slate-400 mt-1">
          Technical documentation, Core Web Vitals thresholds, and optimization guidelines.
        </p>
      </div>

      {/* Core Web Vitals Thresholds Glossary */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-teal-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Google Core Web Vitals Official Targets
          </h3>
        </div>

        <div className="space-y-4 text-xs">
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
            <div className="flex justify-between font-semibold">
              <span className="text-white">Largest Contentful Paint (LCP)</span>
              <span className="text-emerald-400 font-mono">Good: ≤ 2.5s | Poor: &gt; 4.0s</span>
            </div>
            <p className="text-slate-400">
              Measures perceived loading speed. Marks the point in page load when the main content (hero image, heading, or banner) has likely loaded.
            </p>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
            <div className="flex justify-between font-semibold">
              <span className="text-white">First Contentful Paint (FCP)</span>
              <span className="text-emerald-400 font-mono">Good: ≤ 1.8s | Poor: &gt; 3.0s</span>
            </div>
            <p className="text-slate-400">
              Marks the time at which the browser renders the first piece of DOM content from the webpage.
            </p>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
            <div className="flex justify-between font-semibold">
              <span className="text-white">Cumulative Layout Shift (CLS)</span>
              <span className="text-emerald-400 font-mono">Good: ≤ 0.1 | Poor: &gt; 0.25</span>
            </div>
            <p className="text-slate-400">
              Measures visual stability. Ensures unexpected layout shifts do not cause accidental misclicks on buttons or links.
            </p>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
            <div className="flex justify-between font-semibold">
              <span className="text-white">Total Blocking Time (TBT)</span>
              <span className="text-emerald-400 font-mono">Good: ≤ 200ms | Poor: &gt; 600ms</span>
            </div>
            <p className="text-slate-400">
              Quantifies main-thread CPU blockage during load. Correlates directly with real-world Interaction to Next Paint (INP).
            </p>
          </div>
        </div>
      </div>

      {/* Code Optimization Cookbook */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Technical Remediation Cookbook</h3>

        <div className="space-y-4 text-xs">
          <div className="space-y-1">
            <h4 className="font-semibold text-teal-300">1. Next-Gen Image Formats with HTML Picture Tag</h4>
            <pre className="p-3 bg-slate-950 border border-slate-800 rounded text-slate-300 font-mono text-[11px] overflow-x-auto">
{`<picture>
  <source type="image/avif" srcset="/hero.avif">
  <source type="image/webp" srcset="/hero.webp">
  <img src="/hero.jpg" width="1200" height="630" alt="Hero banner" fetchpriority="high">
</picture>`}
            </pre>
          </div>

          <div className="space-y-1">
            <h4 className="font-semibold text-teal-300">2. Defer Non-Critical JavaScript</h4>
            <pre className="p-3 bg-slate-950 border border-slate-800 rounded text-slate-300 font-mono text-[11px] overflow-x-auto">
{`<!-- Critical script executes synchronously -->
<script src="/critical.js"></script>

<!-- Analytics and third-party scripts deferred until DOM is ready -->
<script src="https://www.googletagmanager.com/gtag/js" defer></script>`}
            </pre>
          </div>

          <div className="space-y-1">
            <h4 className="font-semibold text-teal-300">3. Nginx Cache-Control & Brotli Configuration</h4>
            <pre className="p-3 bg-slate-950 border border-slate-800 rounded text-slate-300 font-mono text-[11px] overflow-x-auto">
{`location ~* \\.(?:css|js|woff2|avif|webp)$ {
    expires 1y;
    add_header Cache-Control "public, max-age=31536000, immutable";
    brotli on;
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
