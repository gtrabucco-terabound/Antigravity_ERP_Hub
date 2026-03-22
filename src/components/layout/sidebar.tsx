"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Layers, 
  Bell, 
  FileText, 
  Activity, 
  Settings, 
  LogOut,
  ShieldCheck,
  ChevronRight,
  Briefcase,
  Users,
  Package,
  ClipboardList,
  PieChart
} from "lucide-react";
import { useTenant } from "@/context/tenant-context";
import { useMembership } from "@/firebase/auth/use-membership";
import { cn } from "@/lib/utils";

const CORE_NAV = [
  { name: "Tablero", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Lanzador", icon: Layers, href: "/modules" },
];

const MODULE_NAV = [
  { id: "mod_crm", name: "CRM", icon: Briefcase, href: "/modules/crm", allowedRoles: ["ADMIN_OWNER"] },
  { id: "mod_inv", name: "Inventario", icon: Package, href: "/modules/stock", allowedRoles: ["ADMIN_OWNER", "SUPERVISOR"] },
  { id: "mod_fin", name: "Finanzas", icon: PieChart, href: "/modules/finances", allowedRoles: ["ADMIN_OWNER", "SUPERVISOR"] },
  { id: "9dRWiNsBBLbd1uL3KQk3", name: "T-Modulo 1", icon: ClipboardList, href: "/modules/m1", allowedRoles: ["ADMIN_OWNER", "SUPERVISOR", "OPERATIVE"] },
];

const UTILITY_NAV = [
  { name: "Documentos", icon: FileText, href: "/documents" },
  { name: "Actividad", icon: Activity, href: "/activity" },
  { name: "Notificaciones", icon: Bell, href: "/notifications" },
];

const SECONDARY_NAV = [
  { name: "Configuración", icon: Settings, href: "/profile" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { selectedTenant } = useTenant();
  const { membership } = useMembership();
  
  const activeModules = selectedTenant?.activeModules || [];
  const userRole = membership?.role || "OPERATIVE";

  const renderLink = (item: any) => {
    const isActive = pathname === item.href;
    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          "flex items-center justify-between px-3 py-2 rounded-lg transition-colors group mb-1",
          isActive 
            ? "bg-primary text-white shadow-lg shadow-primary/20" 
            : "text-slate-400 hover:bg-white/5 hover:text-white"
        )}
      >
        <div className="flex items-center gap-3">
          <item.icon className={cn("h-4 w-4", isActive ? "text-white" : "text-slate-400 group-hover:text-white")} />
          <span className="text-sm font-medium">{item.name}</span>
        </div>
        {isActive && <ChevronRight className="h-4 w-4 opacity-50" />}
      </Link>
    );
  };

  return (
    <div className="w-64 bg-sidebar flex flex-col h-screen border-r border-sidebar-border overflow-hidden">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-accent h-8 w-8 rounded flex items-center justify-center">
          <ShieldCheck className="text-slate-900 h-5 w-5" />
        </div>
        <span className="font-bold text-lg text-white tracking-tight">TerraLink<span className="text-accent font-normal">Hub</span></span>
      </div>

      <nav className="flex-1 px-4 mt-2 overflow-y-auto custom-scrollbar">
        <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-2 px-3 mt-4">Navegación</p>
        {CORE_NAV.map(renderLink)}

        <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-2 px-3 mt-6">Módulos Activos</p>
        {(() => {
          const filteredModules = MODULE_NAV.filter(m => 
            activeModules.includes(m.id) && m.allowedRoles.includes(userRole)
          );

          if (filteredModules.length > 0) {
            return filteredModules.map(renderLink);
          }

          return <p className="text-[10px] text-slate-600 px-3 italic">Sin módulos permitidos</p>;
        })()}

        <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-2 px-3 mt-6">Herramientas</p>
        {UTILITY_NAV.map(renderLink)}
      </nav>

      <div className="px-4 py-6 space-y-1 border-t border-sidebar-border">
        {SECONDARY_NAV.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group",
                isActive 
                  ? "bg-primary text-white" 
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-slate-400 group-hover:text-white")} />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          );
        })}
        <Link
          href="/login"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-sm font-medium">Cerrar sesión</span>
        </Link>
      </div>

      <div className="p-4 mx-4 mb-4 bg-white/5 rounded-xl border border-white/10">
        <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Soporte</p>
        <p className="text-xs text-slate-300">¿Necesitas ayuda con el Hub?</p>
        <button className="text-xs text-accent mt-2 hover:underline">Contactar Admin del Sistema</button>
      </div>
    </div>
  );
}
