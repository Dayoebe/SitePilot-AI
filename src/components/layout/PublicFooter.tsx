import React from 'react';
import { Sparkles } from 'lucide-react';

interface PublicFooterProps {
  onNavigate: (tab: string) => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800/80 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                SitePilot<span className="text-teal-400"> AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              AI-powered website intelligence and business growth platform. Built for freelancers, agencies, and web developers across Nigeria, the UK, US, and worldwide.
            </p>
          </div>

          {/* Column 2: Product */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('features')} className="hover:text-white transition-colors">
                  Lighthouse & Core Web Vitals
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('features')} className="hover:text-white transition-colors">
                  Gemini Action Plan
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('sample-report')} className="hover:text-white transition-colors">
                  Interactive Sample Report
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('pricing')} className="hover:text-white transition-colors">
                  Plans & Multi-Currency
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Solutions */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Solutions</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('features')} className="hover:text-white transition-colors">
                  Freelance Web Consultants
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('features')} className="hover:text-white transition-colors">
                  Digital Marketing Agencies
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('how-it-works')} className="hover:text-white transition-colors">
                  Client CRM & Proposals
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('how-it-works')} className="hover:text-white transition-colors">
                  Continuous Site Monitoring
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Trust & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Legal & Security</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-white transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
                  Security & Data Isolation
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SitePilot AI. All rights reserved. Measured with Google PageSpeed Insights & Google Gen AI.</p>
          <div className="flex items-center gap-4">
            <span>Server-side Grounded AI</span>
            <span>·</span>
            <span>Zero Slop Guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
