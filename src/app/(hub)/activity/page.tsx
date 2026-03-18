"use client"

import { useState } from "react";
import { MOCK_AUDIT_LOGS } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, ShieldAlert, Sparkles, Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { auditLogInsight, AuditLogInsightOutput } from "@/ai/flows/audit-log-insight-flow";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function ActivityPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [insight, setInsight] = useState<AuditLogInsightOutput | null>(null);
  const { toast } = useToast();

  const handleAIAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const logsToAnalyze = MOCK_AUDIT_LOGS.map(l => l.action);
      const result = await auditLogInsight({ auditLogs: logsToAnalyze });
      setInsight(result);
      toast({
        title: "Análisis Completado",
        description: "La IA ha revisado los registros en busca de actividad inusual.",
      });
    } catch (error) {
      toast({
        title: "Error en el Análisis",
        description: "Hubo un error al procesar los registros de auditoría con IA.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Auditoría y Actividad</h1>
          <p className="text-muted-foreground mt-1">Rastree todas las interacciones de la plataforma y eventos del sistema.</p>
        </div>
        <Button 
          onClick={handleAIAnalysis} 
          disabled={isAnalyzing} 
          className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-lg shadow-indigo-200"
        >
          {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          IA: Perspectiva de Registros
        </Button>
      </div>

      {insight && (
        <Card className="border-indigo-100 bg-indigo-50/30">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              <CardTitle className="text-lg text-indigo-900">Informe de Inteligencia de IA</CardTitle>
            </div>
            <CardDescription className="text-indigo-700/80">Reconocimiento automatizado de patrones en las interacciones recientes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-indigo-100">
              {insight.unusualActivityDetected ? (
                <ShieldAlert className="h-6 w-6 text-orange-500 mt-1" />
              ) : (
                <ShieldAlert className="h-6 w-6 text-emerald-500 mt-1" />
              )}
              <div>
                <p className="font-semibold text-slate-900">
                  {insight.unusualActivityDetected ? "Posible Anomalía Detectada" : "No se encontraron patrones inusuales"}
                </p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  {insight.unusualActivityDescription || "Sus registros del sistema parecen saludables. No se identificaron actividades sospechosas o escaladas de privilegios en esta muestra."}
                </p>
              </div>
            </div>
            {insight.suggestedActions && (
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-900/50">Acciones Sugeridas</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {insight.suggestedActions.map((action, i) => (
                    <div key={i} className="text-xs flex items-center gap-2 bg-indigo-100/50 text-indigo-900 p-2 rounded border border-indigo-200/50">
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-400"></div>
                      {action}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6">
        <div className="flex items-center gap-2 bg-white p-2 rounded-lg border shadow-sm">
          <Search className="h-4 w-4 text-muted-foreground ml-2" />
          <Input placeholder="Filtrar registros por usuario o entidad..." className="border-none focus-visible:ring-0" />
        </div>

        <div className="space-y-3">
          {MOCK_AUDIT_LOGS.map((log) => (
            <div key={log.id} className="group relative bg-white rounded-xl border border-slate-100 p-4 shadow-sm hover:border-primary/20 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <div className="h-10 w-10 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 group-hover:bg-primary/5 transition-colors">
                    <Activity className="h-5 w-5 text-slate-400 group-hover:text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 leading-tight">{log.action}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-[10px] px-1 py-0">{log.user}</Badge>
                      <span className="text-[10px] text-muted-foreground">•</span>
                      <span className="text-[10px] text-muted-foreground">{log.entity}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-medium text-slate-500">{format(new Date(log.timestamp), "d 'de' MMM, yyyy", { locale: es })}</p>
                  <p className="text-[10px] text-muted-foreground">{format(new Date(log.timestamp), 'HH:mm:ss')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center pt-4">
          <Button variant="outline" size="sm">Cargar Registros Anteriores</Button>
        </div>
      </div>
    </div>
  );
}
