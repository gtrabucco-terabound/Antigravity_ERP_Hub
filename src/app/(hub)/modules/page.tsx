"use client"

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Layers, Search, Filter, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTenant } from "@/context/tenant-context";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { useUser } from "@/firebase/auth/use-user";
import { useMembership } from "@/firebase/auth/use-membership";
import { collection, query, where, documentId } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function ModulesPage() {
  const db = useFirestore();
  const { selectedTenant } = useTenant();
  const router = useRouter();
  
  const activeModuleIds = selectedTenant?.activeModules || [];

  const modulesQuery = useMemoFirebase(() => {
    if (!db || !activeModuleIds.length) return null;
    return query(collection(db, "_gl_modules"), where(documentId(), 'in', activeModuleIds));
  }, [db, activeModuleIds]);

  const { data: activeModules, loading: loadingModules } = useCollection(modulesQuery);

  const { membership } = useMembership();
  const { user } = useUser();
  const userRole = membership?.role || "OPERATIVE";
  const hasFullAccess = ["ADMIN", "MANAGER", "IT", "AUDITOR"].includes(userRole);

  const MODULE_PERMISSIONS: Record<string, string[]> = {
    "mod_crm": ["SUPERVISOR", "OPERATIVE", "ADMINISTRATIVE", "AREA_MANAGER"],
    "mod_inv": ["SUPERVISOR", "OPERATIVE", "AREA_MANAGER"],
    "mod_fin": ["FINANCE", "ADMINISTRATIVE", "AREA_MANAGER", "SUPERVISOR"],
  };

  const filteredModules = activeModules?.filter(m => {
    if (hasFullAccess) return true;
    if (membership?.modules?.includes(m.id)) return true;
    if (m.code && MODULE_PERMISSIONS[m.code]?.includes(userRole)) return true;
    return false;
  }) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lanzador de Módulos</h1>
          <p className="text-muted-foreground mt-1">Acceda y gestione los módulos habilitados para su cliente.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9 w-[200px] md:w-[300px]" placeholder="Buscar módulos..." />
          </div>
          <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
        </div>
      </div>

      {loadingModules ? (
        <div className="flex flex-col items-center justify-center h-64 border border-dashed rounded-xl bg-slate-50">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-slate-500 text-sm">Cargando catálogo de módulos...</p>
        </div>
      ) : filteredModules && filteredModules.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredModules.map((module: any) => (
            <Card key={module.id} className="flex flex-col border-none shadow-sm hover:shadow-md transition-shadow group">
              <CardHeader className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                    <Layers className="h-6 w-6" />
                  </div>
                  <Badge variant={module.status === 'active' ? 'default' : 'secondary'}>
                    {module.status === 'active' ? 'Activo' : 'Mantenimiento'}
                  </Badge>
                </div>
                <CardTitle className="group-hover:text-primary transition-colors">{module.name}</CardTitle>
                <CardDescription className="mt-2 text-slate-500 leading-relaxed">
                  {module.description}
                </CardDescription>
              </CardHeader>
              <CardFooter className="pt-0">
                <Button 
                  onClick={() => window.open(module.remoteUrl || '#', '_blank')}
                  className="w-full bg-slate-900 hover:bg-slate-800" 
                  disabled={module.status !== 'active' || !module.remoteUrl}
                >
                  {module.status === 'active' ? (
                    <>Abrir Aplicación <ExternalLink className="ml-2 h-4 w-4" /></>
                  ) : (
                    "Temporalmente Fuera de Línea"
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-xl bg-slate-50 p-8 text-center">
          <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Layers className="h-8 w-8 text-slate-300" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900">No hay módulos habilitados</h2>
          <p className="text-slate-500 mt-2 max-w-md">Su cliente actualmente no tiene módulos habilitados. Por favor, contacte a su administrador o al proveedor de la plataforma para habilitar funciones para su cuenta.</p>
          <Button className="mt-6">Explorar Catálogo</Button>
        </div>
      )}
    </div>
  );
}
