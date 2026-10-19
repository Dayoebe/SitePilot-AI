/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WorkspaceProvider, useWorkspace } from './context/WorkspaceContext';

import { PublicNavbar } from './components/layout/PublicNavbar';
import { PublicFooter } from './components/layout/PublicFooter';
import { DashboardHeader } from './components/layout/DashboardHeader';
import { DashboardSidebar } from './components/layout/DashboardSidebar';
import { AuthModal } from './components/auth/AuthModal';

import { HomeView } from './views/public/HomeView';
import { FeaturesView } from './views/public/FeaturesView';
import { HowItWorksView } from './views/public/HowItWorksView';
import { PricingView } from './views/public/PricingView';
import { SampleReportView } from './views/public/SampleReportView';
import { ContactView } from './views/public/ContactView';
import { LegalView } from './views/public/LegalView';

import { OverviewView } from './views/dashboard/OverviewView';
import { ProjectsView } from './views/dashboard/ProjectsView';
import { AuditRunnerView } from './views/dashboard/AuditRunnerView';
import { AuditHistoryView } from './views/dashboard/AuditHistoryView';
import { MonitoringView } from './views/dashboard/MonitoringView';
import { AiRecommendationsView } from './views/dashboard/AiRecommendationsView';
import { ReportsView } from './views/dashboard/ReportsView';
import { CrmView } from './views/dashboard/CrmView';
import { TasksView } from './views/dashboard/TasksView';
import { AutomationsView } from './views/dashboard/AutomationsView';
import { TeamView } from './views/dashboard/TeamView';
import { IntegrationsView } from './views/dashboard/IntegrationsView';
import { SubscriptionView } from './views/dashboard/SubscriptionView';
import { SettingsView } from './views/dashboard/SettingsView';
import { HelpView } from './views/dashboard/HelpView';

import { AuditRecord } from './types';

function MainApp() {
  const { user, profile } = useAuth();
  const { setCurrentAudit, runNewAudit } = useWorkspace();

  // Navigation state: 'public:*' or 'app:*'
  const [currentRoute, setCurrentRoute] = useState<string>('public:home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const isDashboard = currentRoute.startsWith('app:');
  const subView = isDashboard
    ? currentRoute.replace('app:', '')
    : currentRoute.replace('public:', '');

  const handleNavigate = (target: string) => {
    if (target.startsWith('app-')) {
      setCurrentRoute(`app:${target.replace('app-', '')}`);
    } else if (
      [
        'overview',
        'projects',
        'audit-runner',
        'audit-history',
        'monitoring',
        'ai-recommendations',
        'reports',
        'crm',
        'tasks',
        'automations',
        'team',
        'integrations',
        'subscription',
        'settings',
        'help',
      ].includes(target)
    ) {
      setCurrentRoute(`app:${target}`);
    } else {
      setCurrentRoute(`public:${target}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuditFromHome = async (url: string, strategy: 'mobile' | 'desktop') => {
    try {
      await runNewAudit(url, strategy);
      setCurrentRoute('app:audit-runner');
    } catch (err: any) {
      console.warn('Audit submission notice:', err?.message);
    }
  };

  const handleSelectAudit = (audit: AuditRecord) => {
    setCurrentAudit(audit);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500/30 selection:text-teal-200">
      {/* Public Experience */}
      {!isDashboard ? (
        <>
          <PublicNavbar
            currentTab={subView}
            onNavigate={handleNavigate}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />

          <main className="flex-1">
            {subView === 'home' && (
              <HomeView
                onNavigate={handleNavigate}
                onAuditStarted={handleAuditFromHome}
              />
            )}
            {subView === 'features' && (
              <FeaturesView
                onNavigate={handleNavigate}
                onOpenAuth={() => setIsAuthModalOpen(true)}
              />
            )}
            {subView === 'how-it-works' && (
              <HowItWorksView onNavigate={handleNavigate} />
            )}
            {subView === 'pricing' && (
              <PricingView
                onNavigate={handleNavigate}
                onOpenAuth={() => setIsAuthModalOpen(true)}
              />
            )}
            {subView === 'sample-report' && (
              <SampleReportView
                onNavigate={handleNavigate}
                onOpenAuth={() => setIsAuthModalOpen(true)}
              />
            )}
            {subView === 'contact' && (
              <ContactView onNavigate={handleNavigate} />
            )}
            {subView === 'privacy' && (
              <LegalView type="privacy" onNavigate={handleNavigate} />
            )}
            {subView === 'terms' && (
              <LegalView type="terms" onNavigate={handleNavigate} />
            )}
          </main>

          <PublicFooter onNavigate={handleNavigate} />
        </>
      ) : (
        /* Authenticated Workspace Experience */
        <div className="flex h-screen overflow-hidden bg-slate-950">
          <DashboardSidebar
            currentView={subView}
            onNavigate={handleNavigate}
            onBackToHome={() => setCurrentRoute('public:home')}
          />

          <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
            <DashboardHeader
              currentView={subView}
              onNavigate={handleNavigate}
            />

            <main className="flex-1 pb-16">
              {subView === 'overview' && <OverviewView onNavigate={handleNavigate} />}
              {subView === 'projects' && (
                <ProjectsView
                  onNavigate={handleNavigate}
                  onAuditSite={(url) => {
                    handleAuditFromHome(url, 'mobile');
                  }}
                />
              )}
              {subView === 'audit-runner' && <AuditRunnerView onNavigate={handleNavigate} />}
              {subView === 'audit-history' && (
                <AuditHistoryView
                  onNavigate={handleNavigate}
                  onSelectAudit={handleSelectAudit}
                />
              )}
              {subView === 'monitoring' && <MonitoringView onNavigate={handleNavigate} />}
              {subView === 'ai-recommendations' && (
                <AiRecommendationsView onNavigate={handleNavigate} />
              )}
              {subView === 'reports' && <ReportsView onNavigate={handleNavigate} />}
              {subView === 'crm' && <CrmView onNavigate={handleNavigate} />}
              {subView === 'tasks' && <TasksView onNavigate={handleNavigate} />}
              {subView === 'automations' && <AutomationsView onNavigate={handleNavigate} />}
              {subView === 'team' && <TeamView />}
              {subView === 'integrations' && <IntegrationsView />}
              {subView === 'subscription' && <SubscriptionView />}
              {subView === 'settings' && <SettingsView />}
              {subView === 'help' && <HelpView />}
            </main>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          setCurrentRoute('app:overview');
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <WorkspaceProvider>
        <MainApp />
      </WorkspaceProvider>
    </AuthProvider>
  );
}
