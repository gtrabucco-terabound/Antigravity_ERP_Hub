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
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Modules Launcher", icon: Layers, href: "/modules" },
  { name: "Notifications", icon: Bell, href: "/notifications" },
  { name: "Documents", icon: FileText, href: "/documents" },
  { name: "Audit Logs", icon: Activity, href: "/activity" },
];

const SECONDARY_NAV = [
  { name: "Settings", icon: Settings, href: "/profile" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-sidebar flex flex-col h-screen border-r border-sidebar-border overflow-hidden">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-accent h-8 w-8 rounded flex items-center justify-center">
          <ShieldCheck className="text-slate-900 h-5 w-5" />
        </div>
        <span className="font-bold text-lg text-white tracking-tight">TerraLink<span className="text-accent font-normal">Hub</span></span>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors group",
                isActive 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-slate-400 group-hover:text-white")} />
                <span className="text-sm font-medium">{item.name}</span>
              </div>
              {isActive && <ChevronRight className="h-4 w-4 opacity-50" />}
            </Link>
          );
        })}
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
          <span className="text-sm font-medium">Log out</span>
        </Link>
      </div>

      <div className="p-4 mx-4 mb-4 bg-white/5 rounded-xl border border-white/10">
        <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Support</p>
        <p className="text-xs text-slate-300">Need help with Hub?</p>
        <button className="text-xs text-accent mt-2 hover:underline">Contact System Admin</button>
      </div>
    </div>
  );
}