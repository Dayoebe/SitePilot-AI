export type DeviceStrategy = 'mobile' | 'desktop';

export type AuditStatus = 'pending' | 'running' | 'completed' | 'failed';

export type UserRole = 'owner' | 'admin' | 'analyst' | 'member' | 'viewer';

export type SubscriptionPlan = 'free' | 'pro' | 'agency' | 'enterprise';

export type CurrencyCode = 'USD' | 'NGN' | 'EUR' | 'GBP';

export type ClientStatus =
  | 'prospect'
  | 'researching'
  | 'contacted'
  | 'replied'
  | 'meeting_scheduled'
  | 'proposal_sent'
  | 'won'
  | 'lost';

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  activeWorkspaceId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
  plan: SubscriptionPlan;
  currency: CurrencyCode;
  monthlyAuditsUsed: number;
  monthlyAuditsLimit: number;
  createdAt: string;
  updatedAt?: string;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  email: string;
  role: UserRole;
  joinedAt: string;
}

export interface WebsiteProject {
  id: string;
  workspaceId: string;
  url: string;
  name: string;
  category: string;
  monitoringFrequency: 'manual' | 'daily' | 'weekly' | 'monthly';
  monitoringEnabled: boolean;
  lastAuditScore?: number;
  lastAuditAt?: string;
  clientId?: string;
  createdAt: string;
  createdBy: string;
}

export interface LighthouseScores {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  overall: number;
}

export interface MetricItem {
  id: string;
  title: string;
  displayValue: string;
  numericValue: number;
  score: number;
  category: 'good' | 'needs-improvement' | 'poor';
  description?: string;
}

export interface AuditOpportunity {
  id: string;
  title: string;
  description: string;
  displayValue?: string;
  score: number;
  savingsMs?: number;
  savingsBytes?: number;
}

export interface AuditDiagnostic {
  id: string;
  title: string;
  description: string;
  displayValue?: string;
  score: number;
}

export interface AIActionItem {
  id: string;
  title: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  difficulty: 'easy' | 'moderate' | 'hard';
  audience: 'developer' | 'business';
  category: 'performance' | 'accessibility' | 'seo' | 'security' | 'ux';
  finding: string;
  evidence: string;
  whyItMatters: string;
  recommendedFix: string;
  implementationSteps: string[];
  validationMethod: string;
  estimatedEffortHours?: number;
}

export interface AIActionPlan {
  quickWins: AIActionItem[];
  highImpact: AIActionItem[];
  longTerm: AIActionItem[];
  executiveSummary: string;
  businessUxInsights?: string[];
}

export interface AuditRecord {
  id: string;
  workspaceId: string;
  websiteId: string;
  url: string;
  strategy: DeviceStrategy;
  status: AuditStatus;
  scores?: LighthouseScores;
  metrics?: {
    fcp?: MetricItem;
    lcp?: MetricItem;
    cls?: MetricItem;
    tbt?: MetricItem;
    speedIndex?: MetricItem;
    tti?: MetricItem;
  };
  opportunities?: AuditOpportunity[];
  diagnostics?: AuditDiagnostic[];
  aiSummary?: string;
  aiActionPlan?: AIActionPlan;
  rawProvider?: string;
  httpDetails?: {
    statusCode: number;
    responseTimeMs: number;
    isHttps: boolean;
    serverHeader?: string;
    contentEncoding?: string;
  };
  errorMessage?: string;
  createdAt: string;
  completedAt?: string;
  createdBy: string;
}

export interface ClientRecord {
  id: string;
  workspaceId: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  websiteUrl?: string;
  status: ClientStatus;
  estimatedValue?: number;
  currency: CurrencyCode;
  notes?: string;
  lastContactDate?: string;
  createdAt: string;
  createdBy: string;
}

export interface TaskRecord {
  id: string;
  workspaceId: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string;
  assignedTo?: string;
  websiteId?: string;
  auditId?: string;
  createdAt: string;
  createdBy: string;
}

export interface AutomationRule {
  id: string;
  workspaceId: string;
  name: string;
  triggerType: 'audit_completed' | 'score_dropped' | 'critical_issue_found' | 'task_overdue';
  conditionThreshold?: number;
  actionType: 'create_task' | 'notify_inapp' | 'generate_action_plan';
  isEnabled: boolean;
  lastRunAt?: string;
  runCount: number;
  createdAt: string;
  createdBy: string;
}

export interface NotificationRecord {
  id: string;
  workspaceId: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface SharedReportRecord {
  id: string;
  workspaceId: string;
  auditId: string;
  url: string;
  expiresAt: string;
  isRevoked: boolean;
  viewsCount: number;
  createdAt: string;
}
