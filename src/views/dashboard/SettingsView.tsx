import React, { useState } from 'react';
import {
  User,
  Shield,
  Download,
  Trash2,
  CheckCircle2,
  Lock,
  Building,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWorkspace } from '../../context/WorkspaceContext';

export const SettingsView: React.FC = () => {
  const { profile } = useAuth();
  const { workspace, setWorkspace, websites, audits, clients, tasks } = useWorkspace();
  const [wsName, setWsName] = useState(workspace.name);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    setWorkspace((prev) => ({ ...prev, name: wsName.trim() }));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportData = () => {
    const fullExport = {
      workspace,
      websites,
      audits,
      clients,
      tasks,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(fullExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sitepilot_workspace_export_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-4xl mx-auto">
      {/* Title */}
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-2xl font-bold text-white tracking-tight">Account & Workspace Settings</h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage organization branding, account security, and tenant data isolation.
        </p>
      </div>

      {/* User Profile Card */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-teal-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">User Identity</h3>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 font-bold text-sm">
            {profile?.photoURL ? (
              <img
                src={profile.photoURL}
                alt={profile.displayName || 'User'}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span>{(profile?.displayName || 'A')[0]}</span>
            )}
          </div>
          <div>
            <p className="font-semibold text-white text-sm">{profile?.displayName || 'SitePilot Analyst'}</p>
            <p className="text-xs text-slate-400">{profile?.email || 'analyst@sitepilot.ai'}</p>
            <span className="text-[11px] font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20 mt-1 inline-block">
              Authenticated via Firebase
            </span>
          </div>
        </div>
      </div>

      {/* Workspace Settings Card */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4 text-teal-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Workspace Organization</h3>
        </div>

        <form onSubmit={handleSaveWorkspace} className="space-y-4 text-xs">
          <div>
            <label className="font-medium text-slate-300 block mb-1">Organization / Agency Name</label>
            <input
              type="text"
              required
              value={wsName}
              onChange={(e) => setWsName(e.target.value)}
              className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-semibold transition-colors"
            >
              Save Organization Changes
            </button>
            {savedSuccess && (
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>Saved successfully</span>
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Compliance & Export */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-teal-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Data Privacy & Portability</h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Download a complete JSON export of all your website projects, audit telemetry, CRM clients, and tasks. SitePilot AI complies with GDPR and Nigerian Data Protection Regulation (NDPR) portability requirements.
        </p>

        <button
          onClick={handleExportData}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-teal-400" />
          <span>Export All Workspace Data (JSON)</span>
        </button>
      </div>
    </div>
  );
};
