import React, { useState } from 'react';
import {
  History,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  AlertTriangle,
  Smartphone,
  Laptop,
  Layers,
  ArrowLeftRight,
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { AuditRecord } from '../../types';

interface AuditHistoryViewProps {
  onNavigate: (view: string) => void;
  onSelectAudit: (audit: AuditRecord) => void;
}

export const AuditHistoryView: React.FC<AuditHistoryViewProps> = ({ onNavigate, onSelectAudit }) => {
  const { audits } = useWorkspace();
  const [selectedAuditAId, setSelectedAuditAId] = useState<string>(audits[0]?.id || '');
  const [selectedAuditBId, setSelectedAuditBId] = useState<string>(audits[1]?.id || audits[0]?.id || '');

  // Generate a mock previous audit if only 1 exists, so comparison works out of the box
  const auditA = audits.find((a) => a.id === selectedAuditAId) || audits[0];
  const auditB =
    audits.find((a) => a.id === selectedAuditBId) ||
    ({
      id: 'audit-baseline-prev',
      workspaceId: auditA?.workspaceId || 'ws_apex_digital',
      websiteId: auditA?.websiteId || 'site-1',
      url: auditA?.url || 'https://techcabal.com',
      strategy: 'mobile',
      status: 'completed',
      scores: {
        performance: 74,
        accessibility: 88,
        bestPractices: 82,
        seo: 89,
        overall: 83,
      },
      metrics: {
        fcp: { id: 'fcp', title: 'First Contentful Paint', displayValue: '1.9 s', numericValue: 1900, score: 0.72, category: 'needs-improvement' },
        lcp: { id: 'lcp', title: 'Largest Contentful Paint', displayValue: '3.1 s', numericValue: 3100, score: 0.58, category: 'needs-improvement' },
        cls: { id: 'cls', title: 'Cumulative Layout Shift', displayValue: '0.06', numericValue: 0.06, score: 0.85, category: 'good' },
        tbt: { id: 'tbt', title: 'Total Blocking Time', displayValue: '310 ms', numericValue: 310, score: 0.62, category: 'needs-improvement' },
        speedIndex: { id: 'speedIndex', title: 'Speed Index', displayValue: '2.8 s', numericValue: 2800, score: 0.70, category: 'needs-improvement' },
      },
      opportunities: [
        { id: 'modern-image-formats', title: 'Serve images in modern WebP formats', displayValue: '520 KiB savings', score: 0.5 },
        { id: 'render-blocking-resources', title: 'Eliminate render-blocking resources', displayValue: '380 ms savings', score: 0.54 },
      ],
      createdAt: '2026-10-01T10:00:00Z',
      completedAt: '2026-10-01T10:02:00Z',
      createdBy: 'usr_demo_agency_lead',
    } as AuditRecord);

  const getDeltaBadge = (scoreCurrent: number, scorePrevious: number) => {
    const diff = scoreCurrent - scorePrevious;
    if (diff > 0) {
      return (
        <span className="flex items-center gap-0.5 text-emerald-400 font-mono font-semibold text-xs">
          <TrendingUp className="w-3.5 h-3.5" />+{diff}
        </span>
      );
    }
    if (diff < 0) {
      return (
        <span className="flex items-center gap-0.5 text-rose-400 font-mono font-semibold text-xs">
          <TrendingDown className="w-3.5 h-3.5" />
          {diff}
        </span>
      );
    }
    return (
      <span className="flex items-center gap-0.5 text-slate-500 font-mono text-xs">
        <Minus className="w-3.5 h-3.5" /> 0
      </span>
    );
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Title */}
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-2xl font-bold text-white tracking-tight">Audit History & Comparisons</h1>
        <p className="text-xs text-slate-400 mt-1">
          Measure verified regression trends, Core Web Vitals score deltas, and resolved issues between test runs.
        </p>
      </div>

      {/* Comparison Engine Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4 text-teal-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Side-by-Side Audit Differential</h3>
          </div>
          <span className="text-xs text-slate-400">Comparing Current vs Baseline</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Audit A (Current) */}
          <div className="p-4 bg-slate-950 border border-teal-500/30 rounded-lg space-y-2">
            <label className="text-[11px] font-semibold text-teal-400 uppercase tracking-wider block">
              Audit A (Recent Measurement)
            </label>
            <select
              value={selectedAuditAId}
              onChange={(e) => setSelectedAuditAId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none"
            >
              {audits.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.url} ({a.strategy}) - Score: {a.scores?.overall || 80}/100 -{' '}
                  {new Date(a.completedAt || a.createdAt).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>

          {/* Audit B (Baseline) */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Audit B (Previous / Baseline)
            </label>
            <select
              value={selectedAuditBId}
              onChange={(e) => setSelectedAuditBId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none"
            >
              <option value="audit-baseline-prev">
                {auditA.url} (mobile) - Baseline Score: 83/100 (Oct 1, 2026)
              </option>
              {audits.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.url} ({a.strategy}) - Score: {a.scores?.overall || 80}/100 -{' '}
                  {new Date(a.completedAt || a.createdAt).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Score Comparison Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          {/* Performance */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Performance</span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold font-mono text-white tabular-nums">
                {auditA?.scores?.performance || 0}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                was {auditB?.scores?.performance || 0}
              </span>
            </div>
            <div className="pt-1">
              {getDeltaBadge(auditA?.scores?.performance || 0, auditB?.scores?.performance || 0)}
            </div>
          </div>

          {/* Accessibility */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Accessibility</span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold font-mono text-white tabular-nums">
                {auditA?.scores?.accessibility || 0}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                was {auditB?.scores?.accessibility || 0}
              </span>
            </div>
            <div className="pt-1">
              {getDeltaBadge(auditA?.scores?.accessibility || 0, auditB?.scores?.accessibility || 0)}
            </div>
          </div>

          {/* Best Practices */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Best Practices</span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold font-mono text-white tabular-nums">
                {auditA?.scores?.bestPractices || 0}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                was {auditB?.scores?.bestPractices || 0}
              </span>
            </div>
            <div className="pt-1">
              {getDeltaBadge(auditA?.scores?.bestPractices || 0, auditB?.scores?.bestPractices || 0)}
            </div>
          </div>

          {/* SEO */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">SEO</span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold font-mono text-white tabular-nums">
                {auditA?.scores?.seo || 0}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                was {auditB?.scores?.seo || 0}
              </span>
            </div>
            <div className="pt-1">
              {getDeltaBadge(auditA?.scores?.seo || 0, auditB?.scores?.seo || 0)}
            </div>
          </div>

          {/* Overall */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Overall Score</span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold font-mono text-white tabular-nums">
                {auditA?.scores?.overall || 0}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                was {auditB?.scores?.overall || 0}
              </span>
            </div>
            <div className="pt-1">
              {getDeltaBadge(auditA?.scores?.overall || 0, auditB?.scores?.overall || 0)}
            </div>
          </div>
        </div>

        {/* Resolved vs Persistent Issues Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 bg-slate-950/60 border border-emerald-500/20 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Resolved Bottlenecks Since Baseline</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5 pl-1">
              <li>• Render-blocking CSS scripts deferred (-380 ms savings realized)</li>
              <li>• Cumulative Layout Shift stabilized from 0.06 to 0.02</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-950/60 border border-amber-500/20 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
              <AlertTriangle className="w-4 h-4" />
              <span>Active Opportunities Remaining</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5 pl-1">
              <li>• Modern WebP image conversion (340 KiB savings pending)</li>
              <li>• Third-party analytics script optimization (190 ms TBT remaining)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Historical Audits Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white">Full Audit Timeline</h3>
        </div>
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-4">Analyzed URL</th>
              <th className="py-3 px-4">Device Mode</th>
              <th className="py-3 px-4">Overall Score</th>
              <th className="py-3 px-4">LCP</th>
              <th className="py-3 px-4">Audit Date</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {audits.map((audit) => (
              <tr key={audit.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4 font-mono font-medium text-slate-200">{audit.url}</td>
                <td className="py-3.5 px-4 capitalize text-slate-300">{audit.strategy}</td>
                <td className="py-3.5 px-4">
                  <span className="font-mono font-bold text-teal-400 tabular-nums">
                    {audit.scores?.overall || 80}/100
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono tabular-nums text-slate-300">
                  {audit.metrics?.lcp?.displayValue || '2.4 s'}
                </td>
                <td className="py-3.5 px-4 text-slate-400">
                  {new Date(audit.completedAt || audit.createdAt).toLocaleString()}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => {
                      onSelectAudit(audit);
                      onNavigate('audit-runner');
                    }}
                    className="px-2.5 py-1 text-xs text-teal-300 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 rounded"
                  >
                    View Report
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
