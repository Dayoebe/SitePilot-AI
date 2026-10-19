import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Filter,
  DollarSign,
  Calendar,
  Sparkles,
  FileCheck2,
  Mail,
  Phone,
  ExternalLink,
  ChevronRight,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { ClientRecord, ClientStatus } from '../../types';

interface CrmViewProps {
  onNavigate: (view: string) => void;
}

const pipelineStages: { id: ClientStatus; label: string; color: string }[] = [
  { id: 'prospect', label: 'New Prospect', color: 'border-slate-700' },
  { id: 'researching', label: 'Researching', color: 'border-blue-500/40' },
  { id: 'contacted', label: 'Contacted', color: 'border-purple-500/40' },
  { id: 'replied', label: 'Replied', color: 'border-teal-500/40' },
  { id: 'meeting_scheduled', label: 'Meeting Scheduled', color: 'border-amber-500/40' },
  { id: 'proposal_sent', label: 'Proposal Sent', color: 'border-cyan-500/40' },
  { id: 'won', label: 'Won Retainer', color: 'border-emerald-500/50' },
  { id: 'lost', label: 'Lost / Shelved', color: 'border-slate-800' },
];

export const CrmView: React.FC<CrmViewProps> = ({ onNavigate }) => {
  const { clients, addClient, updateClientStatus, currency, currentAudit } = useWorkspace();
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [selectedClientForProposal, setSelectedClientForProposal] = useState<ClientRecord | null>(null);
  const [proposalData, setProposalData] = useState<any>(null);
  const [isGeneratingProposal, setIsGeneratingProposal] = useState(false);

  const [newClient, setNewClient] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    websiteUrl: '',
    status: 'prospect' as ClientStatus,
    estimatedValue: 2500,
    notes: '',
  });

  const currSymbol = currency === 'USD' ? '$' : currency === 'NGN' ? '₦' : currency === 'GBP' ? '£' : '€';

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.name || !newClient.company || !newClient.email) return;

    await addClient({
      name: newClient.name.trim(),
      company: newClient.company.trim(),
      email: newClient.email.trim(),
      phone: newClient.phone.trim(),
      websiteUrl: newClient.websiteUrl.trim(),
      status: newClient.status,
      estimatedValue: Number(newClient.estimatedValue) || 0,
      currency,
      notes: newClient.notes.trim(),
      lastContactDate: new Date().toISOString(),
    });

    setNewClient({
      name: '',
      company: '',
      email: '',
      phone: '',
      websiteUrl: '',
      status: 'prospect',
      estimatedValue: 2500,
      notes: '',
    });
    setShowAddModal(false);
  };

  const handleGenerateProposal = async (client: ClientRecord) => {
    setSelectedClientForProposal(client);
    setShowProposalModal(true);
    setIsGeneratingProposal(true);

    try {
      const response = await fetch('/api/v1/ai/proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: client.name,
          company: client.company,
          websiteUrl: client.websiteUrl || currentAudit?.url || 'Client Website',
          currency,
          selectedIssues: (currentAudit?.opportunities || []).map((o) => o.title),
        }),
      });

      if (!response.ok) throw new Error('Proposal generation error');
      const data = await response.json();
      setProposalData(data);
    } catch (err) {
      console.warn('Proposal generation notice:', err);
    } finally {
      setIsGeneratingProposal(false);
    }
  };

  const filteredClients = clients.filter(
    (c) =>
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Clients & Prospects CRM</h1>
          <p className="text-xs text-slate-400 mt-1">
            Track prospective client audits, follow-up dates, pipeline values, and convert findings into approved proposals.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Client</span>
        </button>
      </div>

      {/* Search & Overview Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clients, company or email..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-4">
          <span>
            Total Prospects: <strong className="text-white font-mono">{clients.length}</strong>
          </span>
          <span>·</span>
          <span>
            Total Value:{' '}
            <strong className="text-teal-400 font-mono">
              {currSymbol}
              {clients.reduce((acc, c) => acc + (c.estimatedValue || 0), 0).toLocaleString()}
            </strong>
          </span>
        </div>
      </div>

      {/* Kanban / Pipeline View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {pipelineStages.slice(0, 4).map((stage) => {
          const stageClients = filteredClients.filter((c) => c.status === stage.id);
          return (
            <div key={stage.id} className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white uppercase tracking-wider">{stage.label}</span>
                <span className="text-[11px] font-mono text-slate-400 px-1.5 py-0.2 rounded bg-slate-800">
                  {stageClients.length}
                </span>
              </div>

              <div className="space-y-3">
                {stageClients.length === 0 ? (
                  <p className="text-[11px] text-slate-500 py-4 text-center">No clients in this stage.</p>
                ) : (
                  stageClients.map((client) => (
                    <div
                      key={client.id}
                      className="p-3 bg-slate-950 border border-slate-800/90 rounded-lg space-y-2 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-white text-xs">{client.company}</p>
                          <p className="text-[11px] text-slate-400">{client.name}</p>
                        </div>
                        <span className="font-mono text-xs font-bold text-teal-400 tabular-nums">
                          {currSymbol}
                          {(client.estimatedValue || 0).toLocaleString()}
                        </span>
                      </div>

                      {client.websiteUrl && (
                        <p className="text-[11px] font-mono text-slate-500 truncate">{client.websiteUrl}</p>
                      )}

                      {client.notes && (
                        <p className="text-[11px] text-slate-400 line-clamp-2 italic">{client.notes}</p>
                      )}

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                        <select
                          value={client.status}
                          onChange={(e) => updateClientStatus(client.id, e.target.value as any)}
                          className="bg-slate-900 border border-slate-800 text-[11px] text-slate-300 rounded px-1.5 py-0.5 focus:outline-none"
                        >
                          {pipelineStages.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.label}
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={() => handleGenerateProposal(client)}
                          className="text-[11px] text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Proposal</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Add New Client or Prospect</h3>

            <form onSubmit={handleCreateClient} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-slate-300 block mb-1">Contact Name</label>
                <input
                  type="text"
                  required
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  placeholder="e.g. Tunde Adeleke"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="font-medium text-slate-300 block mb-1">Company / Brand Name</label>
                <input
                  type="text"
                  required
                  value={newClient.company}
                  onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
                  placeholder="e.g. Lagos Logistics Ltd"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-300 block mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    placeholder="tunde@company.ng"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-300 block mb-1">Phone</label>
                  <input
                    type="text"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    placeholder="+234 802 345 6789"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-300 block mb-1">Website URL</label>
                  <input
                    type="text"
                    value={newClient.websiteUrl}
                    onChange={(e) => setNewClient({ ...newClient, websiteUrl: e.target.value })}
                    placeholder="https://client.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-300 block mb-1">Estimated Value ({currency})</label>
                  <input
                    type="number"
                    value={newClient.estimatedValue}
                    onChange={(e) => setNewClient({ ...newClient, estimatedValue: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-slate-300 block mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={newClient.notes}
                  onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                  placeholder="Key context or preliminary audit discussion notes..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                />
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
                  Save Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Proposal Generator Modal */}
      {showProposalModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold uppercase">
                  <Sparkles className="w-4 h-4" />
                  <span>Gemini Proposal Generator</span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">
                  Draft Proposal for {selectedClientForProposal?.company}
                </h3>
              </div>
              <button
                onClick={() => setShowProposalModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {isGeneratingProposal ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-400">
                  Synthesizing audit findings into professional remediation deliverables & pricing...
                </p>
              </div>
            ) : proposalData ? (
              <div className="space-y-6 text-xs">
                <div>
                  <h4 className="font-bold text-white text-sm">{proposalData.proposalTitle}</h4>
                  <p className="text-slate-300 mt-2 leading-relaxed">{proposalData.clientExecutiveSummary}</p>
                </div>

                {/* Deliverables */}
                <div className="space-y-3">
                  <h5 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
                    Remediation Phases & Estimated Investment
                  </h5>
                  <div className="space-y-2">
                    {proposalData.deliverables?.map((del: any, idx: number) => (
                      <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                        <div className="flex items-center justify-between font-semibold text-white">
                          <span>{del.phase}</span>
                          <span className="font-mono text-teal-400">
                            {currSymbol}
                            {del.estimatedCost} (~{del.estimatedHours} hrs)
                          </span>
                        </div>
                        <ul className="list-disc list-inside text-slate-400 space-y-0.5">
                          {del.tasks?.map((t: string, ti: number) => (
                            <li key={ti}>{t}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary total */}
                <div className="p-4 bg-teal-500/10 border border-teal-500/20 rounded-xl flex items-center justify-between font-mono text-sm">
                  <span className="text-white font-bold">Total Estimated Project Value:</span>
                  <span className="text-teal-400 font-bold text-base">
                    {currSymbol}
                    {proposalData.totalEstimatedCost} ({proposalData.totalEstimatedHours} hours)
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Terms & Timeline
                  </span>
                  <p className="text-slate-300 text-xs italic">{proposalData.termsAndTimeline}</p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Draft proposal ready to be copied into email or invoice.
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(proposalData, null, 2));
                      alert('Proposal draft copied to clipboard!');
                    }}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded font-semibold text-xs"
                  >
                    Copy Proposal
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
