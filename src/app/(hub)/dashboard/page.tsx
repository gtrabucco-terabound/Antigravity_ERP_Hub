"use client"

import { MOCK_NOTIFICATIONS } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Layers, Bell, ArrowRight, UserCheck, Server, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTenant } from "@/context/tenant-context";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { useUser } from "@/firebase/auth/use-user";
import { useMembership } from "@/firebase/auth/use-membership";
import { collection, query, where, documentId } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const db = useFirestore();
  const { selectedTenant } = useTenant();
  const router = useRouter();
  
  // IDs de módulos habilitados para el tenant seleccionado
  const activeModuleIds = selectedTenant?.activeModules || [];

  // Consulta real a _gl_modules basada en los IDs habilitados
  const modulesQuery = useMemoFirebase(() => {
    if (!db || !activeModuleIds.length) return null;
    return query(collection(db, "_gl_modules"), where(documentId(), 'in', activeModuleIds));
  }, [db, activeModuleIds]);

  const { membership } = useMembership();
  const { user } = useUser();
  const userRole = membership?.role || "OPERATIVE";

  // Mapeo de permisos (ID -> Roles permitidos)
  // Nota: En una fase avanzada esto vendría de Firestore, pero  // Mapeo de permisos (ID -> Roles permitidos)
  // Nota: Los roles ejecutivos ("ADMIN", "MANAGER", "IT", "AUDITOR") tienen acceso a todo por defecto en UI
  const MODULE_PERMISSIONS: Record<string, string[]> = {
    "mod_crm": ["SUPERVISOR", "OPERATIVE", "ADMINISTRATIVE", "AREA_MANAGER"],
    "mod_inv": ["SUPERVISOR", "OPERATIVE", "AREA_MANAGER"],
    "mod_fin": ["FINANCE", "ADMINISTRATIVE", "AREA_MANAGER", "SUPERVISOR"],
  };

  const hasFullAccess = ["ADMIN", "MANAGER", "IT", "AUDITOR"].includes(userRole);

  const { data: activeModules, loading: loadingModules } = useCollection(modulesQuery);
  
  // Filtrado estricto por Rol y Asignación Explícita
  const filteredModules = activeModules?.filter(m => {
    // 1. Roles ejecutivos tienen acceso a todo el ecosistema de su empresa
    if (hasFullAccess) return true;
    
    // 2. Si el módulo fue asignado explícitamente a este usuario por su ID
    if (membership?.modules?.includes(m.id)) return true;
    
    // 3. Fallback a permisos de rol base asociados por código (Opcional, pero mantenido por si aplica)
    if (m.code && MODULE_PERMISSIONS[m.code]?.includes(userRole)) return true;

    // Si no cumple ninguna, se deniega la visibilidad
    return false;
  }) || [];

  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.read).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Bienvenido de nuevo, {user?.displayName?.split(' ')[0] || 'Hola'}
        </h1>
        <p className="text-slate-500 font-medium">Esto es lo que está pasando hoy en {selectedTenant?.name || 'su organización'}.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500">Estado del Cliente</CardTitle>
            <Server className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Operacional</div>
            <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Todos los sistemas normales
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500">Módulos Habilitados</CardTitle>
            <Layers className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredModules.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Habilitados para tu perfil</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500">Alertas Pendientes</CardTitle>
            <Bell className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadCount}</div>
            <p className="text-xs text-orange-600 mt-1 font-medium">Bandeja personal</p>
          </CardContent>
        </Card>
        {hasFullAccess && (
          <Card className="bg-white border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-slate-500">Usuarios Totales</CardTitle>
              <UserCheck className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs text-muted-foreground mt-1">5 actualmente en línea</p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Módulos Habilitados (Base de Datos)</CardTitle>
              <CardDescription>Módulos cargados dinámicamente desde _gl_modules para {selectedTenant?.name}.</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/modules">Ver Lanzador</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {loadingModules ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-slate-500">Cargando módulos...</span>
              </div>
            ) : filteredModules.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredModules.map((module: any) => (
                  <div 
                    key={module.id} 
                    onClick={() => window.open(module.remoteUrl || '#', '_blank')}
                    className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:border-primary/20 hover:bg-white transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-slate-100 group-hover:border-primary/50">
                        <Layers className="h-5 w-5 text-primary" />
                      </div>
                      <Badge variant={module.status === 'active' ? 'secondary' : 'outline'} className="text-[10px]">
                        {module.status === 'active' ? 'Activo' : 'Mantenimiento'}
                      </Badge>
                    </div>
                    <div className="mt-4">
                      <h3 className="font-semibold text-slate-900">{module.name}</h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">{module.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed">
                <p className="text-sm text-slate-500">No hay módulos habilitados en la base de datos para este cliente.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Notificaciones Recientes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {MOCK_NOTIFICATIONS.slice(0, 3).map((n) => (
              <div key={n.id} className="flex gap-3 pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                <div className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                  n.severity === 'high' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                )}>
                  <Bell className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{n.title}</p>
                  <p className="text-xs text-slate-500 line-clamp-1">{n.body}</p>
                </div>
              </div>
            ))}
            <Button variant="link" className="w-full text-primary" asChild>
              <Link href="/notifications">Ver todas las notificaciones <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
