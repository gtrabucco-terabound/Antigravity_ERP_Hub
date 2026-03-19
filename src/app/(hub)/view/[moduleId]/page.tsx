"use client"

import { useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, ExternalLink, RefreshCw, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export default function ModuleViewPage() {
  const { moduleId } = useParams();
  const db = useFirestore();
  const router = useRouter();
  const [iframeLoading, setIframeLoading] = useState(true);

  const moduleRef = useMemoFirebase(() => {
    if (!db || !moduleId) return null;
    return doc(db, "_gl_modules", moduleId as string);
  }, [db, moduleId]);

  const { data: module, loading: loadingData, error } = useDoc(moduleRef);

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

  const remoteUrl = (module as any).remoteUrl || "https://terabound-demo-module.web.app";

  return (
    <div className="flex flex-col h-full -m-8">
      {/* Mini Header de Control del Módulo */}
      <div className="h-12 bg-white border-b px-4 flex items-center justify-between shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="h-8 gap-1">
            <ArrowLeft className="h-4 w-4" /> Atrat
          </Button>
          <div className="h-4 w-px bg-slate-200 mx-1" />
          <h2 className="text-sm font-semibold text-slate-700">{(module as any).name}</h2>
          <Badge variant="secondary" className="text-[10px] h-5">ID: {module.id}</Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={() => setIframeLoading(true)}
          >
            <RefreshCw className={iframeLoading ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            asChild
          >
            <a href={remoteUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        </div>
      </div>

      {/* Area del Iframe */}
      <div className="flex-1 relative bg-slate-50 overflow-hidden">
        {iframeLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-20">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-xs text-slate-400">Cargando aplicación externa...</p>
            </div>
          </div>
        )}
        <iframe
          src={remoteUrl}
          className="w-full h-full border-none"
          onLoad={() => setIframeLoading(false)}
          title={(module as any).name}
          allow="geolocation; microphone; camera; midi; encrypted-media;"
        />
      </div>
    </div>
  );
}
