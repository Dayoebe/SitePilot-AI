import React, { useState } from 'react';
import {
  Globe,
  Plus,
  Gauge,
  Activity,
  Trash2,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { WebsiteProject } from '../../types';

interface ProjectsViewProps {
  onNavigate: (view: string) => void;
  onAuditSite: (url: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ onNavigate, onAuditSite }) => {
  const { websites, addWebsite, deleteWebsite } = useWorkspace();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const [newSite, setNewSite] = useState({
    name: '',
    url: '',
    category: 'E-Commerce',
    monitoringFrequency: 'weekly' as 'manual' | 'daily' | 'weekly' | 'monthly',
    monitoringEnabled: true,
  });

  const categories = ['all', ...Array.from(new Set(websites.map((w) => w.category)))];

  const filteredWebsites = websites.filter((site) => {
    const matchesSearch =
      site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.url.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || site.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSite.name || !newSite.url) return;

    let cleanUrl = newSite.url.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = 'https://' + cleanUrl;
    }

    await addWebsite({
      name: newSite.name.trim(),
      url: cleanUrl,
      category: newSite.category,
      monitoringFrequency: newSite.monitoringFrequency,
      monitoringEnabled: newSite.monitoringEnabled,
      lastAuditScore: 82,
      lastAuditAt: new Date().toISOString(),
    });

    setNewSite({
      name: '',
      url: '',
      category: 'E-Commerce',
      monitoringFrequency: 'weekly',
      monitoringEnabled: true,
    });
    setShowAddModal(false);
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Website Projects</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage tracked client and portfolio properties, configure monitoring cadences, and trigger on-demand audits.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Website</span>
        </button>
      </div>

      {/* Filters Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by name or domain..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 overflow-x-auto w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded text-xs capitalize transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-slate-800 text-teal-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Table / Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Project Name & URL</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Health Score</th>
                <th className="py-3 px-4">Monitoring Cadence</th>
                <th className="py-3 px-4">Last Audit Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredWebsites.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No website projects found matching your search.
                  </td>
                </tr>
              ) : (
                filteredWebsites.map((site) => (
                  <tr key={site.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-semibold text-white">{site.name}</p>
                        <a
                          href={site.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] font-mono text-slate-400 hover:text-teal-400 flex items-center gap-1 mt-0.5"
                        >
                          <span>{site.url}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-300">
                      <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[11px]">
                        {site.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`font-mono tabular-nums font-bold text-xs px-2 py-0.5 rounded border ${
                          (site.lastAuditScore || 80) >= 90
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : (site.lastAuditScore || 80) >= 50
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        }`}
                      >
                        {site.lastAuditScore || 80}/100
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Activity className={`w-3.5 h-3.5 ${site.monitoringEnabled ? 'text-teal-400' : 'text-slate-600'}`} />
                        <span className="capitalize text-[11px]">
                          {site.monitoringEnabled ? site.monitoringFrequency : 'Paused'}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                      {site.lastAuditAt ? new Date(site.lastAuditAt).toLocaleDateString() : 'Pending'}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            onAuditSite(site.url);
                            onNavigate('audit-runner');
                          }}
                          className="px-2.5 py-1 bg-teal-600/20 hover:bg-teal-600/40 text-teal-300 rounded border border-teal-500/30 font-medium text-[11px] flex items-center gap-1"
                        >
                          <Gauge className="w-3 h-3" />
                          <span>Audit Now</span>
                        </button>
                        <button
                          onClick={() => deleteWebsite(site.id)}
                          className="p-1 text-slate-500 hover:text-rose-400"
                          title="Remove Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Website Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-5 shadow-2xl">
            <div>
              <h3 className="text-lg font-bold text-white">Add Website Project</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Register a new client or owned domain for continuous intelligence and automated audits.
              </p>
            </div>

            <form onSubmit={handleCreateWebsite} className="space-y-4 text-xs">
              <div>
                <label className="font-medium text-slate-300 block mb-1">Project / Brand Name</label>
                <input
                  type="text"
                  required
                  value={newSite.name}
                  onChange={(e) => setNewSite({ ...newSite, name: e.target.value })}
                  placeholder="e.g. Lagos Logistics Hub"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="font-medium text-slate-300 block mb-1">Website URL</label>
                <input
                  type="text"
                  required
                  value={newSite.url}
                  onChange={(e) => setNewSite({ ...newSite, url: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-white font-mono focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-300 block mb-1">Category</label>
                  <select
                    value={newSite.category}
                    onChange={(e) => setNewSite({ ...newSite, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="E-Commerce">E-Commerce</option>
                    <option value="B2B & SaaS">B2B & SaaS</option>
                    <option value="Publishing & Media">Publishing & Media</option>
                    <option value="Financial Services">Financial Services</option>
                    <option value="Agency Client">Agency Client</option>
                  </select>
                </div>

                <div>
                  <label className="font-medium text-slate-300 block mb-1">Monitoring Cadence</label>
                  <select
                    value={newSite.monitoringFrequency}
                    onChange={(e) =>
                      setNewSite({
                        ...newSite,
                        monitoringFrequency: e.target.value as any,
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="daily">Daily Schedule</option>
                    <option value="weekly">Weekly Schedule</option>
                    <option value="monthly">Monthly Schedule</option>
                    <option value="manual">Manual Only</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="monitoringEnabled"
                  checked={newSite.monitoringEnabled}
                  onChange={(e) => setNewSite({ ...newSite, monitoringEnabled: e.target.checked })}
                  className="rounded border-slate-800 text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="monitoringEnabled" className="text-slate-300">
                  Enable automated recurring health check
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-semibold"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
