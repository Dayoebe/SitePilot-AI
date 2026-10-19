import React from 'react';
import {
  Globe,
  Gauge,
  Activity,
  Users,
  CheckSquare,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Smartphone,
  Laptop,
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

interface OverviewViewProps {
  onNavigate: (view: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onNavigate }) => {
  const { workspace, websites, audits, clients, tasks, currency } = useWorkspace();

  const latestAudit = audits[0];
  const avgHealthScore =
    websites.length > 0
      ? Math.round(
          websites.reduce((acc, curr) => acc + (curr.lastAuditScore || 80), 0) / websites.length
        )
      : 84;

  const totalPipelineValue = clients
    .filter((c) => c.status !== 'lost')
    .reduce((acc, curr) => acc + (curr.estimatedValue || 0), 0);

  const openTasks = tasks.filter((t) => t.status !== 'done');

  const currSymbol = currency === 'USD' ? '$' : currency === 'NGN' ? '₦' : currency === 'GBP' ? '£' : '€';

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>Workspace: {workspace.name}</span>
            <span>·</span>
            <span className="capitalize text-teal-400 font-semibold">{workspace.plan} Plan</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Intelligence Dashboard</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('audit-runner')}
            className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-md transition-colors flex items-center gap-2 shadow-sm"
          >
            <Gauge className="w-4 h-4" />
            <span>Launch New Audit</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Portfolio Avg Health</span>
            <Activity className="w-4 h-4 text-teal-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-white tabular-nums">{avgHealthScore}</span>
            <span className="text-xs text-slate-500 font-mono">/ 100</span>
          </div>
          <p className="text-[11px] text-slate-400">Across {websites.length} monitored client websites</p>
        </div>

        {/* KPI 2 */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Monthly Audit Quota</span>
            <Gauge className="w-4 h-4 text-teal-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-white tabular-nums">
              {workspace.monthlyAuditsUsed}
            </span>
            <span className="text-xs text-slate-500 font-mono">/ {workspace.monthlyAuditsLimit}</span>
          </div>
          <p className="text-[11px] text-slate-400">
            {workspace.monthlyAuditsLimit - workspace.monthlyAuditsUsed} runs remaining this cycle
          </p>
        </div>

        {/* KPI 3 */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Active Pipeline Value</span>
            <TrendingUp className="w-4 h-4 text-teal-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold font-mono text-white tabular-nums">
              {currSymbol}
              {totalPipelineValue.toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">{clients.length} clients in CRM pipeline</p>
        </div>

        {/* KPI 4 */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Remediation Tasks</span>
            <CheckSquare className="w-4 h-4 text-teal-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-white tabular-nums">{openTasks.length}</span>
            <span className="text-xs text-slate-500 font-mono">Open</span>
          </div>
          <p className="text-[11px] text-slate-400">
            {tasks.filter((t) => t.status === 'done').length} verified resolved
          </p>
        </div>
      </div>

      {/* Main Grid: Latest Audit Summary & Active Sites */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Latest Audit Card */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="text-teal-400 font-mono">Latest Completed Audit</span>
                <span>·</span>
                <span>{latestAudit?.strategy === 'mobile' ? 'Mobile 4G' : 'Desktop'}</span>
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight truncate mt-0.5">
                {latestAudit?.url || 'No audits yet'}
              </h3>
            </div>
            <button
              onClick={() => onNavigate('audit-runner')}
              className="text-xs text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1"
            >
              <span>View Full Report</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {latestAudit?.scores && (
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
                <p className="text-xs text-slate-400 mb-1">Performance</p>
                <p className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                  {latestAudit.scores.performance}
                </p>
              </div>
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
                <p className="text-xs text-slate-400 mb-1">Accessibility</p>
                <p className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                  {latestAudit.scores.accessibility}
                </p>
              </div>
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
                <p className="text-xs text-slate-400 mb-1">Best Practices</p>
                <p className="text-xl font-bold font-mono text-teal-300 tabular-nums">
                  {latestAudit.scores.bestPractices}
                </p>
              </div>
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
                <p className="text-xs text-slate-400 mb-1">SEO</p>
                <p className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                  {latestAudit.scores.seo}
                </p>
              </div>
            </div>
          )}

          {latestAudit?.aiSummary && (
            <div className="p-4 bg-slate-950/40 border border-slate-800/80 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Executive Gemini Briefing</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                {latestAudit.aiSummary}
              </p>
            </div>
          )}
        </div>

        {/* Website Projects Portfolio */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white">Monitored Websites</h3>
            <button
              onClick={() => onNavigate('projects')}
              className="text-xs text-teal-400 hover:text-teal-300 font-medium"
            >
              Manage ({websites.length})
            </button>
          </div>

          <div className="space-y-3">
            {websites.slice(0, 3).map((site) => (
              <div
                key={site.id}
                className="p-3 bg-slate-950/50 border border-slate-800 rounded-lg flex items-center justify-between gap-3 text-xs"
              >
                <div className="truncate min-w-0">
                  <p className="font-semibold text-slate-200 truncate">{site.name}</p>
                  <p className="text-[11px] font-mono text-slate-400 truncate">{site.url}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono tabular-nums font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                    {site.lastAuditScore || 80}/100
                  </span>
                  <button
                    onClick={() => onNavigate('audit-runner')}
                    className="p-1 hover:text-white text-slate-400"
                    title="Audit Now"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigate('projects')}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700/80 text-xs font-semibold text-slate-200 rounded-lg transition-colors border border-slate-700/60"
          >
            + Add New Website Project
          </button>
        </div>
      </div>

      {/* Bottom Grid: CRM Highlights & Open Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* CRM Pipeline Sneak Peek */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-400" />
              <h3 className="text-base font-bold text-white">Client Opportunities</h3>
            </div>
            <button
              onClick={() => onNavigate('crm')}
              className="text-xs text-teal-400 hover:text-teal-300 font-medium"
            >
              Open CRM
            </button>
          </div>

          <div className="space-y-2.5">
            {clients.slice(0, 3).map((client) => (
              <div
                key={client.id}
                className="p-3 bg-slate-950/50 border border-slate-800 rounded-lg flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-semibold text-white">{client.company}</p>
                  <p className="text-[11px] text-slate-400">{client.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-teal-400 tabular-nums">
                    {currSymbol}
                    {(client.estimatedValue || 0).toLocaleString()}
                  </p>
                  <p className="text-[11px] text-slate-400 capitalize">
                    {client.status.replace('_', ' ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks Sneak Peek */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-teal-400" />
              <h3 className="text-base font-bold text-white">Pending Remediation Tasks</h3>
            </div>
            <button
              onClick={() => onNavigate('tasks')}
              className="text-xs text-teal-400 hover:text-teal-300 font-medium"
            >
              Task Board ({openTasks.length})
            </button>
          </div>

          <div className="space-y-2.5">
            {openTasks.slice(0, 3).map((task) => (
              <div
                key={task.id}
                className="p-3 bg-slate-950/50 border border-slate-800 rounded-lg flex items-center justify-between text-xs"
              >
                <div className="truncate pr-3">
                  <p className="font-medium text-slate-200 truncate">{task.title}</p>
                  <p className="text-[11px] text-slate-400">Due: {task.dueDate || 'Flexible'}</p>
                </div>
                <span
                  className={`text-[11px] font-mono uppercase px-2 py-0.5 rounded shrink-0 ${
                    task.priority === 'high'
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
