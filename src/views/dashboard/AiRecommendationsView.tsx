import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Code2,
  Clock,
  Filter,
  CheckSquare,
  ShieldCheck,
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

interface AiRecommendationsViewProps {
  onNavigate: (view: string) => void;
}

export const AiRecommendationsView: React.FC<AiRecommendationsViewProps> = ({ onNavigate }) => {
  const { currentAudit, addTask } = useWorkspace();
  const [filterAudience, setFilterAudience] = useState<'all' | 'developer' | 'business'>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<'all' | 'easy' | 'moderate' | 'hard'>('all');

  const actionPlan = currentAudit?.aiActionPlan;

  const allItems = [
    ...(actionPlan?.quickWins || []),
    ...(actionPlan?.highImpact || []),
    ...(actionPlan?.longTerm || []),
  ];

  const filteredItems = allItems.filter((item) => {
    const matchAudience = filterAudience === 'all' || item.audience === filterAudience;
    const matchDiff = filterDifficulty === 'all' || item.difficulty === filterDifficulty;
    return matchAudience && matchDiff;
  });

  const handleCreateTask = async (title: string, desc: string, priority: 'high' | 'medium' | 'low') => {
    await addTask({
      title,
      description: desc,
      priority,
      status: 'todo',
      dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      auditId: currentAudit?.id,
    });
    alert(`Task created: "${title}" in Remediation Tasks!`);
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Title */}
      <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-teal-400 mb-1">
            <Sparkles className="w-4 h-4" />
            <span className="font-semibold uppercase tracking-wider">Gemini Strategic Synthesis</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">AI Recommendations & Action Plan</h1>
          <p className="text-xs text-slate-400 mt-1">
            Grounded in verified audit findings for {currentAudit?.url || 'analyzed website'}.
          </p>
        </div>

        <button
          onClick={() => onNavigate('tasks')}
          className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 flex items-center gap-1.5 shrink-0"
        >
          <CheckSquare className="w-4 h-4 text-teal-400" />
          <span>Go to Task Board</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-medium text-slate-300">Filter Recommendations:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Audience Filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {(['all', 'developer', 'business'] as const).map((aud) => (
              <button
                key={aud}
                onClick={() => setFilterAudience(aud)}
                className={`px-2.5 py-1 rounded capitalize transition-colors ${
                  filterAudience === aud
                    ? 'bg-slate-800 text-teal-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {aud}
              </button>
            ))}
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {(['all', 'easy', 'moderate', 'hard'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setFilterDifficulty(diff)}
                className={`px-2.5 py-1 rounded capitalize transition-colors ${
                  filterDifficulty === diff
                    ? 'bg-slate-800 text-teal-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations Cards */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-slate-900 border border-slate-800 rounded-xl">
            No recommendations found matching current filters.
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4 hover:border-slate-700 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <span
                    className={`text-[11px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                      item.priority === 'critical'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : item.priority === 'high'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-teal-500/10 text-teal-300 border-teal-500/30'
                    }`}
                  >
                    {item.priority}
                  </span>
                  <h3 className="text-base font-bold text-white">{item.title}</h3>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                  <span className="capitalize">Audience: {item.audience}</span>
                  <span>·</span>
                  <span className="capitalize">Effort: ~{item.estimatedEffortHours} hrs</span>
                </div>
              </div>

              {/* Finding & Evidence */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-950/60 rounded border border-slate-800/80 space-y-1">
                  <span className="text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                    Technical Finding
                  </span>
                  <p className="text-slate-300">{item.finding}</p>
                </div>
                <div className="p-3 bg-slate-950/60 rounded border border-slate-800/80 space-y-1">
                  <span className="text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                    Source Evidence
                  </span>
                  <p className="text-teal-400 font-mono">{item.evidence}</p>
                </div>
              </div>

              {/* Why it matters */}
              <div className="text-xs text-slate-300 leading-relaxed">
                <span className="text-slate-400 font-medium">Why It Matters: </span>
                {item.whyItMatters}
              </div>

              {/* Code Remediation Snippet */}
              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-teal-400">
                  <Code2 className="w-4 h-4" />
                  <span>Recommended Remediation Code / Strategy</span>
                </div>
                <p className="text-xs font-mono text-slate-200 bg-slate-900 p-3 rounded border border-slate-800">
                  {item.recommendedFix}
                </p>
                {item.implementationSteps && item.implementationSteps.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Step-by-Step Implementation:
                    </span>
                    <ol className="list-decimal list-inside space-y-1 text-xs text-slate-300 pl-1">
                      {item.implementationSteps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>

              {/* Bottom Validation & Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                  <span>Validation Method: {item.validationMethod}</span>
                </div>

                <button
                  onClick={() =>
                    handleCreateTask(
                      item.title,
                      `Remediation Fix: ${item.recommendedFix}\nEvidence: ${item.evidence}\nValidation: ${item.validationMethod}`,
                      item.priority === 'critical' ? 'high' : (item.priority as any)
                    )
                  }
                  className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>+ Create Task in Workspace</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
