import { HubModule, HubNotification, HubDocument, HubAuditLog } from "@/types/hub";

export const MOCK_MODULES: HubModule[] = [
  {
    id: "m1",
    name: "Human Resources",
    slug: "rrhh",
    status: "active",
    icon: "Users",
    description: "Manage employees, payroll, and recruitment cycles.",
    route: "/modules/rrhh",
  },
  {
    id: "m2",
    name: "Work Orders",
    slug: "ot",
    status: "active",
    icon: "ClipboardList",
    description: "Tracking and management of technical service requests.",
    route: "/modules/ot",
  },
  {
    id: "m3",
    name: "Inventory",
    slug: "stock",
    status: "active",
    icon: "Package",
    description: "Real-time stock control and warehouse movements.",
    route: "/modules/stock",
  },
  {
    id: "m4",
    name: "CRM",
    slug: "crm",
    status: "maintenance",
    icon: "Briefcase",
    description: "Customer relationship management and sales funnel.",
    route: "/modules/crm",
  }
];

export const MOCK_NOTIFICATIONS: HubNotification[] = [
  {
    id: "n1",
    title: "License Expiration",
    body: "The 'Inventory' module license expires in 5 days.",
    timestamp: new Date().toISOString(),
    severity: "high",
    read: false,
    moduleId: "stock"
  },
  {
    id: "n2",
    title: "New Audit Entry",
    body: "System configuration changed by admin.",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    severity: "low",
    read: true
  },
  {
    id: "n3",
    title: "Backup Complete",
    body: "Full database backup was successful.",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    severity: "medium",
    read: false
  }
];

export const MOCK_DOCUMENTS: HubDocument[] = [
  {
    id: "doc1",
    name: "Quarterly_Tax_Report.pdf",
    type: "PDF",
    status: "Final",
    updatedAt: "2024-03-15",
    size: "2.4 MB",
    category: "report"
  },
  {
    id: "doc2",
    name: "Service_Contract_V2.docx",
    type: "DOCX",
    status: "Draft",
    updatedAt: "2024-03-20",
    size: "1.1 MB",
    category: "contract"
  }
];

export const MOCK_AUDIT_LOGS: HubAuditLog[] = [
  "User john.doe@tenant1.com logged in from IP 192.168.1.1",
  "Updated security settings for role 'Manager'",
  "Exported 500 rows from Inventory module",
  "Deleted temporary file cache in local site A",
  "Attempted unauthorized access to sensitive financial report",
  "Permission Update: User Sarah granted 'Auditor' role"
].map((log, i) => ({
  id: `audit-${i}`,
  action: log,
  user: "system_user",
  entity: "Global",
  timestamp: new Date(Date.now() - (i * 1000000)).toISOString(),
  details: "Extended log detail content here."
}));
