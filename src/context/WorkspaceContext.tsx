import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Workspace,
  WebsiteProject,
  AuditRecord,
  ClientRecord,
  TaskRecord,
  AutomationRule,
  NotificationRecord,
  CurrencyCode,
  UserRole,
} from '../types';
import { useAuth } from './AuthContext';
import { db, handleFirestoreError, OperationType } from '../services/firebase';
import {
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  collection,
  getDocs,
  onSnapshot,
} from 'firebase/firestore';

interface WorkspaceContextType {
  workspace: Workspace;
  setWorkspace: React.Dispatch<React.SetStateAction<Workspace>>;
  websites: WebsiteProject[];
  addWebsite: (site: Omit<WebsiteProject, 'id' | 'workspaceId' | 'createdAt' | 'createdBy'>) => Promise<WebsiteProject>;
  deleteWebsite: (id: string) => Promise<void>;
  audits: AuditRecord[];
  currentAudit: AuditRecord | null;
  setCurrentAudit: (audit: AuditRecord | null) => void;
  runNewAudit: (url: string, strategy: 'mobile' | 'desktop') => Promise<AuditRecord>;
  clients: ClientRecord[];
  addClient: (client: Omit<ClientRecord, 'id' | 'workspaceId' | 'createdAt' | 'createdBy'>) => Promise<ClientRecord>;
  updateClientStatus: (id: string, status: ClientRecord['status']) => Promise<void>;
  tasks: TaskRecord[];
  addTask: (task: Omit<TaskRecord, 'id' | 'workspaceId' | 'createdAt' | 'createdBy'>) => Promise<TaskRecord>;
  updateTaskStatus: (id: string, status: TaskRecord['status']) => Promise<void>;
  automations: AutomationRule[];
  addAutomation: (rule: Omit<AutomationRule, 'id' | 'workspaceId' | 'createdAt' | 'createdBy' | 'runCount'>) => Promise<AutomationRule>;
  toggleAutomation: (id: string) => Promise<void>;
  notifications: NotificationRecord[];
  markNotificationRead: (id: string) => Promise<void>;
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  userRole: UserRole;
  isAuditRunning: boolean;
  auditProgressMessage: string;
}

const defaultWorkspace: Workspace = {
  id: 'ws_apex_digital',
  name: 'Apex Web Intelligence & Growth',
  ownerId: 'usr_demo_agency_lead',
  plan: 'pro',
  currency: 'USD',
  monthlyAuditsUsed: 14,
  monthlyAuditsLimit: 100,
  createdAt: new Date().toISOString(),
};

// Realistic initial seeded data for instant high-value experience
const initialWebsites: WebsiteProject[] = [
  {
    id: 'site-1',
    workspaceId: 'ws_apex_digital',
    name: 'TechCabal News',
    url: 'https://techcabal.com',
    category: 'Technology & Publishing',
    monitoringFrequency: 'weekly',
    monitoringEnabled: true,
    lastAuditScore: 88,
    lastAuditAt: '2026-10-17T14:30:00Z',
    createdAt: '2026-10-01T10:00:00Z',
    createdBy: 'usr_demo_agency_lead',
  },
  {
    id: 'site-2',
    workspaceId: 'ws_apex_digital',
    name: 'Lagos Logistics Hub',
    url: 'https://lagoslogistics.example.ng',
    category: 'Supply Chain & B2B',
    monitoringFrequency: 'daily',
    monitoringEnabled: true,
    lastAuditScore: 71,
    lastAuditAt: '2026-10-18T09:15:00Z',
    createdAt: '2026-10-05T12:00:00Z',
    createdBy: 'usr_demo_agency_lead',
  },
  {
    id: 'site-3',
    workspaceId: 'ws_apex_digital',
    name: 'Sterling FinTech App',
    url: 'https://sterlingfin.example.com',
    category: 'Financial Services',
    monitoringFrequency: 'weekly',
    monitoringEnabled: false,
    lastAuditScore: 94,
    lastAuditAt: '2026-10-15T18:00:00Z',
    createdAt: '2026-10-10T08:30:00Z',
    createdBy: 'usr_demo_agency_lead',
  },
];

const initialAudits: AuditRecord[] = [
  {
    id: 'audit-demo-tc-1',
    workspaceId: 'ws_apex_digital',
    websiteId: 'site-1',
    url: 'https://techcabal.com',
    strategy: 'mobile',
    status: 'completed',
    scores: {
      performance: 82,
      accessibility: 91,
      bestPractices: 88,
      seo: 92,
      overall: 88,
    },
    metrics: {
      fcp: { id: 'fcp', title: 'First Contentful Paint', displayValue: '1.5 s', numericValue: 1500, score: 0.86, category: 'good', description: 'First visible render milestone.' },
      lcp: { id: 'lcp', title: 'Largest Contentful Paint', displayValue: '2.4 s', numericValue: 2400, score: 0.76, category: 'good', description: 'Main hero content render time.' },
      cls: { id: 'cls', title: 'Cumulative Layout Shift', displayValue: '0.02', numericValue: 0.02, score: 0.98, category: 'good', description: 'Visual stability metric.' },
      tbt: { id: 'tbt', title: 'Total Blocking Time', displayValue: '190 ms', numericValue: 190, score: 0.82, category: 'good', description: 'Main-thread responsiveness.' },
      speedIndex: { id: 'speedIndex', title: 'Speed Index', displayValue: '2.2 s', numericValue: 2200, score: 0.81, category: 'good', description: 'Visible content velocity.' },
    },
    opportunities: [
      {
        id: 'modern-image-formats',
        title: 'Serve images in modern WebP / AVIF formats',
        description: 'Image compression saves considerable bandwidth on mobile networks.',
        displayValue: 'Potential savings of 340 KiB',
        score: 0.64,
        savingsBytes: 348160,
      },
      {
        id: 'unused-javascript',
        title: 'Defer non-critical third-party analytics scripts',
        description: 'Tag management and marketing trackers delay main-thread idle time.',
        displayValue: 'Potential savings of 160 ms',
        score: 0.74,
        savingsMs: 160,
      },
    ],
    diagnostics: [
      {
        id: 'font-display',
        title: 'Ensure text remains visible during webfont load',
        description: 'Specify font-display: swap in stylesheet.',
        displayValue: '1 web font found',
        score: 0.65,
      },
    ],
    aiSummary:
      'TechCabal maintains strong editorial SEO health (92/100) and accessibility (91/100). The primary conversion bottleneck on mobile devices is image payload weight (340 KiB redundant data) and unminified advertising script tags, which push LCP to 2.4s. Resolving these opportunities will decrease mobile bounce rates across African 3G/4G broadband connections.',
    aiActionPlan: {
      executiveSummary: 'Prioritize next-generation image encoding and script deferral to secure sub-2s mobile delivery.',
      businessUxInsights: [
        'Mobile visitors on metered cellular data experience a 1.2s delay during editorial image loading.',
        'High accessibility score (91) confirms excellent contrast and touch target sizing across article pages.',
        'Core Web Vitals meet Google recommended thresholds, supporting search ranking stability.',
      ],
      quickWins: [
        {
          id: 'qw-1',
          title: 'Implement dynamic WebP conversion on media CDN',
          priority: 'high',
          difficulty: 'easy',
          audience: 'developer',
          category: 'performance',
          finding: 'Hero article images are delivered as uncompressed JPEGs.',
          evidence: '340 KiB potential bandwidth savings identified.',
          whyItMatters: 'Directly impacts LCP on mobile and lowers cellular data usage for readers.',
          recommendedFix: 'Configure Cloudflare Polish or Next-Gen image converter with quality 82.',
          implementationSteps: [
            'Enable automated WebP/AVIF content negotiation at edge CDN.',
            'Audit image dimensions in featured hero block.',
          ],
          validationMethod: 'Verify image response header returns image/webp with smaller transfer size.',
          estimatedEffortHours: 2,
        },
      ],
      highImpact: [
        {
          id: 'hi-1',
          title: 'Defer ad header bidding & tracking tag execution',
          priority: 'critical',
          difficulty: 'moderate',
          audience: 'developer',
          category: 'performance',
          finding: 'Third party scripts fire before DOMContentLoaded.',
          evidence: '190ms Total Blocking Time on 4x CPU slowdown.',
          whyItMatters: 'Page freezes briefly when users attempt to tap menu or newsletter subscription.',
          recommendedFix: 'Load ad tags with async and initiate bidding only after First Contentful Paint.',
          implementationSteps: [
            'Wrap ad bootstrap script inside requestIdleCallback.',
            'Audit third-party tracker list in Google Tag Manager.',
          ],
          validationMethod: 'Ensure TBT drops below 120ms in mobile Lighthouse audit.',
          estimatedEffortHours: 5,
        },
      ],
      longTerm: [
        {
          id: 'lt-1',
          title: 'Deploy Automated Weekly Core Web Vitals Regression Alerts',
          priority: 'medium',
          difficulty: 'moderate',
          audience: 'business',
          category: 'seo',
          finding: 'Frequent editorial updates risk introducing unoptimized banner creatives.',
          evidence: 'Audit history shows score fluctuations between 79 and 88 over the past 30 days.',
          whyItMatters: 'Guarantees continuous compliance with Google Search page experience signals.',
          recommendedFix: 'Enable SitePilot automated weekly monitoring with in-app & email alerts on score drops.',
          implementationSteps: [
            'Turn on weekly automated audit rule in SitePilot workspace.',
            'Assign notifications to digital marketing and dev lead.',
          ],
          validationMethod: 'Audit logs confirm zero unmonitored drops below 80 score.',
          estimatedEffortHours: 1,
        },
      ],
    },
    rawProvider: 'Google PageSpeed Insights API v5',
    httpDetails: {
      statusCode: 200,
      responseTimeMs: 220,
      isHttps: true,
      serverHeader: 'Cloudflare',
      contentEncoding: 'br',
    },
    createdAt: '2026-10-17T14:28:10Z',
    completedAt: '2026-10-17T14:30:00Z',
    createdBy: 'usr_demo_agency_lead',
  },
];

const initialClients: ClientRecord[] = [
  {
    id: 'cli-1',
    workspaceId: 'ws_apex_digital',
    name: 'Tunde Adeleke',
    company: 'Lagos Logistics Ltd',
    email: 'tunde@lagoslogistics.example.ng',
    phone: '+234 802 345 6789',
    websiteUrl: 'https://lagoslogistics.example.ng',
    status: 'proposal_sent',
    estimatedValue: 4200,
    currency: 'USD',
    notes: 'Pitching full technical overhaul, speed remediation, and automated weekly SEO monitoring. Sent proposal on Oct 16.',
    lastContactDate: '2026-10-16T11:00:00Z',
    createdAt: '2026-10-05T12:00:00Z',
    createdBy: 'usr_demo_agency_lead',
  },
  {
    id: 'cli-2',
    workspaceId: 'ws_apex_digital',
    name: 'Elena Rostova',
    company: 'Nordic Craft Furniture',
    email: 'elena@nordiccraft.example.com',
    phone: '+44 20 7946 0912',
    websiteUrl: 'https://nordiccraft.example.com',
    status: 'meeting_scheduled',
    estimatedValue: 6500,
    currency: 'USD',
    notes: 'E-commerce store with high mobile bounce rate. Audit revealed CLS issues on product gallery.',
    lastContactDate: '2026-10-17T16:30:00Z',
    createdAt: '2026-10-12T09:00:00Z',
    createdBy: 'usr_demo_agency_lead',
  },
  {
    id: 'cli-3',
    workspaceId: 'ws_apex_digital',
    name: 'Chidi Okonkwo',
    company: 'FinPulse Africa',
    email: 'chidi@finpulse.example.ng',
    websiteUrl: 'https://finpulse.example.ng',
    status: 'won',
    estimatedValue: 8000,
    currency: 'USD',
    notes: 'Signed 6-month continuous site performance retainer. Monthly audits scheduled.',
    lastContactDate: '2026-10-14T10:00:00Z',
    createdAt: '2026-09-28T14:00:00Z',
    createdBy: 'usr_demo_agency_lead',
  },
];

const initialTasks: TaskRecord[] = [
  {
    id: 'tsk-1',
    workspaceId: 'ws_apex_digital',
    title: 'Compress & convert featured hero images to AVIF',
    description: 'Target TechCabal home & category banners to reduce LCP below 2.0s.',
    priority: 'high',
    status: 'in_progress',
    dueDate: '2026-10-22',
    assignedTo: 'Alex Morgan',
    websiteId: 'site-1',
    auditId: 'audit-demo-tc-1',
    createdAt: '2026-10-17T15:00:00Z',
    createdBy: 'usr_demo_agency_lead',
  },
  {
    id: 'tsk-2',
    workspaceId: 'ws_apex_digital',
    title: 'Send revised performance proposal to Lagos Logistics',
    description: 'Include Core Web Vitals breakdown and estimated 28% mobile bounce reduction.',
    priority: 'medium',
    status: 'todo',
    dueDate: '2026-10-20',
    assignedTo: 'Alex Morgan',
    websiteId: 'site-2',
    createdAt: '2026-10-18T10:00:00Z',
    createdBy: 'usr_demo_agency_lead',
  },
  {
    id: 'tsk-3',
    workspaceId: 'ws_apex_digital',
    title: 'Audit meta robots tags and canonical URLs on FinPulse blog',
    description: 'Ensure new category taxonomy does not trigger duplicate indexation.',
    priority: 'low',
    status: 'done',
    dueDate: '2026-10-16',
    assignedTo: 'Alex Morgan',
    createdAt: '2026-10-14T11:00:00Z',
    createdBy: 'usr_demo_agency_lead',
  },
];

const initialAutomations: AutomationRule[] = [
  {
    id: 'auto-1',
    workspaceId: 'ws_apex_digital',
    name: 'Critical Performance Regression Alert',
    triggerType: 'score_dropped',
    conditionThreshold: 75,
    actionType: 'notify_inapp',
    isEnabled: true,
    lastRunAt: '2026-10-17T14:30:00Z',
    runCount: 3,
    createdAt: '2026-10-01T10:00:00Z',
    createdBy: 'usr_demo_agency_lead',
  },
  {
    id: 'auto-2',
    workspaceId: 'ws_apex_digital',
    name: 'Auto-Generate Remediation Task on Failed Audits',
    triggerType: 'critical_issue_found',
    conditionThreshold: 50,
    actionType: 'create_task',
    isEnabled: true,
    lastRunAt: '2026-10-15T18:00:00Z',
    runCount: 5,
    createdAt: '2026-10-05T12:00:00Z',
    createdBy: 'usr_demo_agency_lead',
  },
];

const initialNotifications: NotificationRecord[] = [
  {
    id: 'notif-1',
    workspaceId: 'ws_apex_digital',
    userId: 'usr_demo_agency_lead',
    title: 'Audit Completed: TechCabal News',
    message: 'Mobile audit completed with Overall Health Score 88/100 (Performance 82, SEO 92).',
    type: 'success',
    read: false,
    link: '/audit-runner',
    createdAt: '2026-10-17T14:30:00Z',
  },
  {
    id: 'notif-2',
    workspaceId: 'ws_apex_digital',
    userId: 'usr_demo_agency_lead',
    title: 'Monitoring Alert: Lagos Logistics',
    message: 'Performance score dropped to 71 on mobile due to server TTFB spike.',
    type: 'warning',
    read: false,
    link: '/monitoring',
    createdAt: '2026-10-18T09:15:00Z',
  },
];

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile } = useAuth();
  const [workspace, setWorkspace] = useState<Workspace>(defaultWorkspace);
  const [websites, setWebsites] = useState<WebsiteProject[]>(initialWebsites);
  const [audits, setAudits] = useState<AuditRecord[]>(initialAudits);
  const [currentAudit, setCurrentAudit] = useState<AuditRecord | null>(initialAudits[0]);
  const [clients, setClients] = useState<ClientRecord[]>(initialClients);
  const [tasks, setTasks] = useState<TaskRecord[]>(initialTasks);
  const [automations, setAutomations] = useState<AutomationRule[]>(initialAutomations);
  const [notifications, setNotifications] = useState<NotificationRecord[]>(initialNotifications);
  const [currency, setCurrencyState] = useState<CurrencyCode>('USD');
  const [userRole] = useState<UserRole>('owner');
  const [isAuditRunning, setIsAuditRunning] = useState<boolean>(false);
  const [auditProgressMessage, setAuditProgressMessage] = useState<string>('');

  // Persist currency selection
  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
    setWorkspace((prev) => ({ ...prev, currency: c }));
  };

  // Sync with Firestore if authenticated
  useEffect(() => {
    if (!user) return;

    const wsId = profile?.activeWorkspaceId || 'ws_default_' + user.uid.substring(0, 8);
    const wsRef = doc(db, 'workspaces', wsId);
    const memberRef = doc(db, 'workspaces', wsId, 'members', user.uid);

    const initWorkspace = async () => {
      try {
        let currentWs: Workspace;
        const snap = await getDoc(wsRef);
        if (snap.exists()) {
          currentWs = snap.data() as Workspace;
          setWorkspace(currentWs);
        } else {
          currentWs = {
            id: wsId,
            name: `${profile?.displayName || 'Personal'}'s Workspace`,
            ownerId: user.uid,
            plan: 'free',
            currency: 'USD',
            monthlyAuditsUsed: 0,
            monthlyAuditsLimit: 25,
            createdAt: new Date().toISOString(),
          };
          await setDoc(wsRef, currentWs);
          setWorkspace(currentWs);
        }

        // Ensure owner member document exists
        try {
          const mSnap = await getDoc(memberRef);
          if (!mSnap.exists()) {
            await setDoc(memberRef, {
              id: user.uid,
              workspaceId: wsId,
              userId: user.uid,
              role: 'owner',
              invitedEmail: user.email || '',
              invitedAt: new Date().toISOString(),
            });
          }
        } catch (mErr) {
          console.warn('Workspace member initialization notice:', mErr);
        }

        // Fetch persisted websites from Firestore
        try {
          const sitesRef = collection(db, 'workspaces', wsId, 'websites');
          const sitesSnap = await getDocs(sitesRef);
          if (!sitesSnap.empty) {
            const persistedSites = sitesSnap.docs.map((d) => d.data() as WebsiteProject);
            setWebsites((prev) => {
              const ids = new Set(persistedSites.map((s) => s.id));
              return [...persistedSites, ...prev.filter((p) => !ids.has(p.id))];
            });
          }
        } catch (sErr) {
          console.warn('Websites fetch notice:', sErr);
        }
      } catch (e: any) {
        console.warn('Firestore workspace fetch notice:', e);
      }
    };

    initWorkspace();
  }, [user, profile]);

  const addWebsite = async (siteData: Omit<WebsiteProject, 'id' | 'workspaceId' | 'createdAt' | 'createdBy'>): Promise<WebsiteProject> => {
    const newSite: WebsiteProject = {
      ...siteData,
      id: 'site_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      workspaceId: workspace.id,
      createdAt: new Date().toISOString(),
      createdBy: user?.uid || 'usr_demo_agency_lead',
    };

    setWebsites((prev) => [newSite, ...prev]);

    if (user) {
      try {
        // Ensure parent workspace document exists first
        const wsRef = doc(db, 'workspaces', workspace.id);
        const wsSnap = await getDoc(wsRef);
        if (!wsSnap.exists()) {
          await setDoc(wsRef, workspace);
        }
        await setDoc(doc(db, 'workspaces', workspace.id, 'websites', newSite.id), newSite);
      } catch (err: any) {
        console.error('Failed to write website to Firestore:', err);
        handleFirestoreError(err, OperationType.WRITE, `workspaces/${workspace.id}/websites/${newSite.id}`);
      }
    }

    return newSite;
  };

  const deleteWebsite = async (id: string): Promise<void> => {
    setWebsites((prev) => prev.filter((s) => s.id !== id));
    if (user) {
      try {
        await deleteDoc(doc(db, 'workspaces', workspace.id, 'websites', id));
      } catch (err) {
        console.warn('Website deletion from Firestore notice:', err);
      }
    }
  };

  const runNewAudit = async (url: string, strategy: 'mobile' | 'desktop'): Promise<AuditRecord> => {
    setIsAuditRunning(true);
    setAuditProgressMessage('Verifying URL reachability and HTTP security headers...');

    try {
      const stepTimer1 = setTimeout(() => {
        setAuditProgressMessage('Invoking PageSpeed Insights & measuring Core Web Vitals (FCP, LCP, CLS, TBT)...');
      }, 1500);

      const stepTimer2 = setTimeout(() => {
        setAuditProgressMessage('Consulting Gemini AI: Computing prioritized action plan & executive briefing...');
      }, 4500);

      const response = await fetch('/api/v1/audit/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, strategy }),
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || 'Failed to complete website audit.');
      }

      const auditData: AuditRecord = await response.json();
      auditData.workspaceId = workspace.id;
      auditData.websiteId = websites.find((w) => w.url === url)?.id || 'adhoc';
      auditData.createdBy = user?.uid || 'usr_demo_agency_lead';

      // Update state
      setAudits((prev) => [auditData, ...prev]);
      setCurrentAudit(auditData);
      setWorkspace((prev) => ({
        ...prev,
        monthlyAuditsUsed: prev.monthlyAuditsUsed + 1,
      }));

      // Update associated website if registered
      setWebsites((prev) =>
        prev.map((site) => {
          if (site.url === url || site.url.replace(/\/$/, '') === url.replace(/\/$/, '')) {
            return {
              ...site,
              lastAuditScore: auditData.scores?.overall || 80,
              lastAuditAt: auditData.completedAt || new Date().toISOString(),
            };
          }
          return site;
        })
      );

      // Persist audit record to Firestore
      if (user) {
        setDoc(doc(db, 'workspaces', workspace.id, 'audits', auditData.id), auditData).catch((e) =>
          console.warn('Persisting audit to Firestore notice:', e)
        );
      }

      // Add in-app notification
      const newNotif: NotificationRecord = {
        id: 'notif_' + Date.now(),
        workspaceId: workspace.id,
        userId: user?.uid || 'usr_demo_agency_lead',
        title: `Audit Completed: ${new URL(auditData.url).hostname}`,
        message: `Overall health score: ${auditData.scores?.overall || 0}/100 with ${auditData.opportunities?.length || 0} optimization opportunities.`,
        type: (auditData.scores?.overall || 0) >= 80 ? 'success' : 'warning',
        read: false,
        link: '/audit-runner',
        createdAt: new Date().toISOString(),
      };
      setNotifications((prev) => [newNotif, ...prev]);

      return auditData;
    } finally {
      setIsAuditRunning(false);
      setAuditProgressMessage('');
    }
  };

  const addClient = async (clientData: Omit<ClientRecord, 'id' | 'workspaceId' | 'createdAt' | 'createdBy'>): Promise<ClientRecord> => {
    const newClient: ClientRecord = {
      ...clientData,
      id: 'cli_' + Date.now(),
      workspaceId: workspace.id,
      currency,
      createdAt: new Date().toISOString(),
      createdBy: user?.uid || 'usr_demo_agency_lead',
    };
    setClients((prev) => [newClient, ...prev]);
    if (user) {
      try {
        await setDoc(doc(db, 'workspaces', workspace.id, 'clients', newClient.id), newClient);
      } catch (err) {
        console.warn('Firestore addClient notice:', err);
      }
    }
    return newClient;
  };

  const updateClientStatus = async (id: string, status: ClientRecord['status']): Promise<void> => {
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  };

  const addTask = async (taskData: Omit<TaskRecord, 'id' | 'workspaceId' | 'createdAt' | 'createdBy'>): Promise<TaskRecord> => {
    const newTask: TaskRecord = {
      ...taskData,
      id: 'tsk_' + Date.now(),
      workspaceId: workspace.id,
      createdAt: new Date().toISOString(),
      createdBy: user?.uid || 'usr_demo_agency_lead',
    };
    setTasks((prev) => [newTask, ...prev]);
    if (user) {
      try {
        await setDoc(doc(db, 'workspaces', workspace.id, 'tasks', newTask.id), newTask);
      } catch (err) {
        console.warn('Firestore addTask notice:', err);
      }
    }
    return newTask;
  };

  const updateTaskStatus = async (id: string, status: TaskRecord['status']): Promise<void> => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  const addAutomation = async (
    ruleData: Omit<AutomationRule, 'id' | 'workspaceId' | 'createdAt' | 'createdBy' | 'runCount'>
  ): Promise<AutomationRule> => {
    const newRule: AutomationRule = {
      ...ruleData,
      id: 'auto_' + Date.now(),
      workspaceId: workspace.id,
      runCount: 0,
      createdAt: new Date().toISOString(),
      createdBy: user?.uid || 'usr_demo_agency_lead',
    };
    setAutomations((prev) => [newRule, ...prev]);
    if (user) {
      try {
        await setDoc(doc(db, 'workspaces', workspace.id, 'automations', newRule.id), newRule);
      } catch (err) {
        console.warn('Firestore addAutomation notice:', err);
      }
    }
    return newRule;
  };

  const toggleAutomation = async (id: string): Promise<void> => {
    setAutomations((prev) => prev.map((a) => (a.id === id ? { ...a, isEnabled: !a.isEnabled } : a)));
  };

  const markNotificationRead = async (id: string): Promise<void> => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
    <WorkspaceContext.Provider
      value={{
        workspace,
        setWorkspace,
        websites,
        addWebsite,
        deleteWebsite,
        audits,
        currentAudit,
        setCurrentAudit,
        runNewAudit,
        clients,
        addClient,
        updateClientStatus,
        tasks,
        addTask,
        updateTaskStatus,
        automations,
        addAutomation,
        toggleAutomation,
        notifications,
        markNotificationRead,
        currency,
        setCurrency,
        userRole,
        isAuditRunning,
        auditProgressMessage,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
