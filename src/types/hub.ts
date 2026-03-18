export type HubRole = 'TenantAdmin' | 'StandardUser' | 'Auditor' | 'PowerUser';

export interface HubUserContext {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  tenantId: string;
  role: HubRole;
  enabledModules: string[]; // Slugs from Custom Claims
}

export interface HubModule {
  id: string;
  name: string;
  slug: string;
  status: 'active' | 'maintenance' | 'beta';
  icon: string;
  description: string;
  route: string;
  remoteUrl?: string;
}

export interface HubNotification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  read: boolean;
  moduleId?: string;
}

export interface HubDocument {
  id: string;
  name: string;
  type: string;
  status: string;
  updatedAt: string;
  size: string;
  category: 'invoice' | 'contract' | 'report' | 'other';
}

export interface HubAuditLog {
  id: string;
  action: string;
  user: string;
  entity: string;
  timestamp: string;
  details: string;
}

export interface HubUserSettings {
  language: 'en' | 'es' | 'pt';
  theme: 'light' | 'dark' | 'system';
  dashboardLayout: 'compact' | 'expanded';
  notificationsEnabled: boolean;
}