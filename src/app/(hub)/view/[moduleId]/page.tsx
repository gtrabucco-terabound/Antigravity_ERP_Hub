
"use client"

import { useDoc, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { doc } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, ExternalLink, RefreshCw, ShieldAlert, AlertCircle, UserCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { useTenant } from "@/context/tenant-context";

export default function ModuleViewPage() {
  const { moduleId } = useParams();
  const db = useFirestore();
  const router = useRouter();
  const { selectedTenant } = useTenant();
  const [iframeLoading, setIframeLoading] = useState(true);
  const [showSlowWarning, setShowSlowWarning] = useState(false);

  const moduleRef = useMemoFirebase(() => {
    if (!db || !moduleId) return null;
    return doc(db, "_gl_modules", moduleId as string);
  }, [db, moduleId]);

  const { data: module, loading: loadingData, error } = useDoc(moduleRef);

  const finalUrl = (module as any)?.remoteUrl || "";

  // Monitorizar carga lenta del Iframe
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (iframeLoading && finalUrl) {
      timer = setTimeout(() => {
        setShowSlowWarning(true);
      }, 7000); 
    } else {
      setShowSlowWarning(false);
    }
    return () => clearTimeout(timer);
  }, [iframeLoading, finalUrl]);

  if (loadingData) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-slate-500 font-medium">Iniciando módulo seguro...</p>
      </div>
    );
  }

  if (error || !module || !finalUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4 text-center px-4">
        <div className="bg-red-50 p-4 rounded-full">
          <ShieldAlert className="h-12 w-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Módulo no disponible</h2>
        <p className="text-slate-500 max-w-md">No se encontró una URL válida para este módulo en la base de datos global.</p>
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
              <UserCheck className="h-3 w-3" /> Cliente: {selectedTenant.name}
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
              setShowSlowWarning(false);
              const iframe = document.getElementById('module-iframe') as HTMLIFrameElement;
              if (iframe) iframe.src = finalUrl;
            }}
          >
            <RefreshCw className={iframeLoading ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"} />
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="h-8 gap-2 text-xs shadow-sm bg-primary"
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
          <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-20">
            <div className="flex flex-col items-center gap-4 text-center max-w-sm px-6">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <div>
                <p className="text-sm font-semibold text-slate-800">Cargando aplicación externa...</p>
                <p className="text-xs text-slate-500 mt-1">Accediendo a la dirección remota almacenada en el Hub.</p>
              </div>
              
              {showSlowWarning && (
                <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex gap-3 text-left">
                    <Clock className="h-5 w-5 text-amber-600 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-amber-900">¿Demora excesiva?</p>
                      <p className="text-[10px] text-amber-700 mt-1 leading-tight">
                        El servidor remoto está tardando en responder. Puedes intentar abrirlo directamente.
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-3 h-7 text-[10px] bg-white border-amber-200 text-amber-800 hover:bg-amber-100" 
                    asChild
                  >
                    <a href={finalUrl} target="_blank" rel="noopener noreferrer">Acceder en pestaña externa</a>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Aviso de contexto */}
        <div className="p-2.5 bg-blue-50 border-b border-blue-100">
          <div className="flex items-center gap-2 max-w-5xl mx-auto">
            <AlertCircle className="h-3.5 w-3.5 text-blue-600 shrink-0" />
            <p className="text-[10px] text-blue-800">
              Estás visualizando el módulo bajo el contexto del cliente <strong>{selectedTenant?.name}</strong>.
            </p>
          </div>
        </div>

        <div className="flex-1 relative">
          <iframe
            id="module-iframe"
            src={finalUrl}
            className="w-full h-full border-none"
            onLoad={() => setIframeLoading(false)}
            title={(module as any).name}
            allow="geolocation; microphone; camera; midi; encrypted-media; clipboard-read; clipboard-write;"
          />
        </div>
      </div>
    </div>
  );
}
