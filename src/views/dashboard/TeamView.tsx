import React, { useState } from 'react';
import {
  ShieldCheck,
  UserPlus,
  Mail,
  Shield,
  Trash2,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface TeamMemberItem {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  joinedAt: string;
}

export const TeamView: React.FC = () => {
  const { workspace } = useWorkspace();
  const { profile } = useAuth();

  const [members, setMembers] = useState<TeamMemberItem[]>([
    {
      id: 'mem-1',
      name: profile?.displayName || 'Alex Morgan',
      email: profile?.email || 'alex.consultant@sitepilot.ai',
      role: 'owner',
      joinedAt: '2026-10-01',
    },
    {
      id: 'mem-2',
      name: 'Ibrahim Danladi',
      email: 'ibrahim.dev@agency.ng',
      role: 'admin',
      joinedAt: '2026-10-05',
    },
    {
      id: 'mem-3',
      name: 'Chioma Nwosu',
      email: 'chioma.seo@agency.ng',
      role: 'analyst',
      joinedAt: '2026-10-10',
    },
  ]);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('analyst');
  const [showInviteModal, setShowInviteModal] = useState(false);

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setMembers((prev) => [
      ...prev,
      {
        id: 'mem_' + Date.now(),
        name: inviteEmail.split('@')[0],
        email: inviteEmail.trim(),
        role: inviteRole,
        joinedAt: new Date().toISOString().split('T')[0],
      },
    ]);

    setInviteEmail('');
    setShowInviteModal(false);
    alert(`Invitation dispatched to ${inviteEmail}!`);
  };

  const roleDefinitions: Record<UserRole, string> = {
    owner: 'Full workspace authority, billing control, and tenant deletion privileges.',
    admin: 'Manage team seats, configure integrations, and edit all projects.',
    analyst: 'Run on-demand audits, generate client proposals, and edit tasks.',
    member: 'View audits, update task statuses, and inspect reports.',
    viewer: 'Strict read-only access to audit reports and monitoring dashboards.',
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Team & Role Permissions</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage multi-user workspace access with 5 Attribute-Based Access Control (ABAC) permission tiers.
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Member</span>
        </button>
      </div>

      {/* Role Definitions Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {(Object.entries(roleDefinitions) as [UserRole, string][]).map(([role, desc]) => (
          <div key={role} className="p-3.5 bg-slate-900 border border-slate-800 rounded-lg space-y-1">
            <span className="capitalize font-bold text-xs text-teal-400 block">{role}</span>
            <p className="text-[11px] text-slate-400 leading-snug">{desc}</p>
          </div>
        ))}
      </div>

      {/* Members Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Active Members ({members.length})</h3>
          <span className="text-xs text-slate-400">Workspace: {workspace.name}</span>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-4">Member Name & Email</th>
              <th className="py-3 px-4">Assigned Role</th>
              <th className="py-3 px-4">Joined Date</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4">
                  <p className="font-semibold text-white">{member.name}</p>
                  <p className="text-[11px] font-mono text-slate-400">{member.email}</p>
                </td>

                <td className="py-3.5 px-4">
                  <span
                    className={`font-mono text-xs uppercase px-2 py-0.5 rounded border ${
                      member.role === 'owner'
                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                        : member.role === 'admin'
                        ? 'bg-teal-500/10 text-teal-300 border-teal-500/30'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {member.role}
                  </span>
                </td>

                <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">{member.joinedAt}</td>

                <td className="py-3.5 px-4 text-right">
                  {member.role !== 'owner' && (
                    <button
                      onClick={() => setMembers((prev) => prev.filter((m) => m.id !== member.id))}
                      className="p-1 text-slate-500 hover:text-rose-400"
                      title="Remove Seat"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Invite Team Member</h3>

            <form onSubmit={handleSendInvite} className="space-y-4 text-xs">
              <div>
                <label className="font-medium text-slate-300 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@agency.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="font-medium text-slate-300 block mb-1">Permission Tier</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="admin">Administrator (Full Edit & Members)</option>
                  <option value="analyst">Analyst (Run Audits & CRM)</option>
                  <option value="member">Member (Tasks & Edits)</option>
                  <option value="viewer">Viewer (Read-Only)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-3.5 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-semibold"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
