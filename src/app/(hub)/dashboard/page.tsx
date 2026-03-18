"use client"

import { MOCK_MODULES, MOCK_NOTIFICATIONS } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Layers, Bell, ArrowRight, UserCheck, Server } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const activeModules = MOCK_MODULES.filter(m => m.status === 'active');
  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.read).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Bienvenido de nuevo, Alex</h1>
        <p className="text-slate-500 font-medium">Esto es lo que está pasando hoy en TerraCorp Solutions.</p>
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
            <div className="text-2xl font-bold">{activeModules.length}</div>
            <p className="text-xs text-muted-foreground mt-1">De un catálogo de 12</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500">Alertas Pendientes</CardTitle>
            <Bell className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadCount}</div>
            <p className="text-xs text-orange-600 mt-1 font-medium">Requiere acción</p>
          </CardContent>
        </Card>
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Módulos Habilitados</CardTitle>
              <CardDescription>Inicie sus unidades de negocio activas.</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/modules">Ver Lanzador</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {MOCK_MODULES.map((module) => (
                <div key={module.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:border-primary/20 hover:bg-white transition-all cursor-pointer group">
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
