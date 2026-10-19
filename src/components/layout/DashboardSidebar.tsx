import React from 'react';
import {
  LayoutDashboard,
  Globe,
  Gauge,
  History,
  Activity,
  Lightbulb,
  FileText,
  Users,
  CheckSquare,
  Workflow,
  ShieldCheck,
  CreditCard,
  Settings,
  HelpCircle,
  ExternalLink,
  SlidersHorizontal,
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

interface DashboardSidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onBackToHome: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  currentView,
  onNavigate,
  onBackToHome,
}) => {
  const { workspace, websites, tasks } = useWorkspace();

  const openTasksCount = tasks.filter((t) => t.status !== 'done').length;

  const navSections = [
    {
      title: 'Intelligence',
      items: [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'projects', label: 'Website Projects', icon: Globe, count: websites.length },
        { id: 'audit-runner', label: 'Audit Workspace', icon: Gauge },
        { id: 'audit-history', label: 'Audit History & Diff', icon: History },
        { id: 'monitoring', label: 'Continuous Monitoring', icon: Activity },
        { id: 'ai-recommendations', label: 'AI Action Plan', icon: Lightbulb },
      ],
    },
    {
      title: 'Agency Growth & CRM',
      items: [
        { id: 'reports', label: 'Reports & Exports', icon: FileText },
        { id: 'crm', label: 'Clients & Prospects', icon: Users },
        { id: 'tasks', label: 'Remediation Tasks', icon: CheckSquare, count: openTasksCount },
        { id: 'automations', label: 'Automation Rules', icon: Workflow },
      ],
    },
    {
      title: 'Workspace Management',
      items: [
        { id: 'team', label: 'Team & RBAC', icon: ShieldCheck },
        { id: 'integrations', label: 'Integrations', icon: SlidersHorizontal },
        { id: 'subscription', label: 'Subscription & Quotas', icon: CreditCard },
        { id: 'settings', label: 'Settings & Security', icon: Settings },
        { id: 'help', label: 'Help & Knowledge Base', icon: HelpCircle },
      ],
    },
  ];

  return (
    <aside className="w-64 shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0 overflow-y-auto">
      <div>
        {/* Workspace Brand Lockup */}
        <div className="p-5 border-b border-slate-800/80">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2.5 text-left group w-full mb-3"
            title="Return to Public Site"
          >
            <div className="w-7 h-7 rounded-md bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Gauge className="w-4 h-4" />
            </div>
            <div className="truncate">
              <span className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                SitePilot <span className="text-teal-400">AI</span>
                <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-slate-300" />
              </span>
            </div>
          </button>

          {/* Current Workspace Pill */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-md p-2">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="truncate font-medium text-slate-200">{workspace.name}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="capitalize text-teal-400 font-semibold">{workspace.plan} Plan</span>
              <span className="font-mono tabular-nums text-slate-400">
                {workspace.monthlyAuditsUsed}/{workspace.monthlyAuditsLimit} Audits
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="p-3 space-y-6">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <h4 className="px-3 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                {section.title}
              </h4>
              <div className="space-y-0.5 pt-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigate(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors text-left ${
                        isActive
                          ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                          : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {typeof item.count === 'number' && item.count > 0 && (
                        <span
                          className={`font-mono tabular-nums text-[11px] px-1.5 py-0.2 rounded ${
                            isActive ? 'bg-teal-500/30 text-teal-200' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer / Quick Trigger */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
        <button
          onClick={() => onNavigate('audit-runner')}
          className="w-full py-2 px-3 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-md transition-colors flex items-center justify-center gap-1.5 shadow-sm"
        >
          <Gauge className="w-3.5 h-3.5" />
          <span>New Website Audit</span>
        </button>
      </div>
    </aside>
  );
};
