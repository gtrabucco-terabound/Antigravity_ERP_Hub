import { HubModule, HubNotification, HubDocument, HubAuditLog } from "@/types/hub";

export const MOCK_MODULES: HubModule[] = [
  {
    id: "m1",
    name: "Recursos Humanos",
    slug: "rrhh",
    status: "active",
    icon: "Users",
    description: "Gestione empleados, nóminas y ciclos de contratación.",
    route: "/modules/rrhh",
  },
  {
    id: "m2",
    name: "Órdenes de Trabajo",
    slug: "ot",
    status: "active",
    icon: "ClipboardList",
    description: "Seguimiento y gestión de solicitudes de servicio técnico.",
    route: "/modules/ot",
  },
  {
    id: "m3",
    name: "Inventario",
    slug: "stock",
    status: "active",
    icon: "Package",
    description: "Control de stock en tiempo real y movimientos de almacén.",
    route: "/modules/stock",
  },
  {
    id: "m4",
    name: "CRM",
    slug: "crm",
    status: "maintenance",
    icon: "Briefcase",
    description: "Gestión de relaciones con clientes y embudo de ventas.",
    route: "/modules/crm",
  }
];

export const MOCK_NOTIFICATIONS: HubNotification[] = [
  {
    id: "n1",
    title: "Expiración de Licencia",
    body: "La licencia del módulo 'Inventario' expira en 5 días.",
    timestamp: new Date().toISOString(),
    severity: "high",
    read: false,
    moduleId: "stock"
  },
  {
    id: "n2",
    title: "Nueva Entrada de Auditoría",
    body: "La configuración del sistema fue cambiada por un administrador.",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    severity: "low",
    read: true
  },
  {
    id: "n3",
    title: "Copia de Seguridad Completada",
    body: "La copia de seguridad completa de la base de datos fue exitosa.",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    severity: "medium",
    read: false
  }
];

export const MOCK_DOCUMENTS: HubDocument[] = [
  {
    id: "doc1",
    name: "Reporte_Impuestos_Trimestral.pdf",
    type: "PDF",
    status: "Final",
    updatedAt: "2024-03-15",
    size: "2.4 MB",
    category: "report"
  },
  {
    id: "doc2",
    name: "Contrato_Servicio_V2.docx",
    type: "DOCX",
    status: "Borrador",
    updatedAt: "2024-03-20",
    size: "1.1 MB",
    category: "contract"
  }
];

export const MOCK_AUDIT_LOGS: HubAuditLog[] = [
  "El usuario john.doe@tenant1.com inició sesión desde la IP 192.168.1.1",
  "Ajustes de seguridad actualizados para el rol 'Gerente'",
  "Se exportaron 500 filas del módulo de Inventario",
  "Caché de archivos temporales eliminada en el sitio local A",
  "Intento de acceso no autorizado a reporte financiero sensible",
  "Actualización de permisos: A la usuaria Sarah se le asignó el rol 'Auditor'"
].map((log, i) => ({
  id: `audit-${i}`,
  action: log,
  user: "usuario_sistema",
  entity: "Global",
  timestamp: new Date(Date.now() - (i * 1000000)).toISOString(),
  details: "Contenido detallado del registro de auditoría aquí."
}));
