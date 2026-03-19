
"use client"

import { useDoc, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { doc } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, ExternalLink, RefreshCw, ShieldAlert, AlertCircle, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { useTenant } from "@/context/tenant-context";

export default function ModuleViewPage() {
  const { moduleId } = useParams();
  const db = useFirestore();
  const router = useRouter();
  const { user } = useUser();
  const { selectedTenant } = useTenant();
  const [iframeLoading, setIframeLoading] = useState(true);
  const [finalUrl, setFinalUrl] = useState<string>("");

  const moduleRef = useMemoFirebase(() => {
    if (!db || !moduleId) return null;
    return doc(db, "_gl_modules", moduleId as string);
  }, [db, moduleId]);

  const { data: module, loading: loadingData, error } = useDoc(moduleRef);

  // Construir la URL con el contexto del Tenant para el SSO
  useEffect(() => {
    if (module && selectedTenant && user) {
      const baseUrl = (module as any).remoteUrl || "https://terabound-demo-module.web.app";
      // Añadimos parámetros de contexto para que el módulo sepa quién lo llama
      const urlWithContext = new URL(baseUrl);
      urlWithContext.searchParams.append("tenantId", selectedTenant.tenantId);
      urlWithContext.searchParams.append("hubOrigin", window.location.origin);
      // Nota: En producción, aquí pasaríamos un token de corta duración en lugar del UID directamente
      urlWithContext.searchParams.append("uid", user.uid);
      
      setFinalUrl(urlWithContext.toString());
    }
  }, [module, selectedTenant, user]);

  if (loadingData) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-slate-500 font-medium">Iniciando módulo seguro...</p>
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4 text-center px-4">
        <div className="bg-red-50 p-4 rounded-full">
          <ShieldAlert className="h-12 w-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Módulo no encontrado</h2>
        <p className="text-slate-500 max-w-md">No se pudo cargar el módulo solicitado o no tiene permisos para acceder a él.</p>
        <Button onClick={() => router.push('/dashboard')}>Volver al Tablero</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full -m-8">
      {/* Barra de Control del Módulo */}
      <div className="h-12 bg-white border-b px-4 flex items-center justify-between shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="h-8 gap-1">
            <ArrowLeft className="h-4 w-4" /> Volver
          </Button>
          <div className="h-4 w-px bg-slate-200 mx-1" />
          <h2 className="text-sm font-semibold text-slate-700">{(module as any).name}</h2>
          <Badge variant="secondary" className="text-[10px] h-5">ID: {module.id}</Badge>
          {selectedTenant && (
            <Badge variant="outline" className="text-[10px] h-5 border-emerald-200 text-emerald-700 bg-emerald-50 gap-1">
              <UserCheck className="h-3 w-3" /> Contexto: {selectedTenant.name}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            title="Recargar Módulo"
            onClick={() => {
              setIframeLoading(true);
              const iframe = document.getElementById('module-iframe') as HTMLIFrameElement;
              if (iframe) iframe.src = finalUrl;
            }}
          >
            <RefreshCw className={iframeLoading ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"} />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 gap-2 text-xs"
            asChild
          >
            <a href={finalUrl} target="_blank" rel="noopener noreferrer">
              Abrir en pestaña nueva <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>
      </div>

      {/* Area del Iframe */}
      <div className="flex-1 relative bg-slate-100/50 overflow-hidden flex flex-col">
        {iframeLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-20">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-xs text-slate-400">Cargando aplicación externa...</p>
            </div>
          </div>
        )}

        {/* Aviso de seguridad/carga */}
        <div className="p-3 bg-blue-50 border-b border-blue-100">
          <div className="flex items-start gap-3 max-w-5xl mx-auto">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="space-y-1">
              <p className="text-[11px] text-blue-800 leading-tight">
                <strong>Modo Ecosistema Activo:</strong> El Hub está inyectando tu identidad y el contexto del cliente <strong>{selectedTenant?.name}</strong> en este módulo.
              </p>
              <p className="text-[10px] text-blue-600/80">
                Si el módulo no carga debido a políticas de seguridad (X-Frame), usa el botón <strong>"Abrir en pestaña nueva"</strong> arriba.
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 relative">
          {finalUrl && (
            <iframe
              id="module-iframe"
              src={finalUrl}
              className="w-full h-full border-none"
              onLoad={() => setIframeLoading(false)}
              title={(module as any).name}
              allow="geolocation; microphone; camera; midi; encrypted-media; clipboard-read; clipboard-write;"
            />
          )}
        </div>
      </div>
    </div>
  );
}
