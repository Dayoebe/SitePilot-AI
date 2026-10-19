import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  LogOut,
  ChevronDown,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWorkspace } from '../../context/WorkspaceContext';
import { CurrencyCode } from '../../types';

interface DashboardHeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

const viewTitles: Record<string, { title: string; category: string }> = {
  overview: { title: 'Workspace Overview', category: 'Dashboard' },
  projects: { title: 'Website Projects', category: 'Intelligence' },
  'audit-runner': { title: 'Website Audit Workspace', category: 'Intelligence' },
  'audit-history': { title: 'Audit History & Comparisons', category: 'Intelligence' },
  monitoring: { title: 'Continuous Website Monitoring', category: 'Intelligence' },
  'ai-recommendations': { title: 'AI Recommendations & Action Plan', category: 'Intelligence' },
  reports: { title: 'Reports & Client Exports', category: 'Agency Growth' },
  crm: { title: 'Clients & Prospects CRM', category: 'Agency Growth' },
  tasks: { title: 'Remediation Tasks', category: 'Agency Growth' },
  automations: { title: 'Event Automation Rules', category: 'Agency Growth' },
  team: { title: 'Team & Role Permissions', category: 'Management' },
  integrations: { title: 'Integrations Directory', category: 'Management' },
  subscription: { title: 'Subscription & Quotas', category: 'Management' },
  settings: { title: 'Settings & Security', category: 'Management' },
  help: { title: 'Help & Knowledge Base', category: 'Support' },
};

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ currentView, onNavigate }) => {
  const { profile, signOut, isDemoUser } = useAuth();
  const { currency, setCurrency, notifications, markNotificationRead } = useWorkspace();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const currentInfo = viewTitles[currentView] || { title: 'Dashboard', category: 'Workspace' };

  return (
    <header className="sticky top-0 z-30 w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-3.5 flex items-center justify-between gap-4">
      {/* Breadcrumb Trail */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-400">{currentInfo.category}</span>
        <span className="text-slate-600">/</span>
        <span className="font-semibold text-slate-100">{currentInfo.title}</span>
        {isDemoUser && (
          <span className="ml-3 text-[11px] font-mono text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded">
            Live Workspace Preview
          </span>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Currency Switcher (USD, NGN, GBP, EUR) */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/80 rounded-md p-0.5 text-xs">
          {(['USD', 'NGN', 'GBP', 'EUR'] as CurrencyCode[]).map((c) => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              className={`px-2 py-1 rounded font-mono text-xs transition-colors ${
                currency === c
                  ? 'bg-teal-500/20 text-teal-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {c === 'USD' ? '$' : c === 'NGN' ? '₦' : c === 'GBP' ? '£' : '€'} {c}
            </button>
          ))}
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-400 ring-2 ring-slate-900" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-white">Notifications</span>
                <span className="text-[11px] font-mono text-slate-400">{unreadCount} unread</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
                {notifications.length === 0 ? (
                  <p className="p-4 text-xs text-slate-500 text-center">No notifications yet.</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.link) {
                          onNavigate(n.link.replace('/', ''));
                          setShowNotifications(false);
                        }
                      }}
                      className={`p-3 text-xs cursor-pointer hover:bg-slate-800/50 transition-colors ${
                        !n.read ? 'bg-slate-800/25' : ''
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {n.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />}
                        {n.type === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />}
                        {n.type === 'info' && <Info className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-200 truncate">{n.title}</p>
                          <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{n.message}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1 pl-2 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 rounded-md transition-colors"
          >
            <div className="w-6 h-6 rounded-full overflow-hidden bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 text-xs font-semibold">
              {profile?.photoURL ? (
                <img
                  src={profile.photoURL}
                  alt={profile.displayName || 'User'}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <span>{(profile?.displayName || 'User')[0]}</span>
              )}
            </div>
            <span className="text-xs text-slate-200 max-w-[120px] truncate hidden sm:inline">
              {profile?.displayName || 'Analyst'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-800">
                <p className="text-xs font-semibold text-white truncate">{profile?.displayName || 'SitePilot User'}</p>
                <p className="text-[11px] text-slate-400 truncate">{profile?.email}</p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    onNavigate('settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 text-left"
                >
                  <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                  Account Settings
                </button>
                <button
                  onClick={() => {
                    signOut();
                    setShowProfileMenu(false);
                  }}
                  className="w-full px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 text-left"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
