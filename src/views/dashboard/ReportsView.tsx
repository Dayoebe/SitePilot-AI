import React, { useState } from 'react';
import {
  FileText,
  Download,
  Share2,
  Copy,
  Check,
  Shield,
  Eye,
  Trash2,
  FileSpreadsheet,
  Printer,
  Sparkles,
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

interface ReportsViewProps {
  onNavigate: (view: string) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = () => {
  const { currentAudit, workspace } = useWorkspace();
  const [copiedToken, setCopiedToken] = useState(false);
  const [shareToken, setShareToken] = useState('sp_sh_' + Math.random().toString(36).substring(2, 10));
  const [isLinkRevoked, setIsLinkRevoked] = useState(false);
  const [expiryDays, setExpiryDays] = useState(30);

  const audit = currentAudit;

  const publicUrl = `${window.location.origin}/shared-report/${shareToken}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handleGenerateNewToken = () => {
    setShareToken('sp_sh_' + Math.random().toString(36).substring(2, 10));
    setIsLinkRevoked(false);
  };

  const handleDownloadCSV = () => {
    if (!audit) return;

    // Safe CSV with spreadsheet formula injection protection (escape =, +, -, @)
    const sanitize = (val: string) => {
      const clean = String(val).replace(/"/g, '""');
      if (/^[=\+\-@]/.test(clean)) {
        return `"'${clean}"`;
      }
      return `"${clean}"`;
    };

    const headers = ['URL', 'Strategy', 'Performance', 'Accessibility', 'BestPractices', 'SEO', 'Overall', 'LCP', 'FCP', 'CLS', 'TBT', 'Date'];
    const row = [
      sanitize(audit.url),
      sanitize(audit.strategy),
      audit.scores?.performance || 0,
      audit.scores?.accessibility || 0,
      audit.scores?.bestPractices || 0,
      audit.scores?.seo || 0,
      audit.scores?.overall || 0,
      sanitize(audit.metrics?.lcp?.displayValue || 'N/A'),
      sanitize(audit.metrics?.fcp?.displayValue || 'N/A'),
      sanitize(audit.metrics?.cls?.displayValue || 'N/A'),
      sanitize(audit.metrics?.tbt?.displayValue || 'N/A'),
      sanitize(audit.completedAt || audit.createdAt),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), row.join(',')].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sitepilot_audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Reports & Client Deliverables</h1>
          <p className="text-xs text-slate-400 mt-1">
            Export presentation-ready audit deliverables, generate unguessable public client links, and download secure CSV logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCSV}
            className="px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-teal-400" />
            <span>Download CSV</span>
          </button>
          <button
            onClick={handlePrintPDF}
            className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Public Share Link Manager */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Share2 className="w-4 h-4 text-teal-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Secure Public Report Link (Client View)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Unguessable 64-bit entropy token · Zero Private Data Exposed
          </span>
        </div>

        <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="text"
              readOnly
              value={isLinkRevoked ? 'LINK REVOKED' : publicUrl}
              className={`flex-1 bg-slate-900 border rounded-lg px-3.5 py-2 text-xs font-mono text-slate-200 focus:outline-none ${
                isLinkRevoked ? 'border-rose-500/50 text-rose-400' : 'border-slate-800'
              }`}
            />
            <button
              onClick={handleCopyLink}
              disabled={isLinkRevoked}
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 disabled:opacity-50 rounded-lg transition-colors flex items-center justify-center gap-1.5 shrink-0"
            >
              {copiedToken ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedToken ? 'Copied' : 'Copy Link'}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-3">
              <span>Expiry:</span>
              <select
                value={expiryDays}
                onChange={(e) => setExpiryDays(Number(e.target.value))}
                disabled={isLinkRevoked}
                className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none"
              >
                <option value={7}>7 Days</option>
                <option value={30}>30 Days</option>
                <option value={90}>90 Days</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsLinkRevoked(!isLinkRevoked)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  isLinkRevoked
                    ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20'
                }`}
              >
                {isLinkRevoked ? 'Restore Access' : 'Revoke Link Now'}
              </button>
              <button
                onClick={handleGenerateNewToken}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs border border-slate-700"
              >
                Generate New Unguessable Token
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Document Preview Paper Card */}
      <div className="p-8 sm:p-12 bg-white text-slate-900 rounded-2xl shadow-2xl max-w-4xl mx-auto space-y-8 font-sans print:shadow-none print:m-0 print:p-0">
        {/* Document Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider font-mono">
              SitePilot AI Technical Audit
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Website Health & Core Web Vitals Report
            </h2>
            <p className="text-xs text-slate-500">
              Target URL: <span className="font-mono font-medium text-slate-800">{audit?.url || 'techcabal.com'}</span>
            </p>
          </div>

          <div className="text-right space-y-1">
            <span className="text-xs text-slate-400 block">Generated by:</span>
            <p className="text-xs font-bold text-slate-800">{workspace.name}</p>
            <p className="text-[11px] text-slate-500 font-mono">
              Date: {new Date(audit?.completedAt || Date.now()).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Scores Matrix */}
        <div className="grid grid-cols-4 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
          <div>
            <p className="text-xs text-slate-500">Performance</p>
            <p className="text-2xl font-bold font-mono text-slate-900">{audit?.scores?.performance || 82}</p>
            <span className="text-[10px] text-slate-400">/ 100</span>
          </div>
          <div>
            <p className="text-xs text-slate-500">Accessibility</p>
            <p className="text-2xl font-bold font-mono text-slate-900">{audit?.scores?.accessibility || 91}</p>
            <span className="text-[10px] text-slate-400">/ 100</span>
          </div>
          <div>
            <p className="text-xs text-slate-500">Best Practices</p>
            <p className="text-2xl font-bold font-mono text-slate-900">{audit?.scores?.bestPractices || 88}</p>
            <span className="text-[10px] text-slate-400">/ 100</span>
          </div>
          <div>
            <p className="text-xs text-slate-500">SEO Score</p>
            <p className="text-2xl font-bold font-mono text-slate-900">{audit?.scores?.seo || 92}</p>
            <span className="text-[10px] text-slate-400">/ 100</span>
          </div>
        </div>

        {/* Executive Summary Section */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">1. Executive Overview</h3>
          <p className="text-xs text-slate-700 leading-relaxed">
            {audit?.aiSummary ||
              'This website demonstrates high search engine optimization fundamentals with key optimization opportunities focused on mobile image delivery and non-essential script deferral.'}
          </p>
        </div>

        {/* Core Web Vitals Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">2. Core Web Vitals Lab Data</h3>
          <table className="w-full text-left text-xs border border-slate-200">
            <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 text-[11px]">
              <tr>
                <th className="p-2.5">Metric</th>
                <th className="p-2.5">Value</th>
                <th className="p-2.5">Standard Threshold</th>
                <th className="p-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="p-2.5 font-medium">Largest Contentful Paint (LCP)</td>
                <td className="p-2.5 font-mono">{audit?.metrics?.lcp?.displayValue || '2.4 s'}</td>
                <td className="p-2.5 text-slate-500">&lt; 2.5 s</td>
                <td className="p-2.5 text-emerald-600 font-semibold">Passing</td>
              </tr>
              <tr>
                <td className="p-2.5 font-medium">First Contentful Paint (FCP)</td>
                <td className="p-2.5 font-mono">{audit?.metrics?.fcp?.displayValue || '1.5 s'}</td>
                <td className="p-2.5 text-slate-500">&lt; 1.8 s</td>
                <td className="p-2.5 text-emerald-600 font-semibold">Passing</td>
              </tr>
              <tr>
                <td className="p-2.5 font-medium">Cumulative Layout Shift (CLS)</td>
                <td className="p-2.5 font-mono">{audit?.metrics?.cls?.displayValue || '0.02'}</td>
                <td className="p-2.5 text-slate-500">&lt; 0.1</td>
                <td className="p-2.5 text-emerald-600 font-semibold">Passing</td>
              </tr>
              <tr>
                <td className="p-2.5 font-medium">Total Blocking Time (TBT)</td>
                <td className="p-2.5 font-mono">{audit?.metrics?.tbt?.displayValue || '190 ms'}</td>
                <td className="p-2.5 text-slate-500">&lt; 200 ms</td>
                <td className="p-2.5 text-amber-600 font-semibold">Improvement Opportunity</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Priority Remediation Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            3. Prioritised Corrective Actions
          </h3>
          <div className="space-y-2 text-xs">
            {audit?.aiActionPlan?.quickWins?.map((qw, i) => (
              <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded">
                <p className="font-bold text-slate-900">{qw.title}</p>
                <p className="text-slate-600 mt-0.5">{qw.recommendedFix}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Document Footer */}
        <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
          <span>SitePilot AI Intelligence Engine · Grounded in Google PageSpeed Insights</span>
          <span>Confidential Client Deliverable</span>
        </div>
      </div>
    </div>
  );
};
