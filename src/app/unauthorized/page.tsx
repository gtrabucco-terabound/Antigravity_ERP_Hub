"use client"

import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="h-24 w-24 bg-red-50 rounded-full flex items-center justify-center border-2 border-red-100 animate-pulse">
            <ShieldAlert className="h-12 w-12 text-red-500" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Acceso Restringido</h1>
          <p className="text-slate-500 leading-relaxed">
            Su cuenta está autenticada, pero la configuración de su cliente no existe o es inválida. 
            TerraLink Hub requiere permisos válidos de cliente para otorgar acceso.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-left">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Diagnóstico</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center justify-between">
              <span className="text-slate-600">Estado Auth</span>
              <span className="text-emerald-600 font-medium">Autenticado</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-slate-600">ID de Cliente</span>
              <span className="text-red-500 font-medium italic">Indefinido</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-slate-600">Permisos Requeridos</span>
              <span className="text-red-500 font-medium">Faltantes</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button variant="outline" className="flex-1 gap-2" asChild>
            <Link href="/login">
              <ArrowLeft className="h-4 w-4" /> Volver al Inicio
            </Link>
          </Button>
          <Button className="flex-1 gap-2" variant="default" asChild>
            <Link href="/">
              <Home className="h-4 w-4" /> Inicio del Hub
            </Link>
          </Button>
        </div>

        <p className="text-xs text-slate-400 mt-8 italic">
          Si cree que esto es un error, por favor contacte al soporte técnico de Terabound.
        </p>
      </div>
    </div>
  );
}
