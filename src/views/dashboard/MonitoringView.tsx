import React, { useState } from 'react';
import {
  Activity,
  Play,
  Pause,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Plus,
  RefreshCw,
  BellRing,
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

interface MonitoringViewProps {
  onNavigate: (view: string) => void;
}

export const MonitoringView: React.FC<MonitoringViewProps> = ({ onNavigate }) => {
  const { websites, addWebsite } = useWorkspace();
  const [monitoredSites, setMonitoredSites] = useState(websites);
  const [alertThreshold, setAlertThreshold] = useState(75);

  const toggleMonitoring = (id: string) => {
    setMonitoredSites((prev) =>
      prev.map((site) =>
        site.id === id ? { ...site, monitoringEnabled: !site.monitoringEnabled } : site
      )
    );
  };

  const updateFrequency = (id: string, freq: 'daily' | 'weekly' | 'monthly') => {
    setMonitoredSites((prev) =>
      prev.map((site) => (site.id === id ? { ...site, monitoringFrequency: freq } : site))
    );
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Continuous Website Monitoring</h1>
          <p className="text-xs text-slate-400 mt-1">
            Automate recurring technical health checks, track regressions, and receive alerts before ranking drops.
          </p>
        </div>

        <button
          onClick={() => onNavigate('projects')}
          className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Monitored Site</span>
        </button>
      </div>

      {/* Threshold Alert Settings Strip */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
            <BellRing className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Score Regression Alert Threshold</h3>
            <p className="text-xs text-slate-400">
              Trigger an immediate in-app notification when an automated audit score drops below this score.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="font-mono text-xs text-slate-300">Alert below:</span>
          <select
            value={alertThreshold}
            onChange={(e) => setAlertThreshold(Number(e.target.value))}
            className="bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-teal-300 font-mono font-bold focus:outline-none"
          >
            <option value={85}>85 / 100 (Strict)</option>
            <option value={75}>75 / 100 (Recommended)</option>
            <option value={60}>60 / 100 (Critical Only)</option>
          </select>
        </div>
      </div>

      {/* Monitored Properties Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white">Monitored Properties ({monitoredSites.length})</h3>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-4">Website</th>
              <th className="py-3 px-4">Latest Score</th>
              <th className="py-3 px-4">Schedule Cadence</th>
              <th className="py-3 px-4">Next Automated Run</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Toggle Schedule</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {monitoredSites.map((site) => (
              <tr key={site.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4">
                  <p className="font-semibold text-white">{site.name}</p>
                  <p className="text-[11px] font-mono text-slate-400">{site.url}</p>
                </td>

                <td className="py-3.5 px-4">
                  <span
                    className={`font-mono tabular-nums font-bold text-xs px-2 py-0.5 rounded border ${
                      (site.lastAuditScore || 80) >= alertThreshold
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    {site.lastAuditScore || 80}/100
                  </span>
                </td>

                <td className="py-3.5 px-4">
                  <select
                    value={site.monitoringFrequency}
                    onChange={(e) => updateFrequency(site.id, e.target.value as any)}
                    className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-300 focus:outline-none"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </td>

                <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                  {site.monitoringEnabled ? 'Tomorrow at 04:00 UTC' : 'Paused'}
                </td>

                <td className="py-3.5 px-4">
                  {site.monitoringEnabled ? (
                    <span className="flex items-center gap-1.5 text-teal-400 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400" /> Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-600" /> Paused
                    </span>
                  )}
                </td>

                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => toggleMonitoring(site.id)}
                    className={`px-3 py-1 rounded text-xs font-medium border transition-colors ${
                      site.monitoringEnabled
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                        : 'bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 border-teal-500/30'
                    }`}
                  >
                    {site.monitoringEnabled ? 'Pause' : 'Resume'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Execution Log */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
        <h3 className="text-sm font-bold text-white">Recent Automated Run Logs</h3>
        <div className="space-y-2 text-xs">
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-mono text-slate-200">https://techcabal.com</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400">Weekly automated audit finished (Score 88/100)</span>
            </div>
            <span className="font-mono text-[11px] text-slate-500">Oct 17, 14:30 UTC</span>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-mono text-slate-200">https://lagoslogistics.example.ng</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400">Daily check triggered alert: TTFB delay dropped score to 71</span>
            </div>
            <span className="font-mono text-[11px] text-slate-500">Oct 18, 09:15 UTC</span>
          </div>
        </div>
      </div>
    </div>
  );
};
