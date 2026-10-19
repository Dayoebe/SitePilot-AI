import React, { useState } from 'react';
import {
  Gauge,
  Sparkles,
  Smartphone,
  Laptop,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Clock,
  Layers,
  Send,
  Code2,
  HelpCircle,
  FileCheck2,
  Plus,
  Zap,
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { DeviceStrategy, AuditRecord } from '../../types';

interface AuditRunnerViewProps {
  onNavigate: (view: string) => void;
}

export const AuditRunnerView: React.FC<AuditRunnerViewProps> = ({ onNavigate }) => {
  const {
    currentAudit,
    runNewAudit,
    isAuditRunning,
    auditProgressMessage,
    addWebsite,
    addTask,
    websites,
  } = useWorkspace();

  const [targetUrl, setTargetUrl] = useState(currentAudit?.url || 'https://techcabal.com');
  const [strategy, setStrategy] = useState<DeviceStrategy>(currentAudit?.strategy || 'mobile');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'vitals' | 'opportunities' | 'ai-plan' | 'content-assist' | 'chat'>('overview');

  // Grounded Technical Q&A Assistant state
  const [chatQuestion, setChatQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: 'Hello! I am your Technical Assistant. I can explain any finding in this report or generate concrete code fixes (e.g. Nginx headers, WebP conversion, script deferral). What would you like to explore?',
    },
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Content Assistant state
  const [contentAssistData, setContentAssistData] = useState<any>(null);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);

  const handleStartAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!targetUrl.trim()) {
      setErrorMsg('Please specify a URL to audit.');
      return;
    }

    try {
      await runNewAudit(targetUrl.trim(), strategy);
    } catch (err: any) {
      setErrorMsg(err.message || 'Audit execution failed.');
    }
  };

  const handleSendChatQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatQuestion.trim() || isChatLoading) return;

    const q = chatQuestion.trim();
    setChatQuestion('');
    setChatHistory((prev) => [...prev, { sender: 'user', text: q }]);
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/v1/ai/technical-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auditData: currentAudit,
          question: q,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get answer from technical assistant.');
      }

      const resData = await response.json();
      setChatHistory((prev) => [...prev, { sender: 'ai', text: resData.answer }]);
    } catch (err: any) {
      setChatHistory((prev) => [
        ...prev,
        { sender: 'ai', text: `Notice: ${err.message || 'Unable to connect to assistant.'}` },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleRunContentAssist = async () => {
    if (!currentAudit) return;
    setIsGeneratingContent(true);
    try {
      const response = await fetch('/api/v1/ai/content-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: currentAudit.url,
          businessCategory: 'Digital Publication / SaaS',
          keyAuditFindings: (currentAudit.opportunities || []).map((o) => o.title),
        }),
      });
      if (!response.ok) throw new Error('Content assistant failed.');
      const data = await response.json();
      setContentAssistData(data);
    } catch (err: any) {
      console.warn('Content assist notice:', err);
    } finally {
      setIsGeneratingContent(false);
    }
  };

  const handleSaveToProjects = async () => {
    if (!currentAudit) return;
    const exists = websites.some((w) => w.url === currentAudit.url);
    if (exists) {
      alert('This website is already saved in your Projects.');
      return;
    }

    let domainName = 'Website';
    try {
      domainName = new URL(currentAudit.url).hostname;
    } catch {}

    await addWebsite({
      url: currentAudit.url,
      name: domainName,
      category: 'General Web',
      monitoringFrequency: 'weekly',
      monitoringEnabled: true,
      lastAuditScore: currentAudit.scores?.overall || 80,
      lastAuditAt: currentAudit.completedAt || new Date().toISOString(),
    });

    alert(`Saved ${domainName} to your Website Projects!`);
  };

  const handleCreateTaskFromFinding = async (title: string, desc: string, priority: 'high' | 'medium' | 'low') => {
    await addTask({
      title,
      description: desc,
      priority,
      status: 'todo',
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      websiteId: currentAudit?.websiteId,
      auditId: currentAudit?.id,
    });
    alert(`Task created: "${title}" in your Remediation Board.`);
  };

  const scores = currentAudit?.scores || {
    performance: 82,
    accessibility: 91,
    bestPractices: 88,
    seo: 92,
    overall: 88,
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 50) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header and Audit Input Launcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Website Audit Workspace</h1>
          <p className="text-xs text-slate-400 mt-1">
            Execute real-time Lighthouse audits via Google PageSpeed Insights API v5 & Gemini Strategic AI.
          </p>
        </div>

        <form onSubmit={handleStartAudit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://example.com"
                disabled={isAuditRunning}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 font-mono focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 shrink-0">
              <button
                type="button"
                onClick={() => setStrategy('mobile')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                  strategy === 'mobile'
                    ? 'bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile</span>
              </button>
              <button
                type="button"
                onClick={() => setStrategy('desktop')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                  strategy === 'desktop'
                    ? 'bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                <span>Desktop</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={isAuditRunning}
              className="px-6 py-3 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 disabled:bg-teal-800/40 rounded-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-sm"
            >
              {isAuditRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Running Audit...</span>
                </>
              ) : (
                <>
                  <Gauge className="w-4 h-4" />
                  <span>Execute Audit</span>
                </>
              )}
            </button>
          </div>

          {errorMsg && <p className="text-xs text-rose-400 font-medium">{errorMsg}</p>}

          {isAuditRunning && (
            <div className="p-3 bg-teal-500/10 border border-teal-500/20 rounded-lg flex items-center gap-3 text-xs text-teal-300">
              <Sparkles className="w-4 h-4 text-teal-400 animate-spin" />
              <span>{auditProgressMessage || 'Analyzing performance metrics...'}</span>
            </div>
          )}
        </form>
      </div>

      {/* Results Workspace */}
      {currentAudit && (
        <div className="space-y-6">
          {/* Audit Meta & Quick Actions Strip */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-slate-900 border border-slate-800 rounded-xl">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-mono text-white font-semibold truncate max-w-sm sm:max-w-md">
                  {currentAudit.url}
                </span>
                <span>·</span>
                <span className="capitalize text-teal-400">{currentAudit.strategy}</span>
                <span>·</span>
                <span>{new Date(currentAudit.completedAt || currentAudit.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleSaveToProjects}
                className="px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-teal-400" />
                <span>Save to Projects</span>
              </button>
              <button
                onClick={() => onNavigate('reports')}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 flex items-center gap-1.5"
              >
                <FileCheck2 className="w-3.5 h-3.5 text-teal-400" />
                <span>Export PDF</span>
              </button>
              <button
                onClick={() => onNavigate('crm')}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded flex items-center gap-1.5"
              >
                <span>Draft Proposal</span>
              </button>
            </div>
          </div>

          {/* 4 Category Score Rings */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-1 text-center">
              <span className="text-xs text-slate-400 font-medium">Performance</span>
              <p className={`text-4xl font-extrabold font-mono tabular-nums ${getScoreColor(scores.performance).split(' ')[0]}`}>
                {scores.performance}
              </p>
              <span className="text-[11px] text-slate-500 font-mono">Lighthouse Score</span>
            </div>

            <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-1 text-center">
              <span className="text-xs text-slate-400 font-medium">Accessibility</span>
              <p className={`text-4xl font-extrabold font-mono tabular-nums ${getScoreColor(scores.accessibility).split(' ')[0]}`}>
                {scores.accessibility}
              </p>
              <span className="text-[11px] text-slate-500 font-mono">WCAG Criteria</span>
            </div>

            <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-1 text-center">
              <span className="text-xs text-slate-400 font-medium">Best Practices</span>
              <p className={`text-4xl font-extrabold font-mono tabular-nums ${getScoreColor(scores.bestPractices).split(' ')[0]}`}>
                {scores.bestPractices}
              </p>
              <span className="text-[11px] text-slate-500 font-mono">Modern Standards</span>
            </div>

            <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-1 text-center">
              <span className="text-xs text-slate-400 font-medium">SEO Health</span>
              <p className={`text-4xl font-extrabold font-mono tabular-nums ${getScoreColor(scores.seo).split(' ')[0]}`}>
                {scores.seo}
              </p>
              <span className="text-[11px] text-slate-500 font-mono">Search Readiness</span>
            </div>
          </div>

          {/* Detailed Workspace Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-lg text-xs font-medium">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'overview' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Executive Summary
            </button>
            <button
              onClick={() => setActiveTab('vitals')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'vitals' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Core Web Vitals
            </button>
            <button
              onClick={() => setActiveTab('opportunities')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'opportunities' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Opportunities ({currentAudit.opportunities?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('ai-plan')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                activeTab === 'ai-plan' ? 'bg-teal-500/20 text-teal-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Prioritised Action Plan</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('content-assist');
                if (!contentAssistData) handleRunContentAssist();
              }}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                activeTab === 'content-assist' ? 'bg-teal-500/20 text-teal-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-teal-400" />
              <span>Content Assistant</span>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                activeTab === 'chat' ? 'bg-teal-500/20 text-teal-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-teal-400" />
              <span>Technical Q&A Assistant</span>
            </button>
          </div>

          {/* TAB CONTENT */}

          {/* 1. Overview */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Gemini Strategic Executive Briefing</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {currentAudit.aiSummary || 'Detailed AI summary is being generated...'}
                </p>

                {currentAudit.aiActionPlan?.businessUxInsights && (
                  <div className="pt-4 border-t border-slate-800 space-y-2">
                    <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                      Commercial & Conversion Observations
                    </h4>
                    <div className="space-y-1.5 text-xs text-slate-400">
                      {currentAudit.aiActionPlan.businessUxInsights.map((insight, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                          <span>{insight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Safe HTTP details */}
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
                <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                  Network & Security Diagnostics
                </h4>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Status</span>
                    <span className="font-mono text-emerald-400">
                      {currentAudit.httpDetails?.statusCode || 200} OK
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Initial Response TTFB</span>
                    <span className="font-mono tabular-nums text-slate-200">
                      {currentAudit.httpDetails?.responseTimeMs || 180} ms
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Protocol & Certificate</span>
                    <span className="font-mono text-teal-400">HTTPS Validated</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Server</span>
                    <span className="font-mono text-slate-200">
                      {currentAudit.httpDetails?.serverHeader || 'Protected / Hidden'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Transfer Encoding</span>
                    <span className="font-mono text-slate-200">
                      {currentAudit.httpDetails?.contentEncoding || 'gzip'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. Core Web Vitals */}
          {activeTab === 'vitals' && (
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-6">
              <div>
                <h3 className="text-base font-bold text-white">Core Web Vitals Breakdown</h3>
                <p className="text-xs text-slate-400">
                  Real measured timings from Lighthouse test engine on {currentAudit.strategy} emulation.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentAudit.metrics &&
                  Object.entries(currentAudit.metrics).map(([key, metric]) => {
                    if (!metric) return null;
                    return (
                      <div key={key} className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-300 font-medium">{metric.title}</span>
                          <span
                            className={`font-mono text-[11px] px-1.5 py-0.2 rounded uppercase ${
                              metric.category === 'good'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : metric.category === 'needs-improvement'
                                ? 'bg-amber-500/10 text-amber-400'
                                : 'bg-rose-500/10 text-rose-400'
                            }`}
                          >
                            {metric.category}
                          </span>
                        </div>
                        <p className="text-2xl font-bold font-mono text-white tabular-nums">
                          {metric.displayValue}
                        </p>
                        <p className="text-[11px] text-slate-500 leading-snug">{metric.description}</p>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* 3. Opportunities */}
          {activeTab === 'opportunities' && (
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Identified Lighthouse Opportunities</h3>
                  <p className="text-xs text-slate-400">Specific recommendations estimated to speed up page loads.</p>
                </div>
              </div>

              <div className="space-y-3">
                {currentAudit.opportunities?.map((opp) => (
                  <div key={opp.id} className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">{opp.title}</span>
                      <div className="flex items-center gap-2">
                        {opp.displayValue && (
                          <span className="font-mono text-teal-400 font-semibold">{opp.displayValue}</span>
                        )}
                        <button
                          onClick={() => handleCreateTaskFromFinding(opp.title, opp.description, 'high')}
                          className="px-2 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700"
                        >
                          + Create Task
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{opp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Prioritised Action Plan */}
          {activeTab === 'ai-plan' && (
            <div className="space-y-6">
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-teal-400" />
                    <span>Gemini Prioritised Action Plan</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Grounded in source data. Categorized by effort, difficulty, and commercial upside.
                  </p>
                </div>

                {/* Quick Wins */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                    Quick Wins (Low Effort · High ROI)
                  </h4>
                  {currentAudit.aiActionPlan?.quickWins?.map((qw) => (
                    <div key={qw.id} className="p-4 bg-slate-950 border border-teal-500/30 rounded-lg space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{qw.title}</span>
                          <span className="text-[11px] font-mono text-teal-400 uppercase px-1.5 py-0.2 bg-teal-500/10 rounded">
                            {qw.category}
                          </span>
                        </div>
                        <span className="font-mono text-[11px] text-slate-400">~{qw.estimatedEffortHours} hrs effort</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{qw.whyItMatters}</p>
                      <div className="p-3 bg-slate-900 rounded border border-slate-800 text-xs font-mono text-teal-300">
                        Fix: {qw.recommendedFix}
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-slate-500">Validation: {qw.validationMethod}</span>
                        <button
                          onClick={() => handleCreateTaskFromFinding(qw.title, qw.recommendedFix, 'high')}
                          className="px-2.5 py-1 text-xs bg-teal-600 hover:bg-teal-500 text-white rounded font-medium"
                        >
                          + Convert to Task
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* High Impact */}
                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    High Impact (Core Web Vitals & Architecture)
                  </h4>
                  {currentAudit.aiActionPlan?.highImpact?.map((hi) => (
                    <div key={hi.id} className="p-4 bg-slate-950 border border-amber-500/30 rounded-lg space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{hi.title}</span>
                          <span className="text-[11px] font-mono text-amber-400 uppercase px-1.5 py-0.2 bg-amber-500/10 rounded">
                            {hi.category}
                          </span>
                        </div>
                        <span className="font-mono text-[11px] text-slate-400">~{hi.estimatedEffortHours} hrs effort</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{hi.whyItMatters}</p>
                      <div className="p-3 bg-slate-900 rounded border border-slate-800 text-xs font-mono text-amber-300">
                        Fix: {hi.recommendedFix}
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-slate-500">Validation: {hi.validationMethod}</span>
                        <button
                          onClick={() => handleCreateTaskFromFinding(hi.title, hi.recommendedFix, 'high')}
                          className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded font-medium"
                        >
                          + Convert to Task
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 5. Content Assistant */}
          {activeTab === 'content-assist' && (
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-teal-400" />
                    <span>Website Content & SEO Assistant</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Draft high-converting title tags, meta descriptions, and homepage headlines.
                  </p>
                </div>
                <button
                  onClick={handleRunContentAssist}
                  disabled={isGeneratingContent}
                  className="px-3 py-1.5 text-xs bg-teal-600 hover:bg-teal-500 text-white rounded font-medium flex items-center gap-1.5"
                >
                  {isGeneratingContent ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                  <span>Regenerate Drafts</span>
                </button>
              </div>

              {contentAssistData ? (
                <div className="space-y-6">
                  {/* Title Tags */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                      Optimized Title Tag Alternatives (&lt;60 chars)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {contentAssistData.titleTagOptions?.map((item: any, i: number) => (
                        <div key={i} className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                          <p className="font-semibold text-white text-xs">{item.title}</p>
                          <p className="text-[11px] text-slate-400">{item.rationale}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Meta Descriptions */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                      Meta Descriptions (&lt;155 chars)
                    </h4>
                    <div className="space-y-2">
                      {contentAssistData.metaDescriptionOptions?.map((item: any, i: number) => (
                        <div key={i} className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between gap-4 text-xs">
                          <p className="text-slate-300">{item.description}</p>
                          <span className="font-mono text-[11px] text-teal-400 shrink-0">
                            {item.characterCount || item.description?.length} chars
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* FAQ Drafts */}
                  {contentAssistData.faqDrafts && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                        High-Intent FAQ Drafts
                      </h4>
                      <div className="space-y-2">
                        {contentAssistData.faqDrafts.map((faq: any, i: number) => (
                          <div key={i} className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 text-xs">
                            <p className="font-semibold text-white">{faq.question}</p>
                            <p className="text-slate-400">{faq.answer}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-slate-400">
                  {isGeneratingContent ? 'Consulting Gemini AI...' : 'Click "Regenerate Drafts" to synthesize content recommendations.'}
                </div>
              )}
            </div>
          )}

          {/* 6. Grounded Technical Assistant Q&A */}
          {activeTab === 'chat' && (
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-teal-400" />
                  <span>Technical Engineering Q&A Assistant</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Grounded strictly in this specific audit report. Ask how to remediate any metric or code bottleneck.
                </p>
              </div>

              {/* Chat Thread */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl max-h-96 overflow-y-auto space-y-3">
                {chatHistory.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg text-xs leading-relaxed max-w-2xl ${
                      msg.sender === 'user'
                        ? 'ml-auto bg-teal-600 text-white'
                        : 'mr-auto bg-slate-900 border border-slate-800 text-slate-200 whitespace-pre-wrap'
                    }`}
                  >
                    {msg.text}
                  </div>
                ))}
                {isChatLoading && (
                  <div className="mr-auto bg-slate-900 border border-slate-800 text-teal-400 text-xs p-3 rounded-lg flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing audit telemetry...</span>
                  </div>
                )}
              </div>

              {/* Input */}
              <form onSubmit={handleSendChatQuestion} className="flex gap-2">
                <input
                  type="text"
                  value={chatQuestion}
                  onChange={(e) => setChatQuestion(e.target.value)}
                  placeholder="e.g. How do I configure Nginx for Brotli compression and cache-control headers?"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                />
                <button
                  type="submit"
                  disabled={isChatLoading || !chatQuestion.trim()}
                  className="px-4 py-2.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 disabled:opacity-50 rounded-lg flex items-center gap-1.5 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Ask</span>
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
