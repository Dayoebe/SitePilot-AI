import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { signInWithGoogle, enterDemoMode } = useAuth();
  const [error, setError] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  if (!isOpen) return null;

  const handleGoogleAuth = async () => {
    setError('');
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
      onSuccess();
      onClose();
    } catch (err: any) {
      console.warn('Google Auth notice:', err);
      setError(
        'Google popup was closed or network interrupted. You can also explore SitePilot AI via the instant Analyst Demo Workspace.'
      );
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleDemoAccess = () => {
    enterDemoMode();
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white text-sm p-1"
        >
          ✕
        </button>

        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 mx-auto">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">Access SitePilot AI</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Sign in to save website projects, schedule recurring audits, access your client CRM, and generate proposals.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs text-rose-300">
            {error}
          </div>
        )}

        <div className="space-y-3">
          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleAuth}
            disabled={isSigningIn}
            className="w-full py-3 px-4 bg-white hover:bg-slate-100 text-slate-900 font-semibold rounded-lg text-xs flex items-center justify-center gap-3 transition-colors shadow-md"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isSigningIn ? 'Connecting...' : 'Continue with Google Account'}</span>
          </button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-800" />
            <span className="flex-shrink mx-3 text-slate-500 text-[11px] uppercase tracking-wider">or</span>
            <div className="flex-grow border-t border-slate-800" />
          </div>

          {/* Instant Demo Workspace Access */}
          <button
            onClick={handleDemoAccess}
            className="w-full py-3 px-4 bg-teal-600/20 hover:bg-teal-600/30 border border-teal-500/40 text-teal-300 font-semibold rounded-lg text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <span>Enter Live Analyst Workspace (1-Click Preview)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="pt-2 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
          <span>Zero-trust isolated multi-tenancy & hardened Firestore ABAC rules</span>
        </div>
      </div>
    </div>
  );
};
