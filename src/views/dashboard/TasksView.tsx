import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Calendar,
  Clock,
  Filter,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Layers,
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { TaskRecord, TaskPriority, TaskStatus } from '../../types';

interface TasksViewProps {
  onNavigate: (view: string) => void;
}

export const TasksView: React.FC<TasksViewProps> = () => {
  const { tasks, addTask, updateTaskStatus } = useWorkspace();
  const [filterStatus, setFilterStatus] = useState<'all' | 'todo' | 'in_progress' | 'done'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as TaskPriority,
    status: 'todo' as TaskStatus,
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    assignedTo: 'Lead Developer',
  });

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    await addTask({
      title: newTask.title.trim(),
      description: newTask.description.trim(),
      priority: newTask.priority,
      status: newTask.status,
      dueDate: newTask.dueDate,
      assignedTo: newTask.assignedTo,
    });

    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      status: 'todo',
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      assignedTo: 'Lead Developer',
    });
    setShowAddModal(false);
  };

  const filteredTasks = tasks.filter((t) => {
    if (filterStatus === 'all') return true;
    return t.status === filterStatus;
  });

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Remediation Task Tracker</h1>
          <p className="text-xs text-slate-400 mt-1">
            Track implementation progress on Core Web Vitals, accessibility, and SEO action items.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 w-fit">
        {(['all', 'todo', 'in_progress', 'done'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-md text-xs capitalize transition-colors ${
              filterStatus === st
                ? 'bg-slate-800 text-teal-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {st.replace('_', ' ')} (
            {st === 'all' ? tasks.length : tasks.filter((t) => t.status === st).length})
          </button>
        ))}
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.length === 0 ? (
          <div className="col-span-full p-8 text-center text-xs text-slate-500 bg-slate-900/50 border border-slate-800 rounded-xl">
            No tasks found in this view.
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-5 bg-slate-900 border rounded-xl flex flex-col justify-between space-y-4 transition-colors ${
                task.status === 'done' ? 'border-slate-800 opacity-75' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                      task.priority === 'high'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : task.priority === 'medium'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {task.priority} Priority
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    Due: {task.dueDate || 'Flexible'}
                  </span>
                </div>

                <h3
                  className={`text-sm font-semibold text-white ${
                    task.status === 'done' ? 'line-through text-slate-400' : ''
                  }`}
                >
                  {task.title}
                </h3>

                {task.description && (
                  <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-wrap line-clamp-3">
                    {task.description}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">Assigned: {task.assignedTo || 'Unassigned'}</span>
                <select
                  value={task.status}
                  onChange={(e) => updateTaskStatus(task.id, e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 text-[11px] text-slate-200 rounded px-2 py-1 focus:outline-none"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Resolved</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Create Remediation Task</h3>

            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-slate-300 block mb-1">Task Summary</label>
                <input
                  type="text"
                  required
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="e.g. Convert hero banner images to WebP"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="font-medium text-slate-300 block mb-1">Remediation Steps & Notes</label>
                <textarea
                  rows={3}
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Specific developer instructions, CSS classes, or Nginx directives..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-300 block mb-1">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="high">High (LCP/CWV)</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-slate-300 block mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
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
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
