import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, ArrowRight } from 'lucide-react';

interface PublicNavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenAuth: () => void;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({ currentTab, onNavigate, onOpenAuth }) => {
  const { user, profile } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 text-left group transition-opacity hover:opacity-90"
        >
          <div className="w-8 h-8 rounded-lg bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white whitespace-nowrap shrink-0">
            SitePilot<span className="text-teal-400"> AI</span>
          </span>
        </button>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            onClick={() => onNavigate('features')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              currentTab === 'features' ? 'text-teal-400 font-semibold' : ''
            }`}
          >
            Features
          </button>
          <button
            onClick={() => onNavigate('how-it-works')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              currentTab === 'how-it-works' ? 'text-teal-400 font-semibold' : ''
            }`}
          >
            How It Works
          </button>
          <button
            onClick={() => onNavigate('pricing')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              currentTab === 'pricing' ? 'text-teal-400 font-semibold' : ''
            }`}
          >
            Pricing
          </button>
          <button
            onClick={() => onNavigate('sample-report')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              currentTab === 'sample-report' ? 'text-teal-400 font-semibold' : ''
            }`}
          >
            Sample Report
          </button>
          <button
            onClick={() => onNavigate('contact')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              currentTab === 'contact' ? 'text-teal-400 font-semibold' : ''
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {user || profile ? (
            <button
              onClick={() => onNavigate('app-overview')}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-lg transition-all shadow-sm shadow-teal-950 whitespace-nowrap shrink-0"
            >
              <span>Open Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-lg transition-all shadow-sm shadow-teal-950 whitespace-nowrap shrink-0"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
