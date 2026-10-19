import React, { useState } from 'react';
import {
  Workflow,
  Plus,
  Play,
  Pause,
  AlertTriangle,
  Bell,
  CheckSquare,
  Sparkles,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { AutomationRule } from '../../types';

interface AutomationsViewProps {
  onNavigate: (view: string) => void;
}

export const AutomationsView: React.FC<AutomationsViewProps> = () => {
  const { automations, addAutomation, toggleAutomation } = useWorkspace();
  const [showAddModal, setShowAddModal] = useState(false);

  const [newRule, setNewRule] = useState({
    name: '',
    triggerType: 'score_dropped' as AutomationRule['triggerType'],
    conditionThreshold: 75,
    actionType: 'notify_inapp' as AutomationRule['actionType'],
    isEnabled: true,
  });

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRule.name.trim()) return;

    await addAutomation({
      name: newRule.name.trim(),
      triggerType: newRule.triggerType,
      conditionThreshold: Number(newRule.conditionThreshold),
      actionType: newRule.actionType,
      isEnabled: newRule.isEnabled,
    });

    setNewRule({
      name: '',
      triggerType: 'score_dropped',
      conditionThreshold: 75,
      actionType: 'notify_inapp',
      isEnabled: true,
    });
    setShowAddModal(false);
  };

  const getTriggerLabel = (type: string, threshold?: number) => {
    switch (type) {
      case 'score_dropped':
        return `When overall score drops below ${threshold || 75}/100`;
      case 'audit_completed':
        return 'When any scheduled or manual audit completes';
      case 'critical_issue_found':
        return 'When a critical Core Web Vitals issue is identified';
      case 'task_overdue':
        return 'When a client remediation task becomes overdue';
      default:
        return type;
    }
  };

  const getActionLabel = (type: string) => {
    switch (type) {
      case 'notify_inapp':
        return 'Send In-App Notification to Workspace';
      case 'create_task':
        return 'Create Remediation Task in Workspace';
      case 'generate_action_plan':
        return 'Synthesize Gemini Action Plan Draft';
      default:
        return type;
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Event Automation Rules</h1>
          <p className="text-xs text-slate-400 mt-1">
            Build event-driven rules to trigger automatic tasks, alerts, and proposal drafts without manual intervention.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Automation Rule</span>
        </button>
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        {automations.map((rule) => (
          <div
            key={rule.id}
            className="p-6 bg-slate-900 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-700 transition-colors"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-md flex items-center justify-center text-xs ${
                    rule.isEnabled
                      ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  <Workflow className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">{rule.name}</h3>
              </div>

              {/* Trigger -> Action chain */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 pl-1">
                <span className="font-mono text-teal-400 font-medium">TRIGGER:</span>
                <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                  {getTriggerLabel(rule.triggerType, rule.conditionThreshold)}
                </span>
                <span className="text-slate-600">→</span>
                <span className="font-mono text-cyan-400 font-medium">ACTION:</span>
                <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                  {getActionLabel(rule.actionType)}
                </span>
              </div>

              <div className="flex items-center gap-4 text-[11px] text-slate-500 pl-1 font-mono">
                <span>Fired {rule.runCount} times</span>
                <span>·</span>
                <span>Last run: {rule.lastRunAt ? new Date(rule.lastRunAt).toLocaleDateString() : 'Never'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => toggleAutomation(rule.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
                  rule.isEnabled
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                    : 'bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 border-teal-500/30'
                }`}
              >
                {rule.isEnabled ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{rule.isEnabled ? 'Deactivate' : 'Activate'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Configure Automation Rule</h3>

            <form onSubmit={handleCreateRule} className="space-y-4 text-xs">
              <div>
                <label className="font-medium text-slate-300 block mb-1">Rule Name</label>
                <input
                  type="text"
                  required
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  placeholder="e.g. Notify on score below 80"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="font-medium text-slate-300 block mb-1">Trigger Event</label>
                <select
                  value={newRule.triggerType}
                  onChange={(e) => setNewRule({ ...newRule, triggerType: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="score_dropped">Website Score Drops Below Threshold</option>
                  <option value="audit_completed">Any Website Audit Completes</option>
                  <option value="critical_issue_found">High-Priority CWV Bottleneck Discovered</option>
                  <option value="task_overdue">Remediation Task Becomes Overdue</option>
                </select>
              </div>

              {newRule.triggerType === 'score_dropped' && (
                <div>
                  <label className="font-medium text-slate-300 block mb-1">Score Threshold (0-100)</label>
                  <input
                    type="number"
                    value={newRule.conditionThreshold}
                    onChange={(e) => setNewRule({ ...newRule, conditionThreshold: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
              )}

              <div>
                <label className="font-medium text-slate-300 block mb-1">Execute Action</label>
                <select
                  value={newRule.actionType}
                  onChange={(e) => setNewRule({ ...newRule, actionType: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="notify_inapp">Create In-App Notification</option>
                  <option value="create_task">Create Remediation Task in Board</option>
                  <option value="generate_action_plan">Generate Gemini Action Plan</option>
                </select>
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
                  Create Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
