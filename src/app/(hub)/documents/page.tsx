"use client"

import { MOCK_DOCUMENTS } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye, MoreVertical, Search, Upload, Filter, Grid, List as ListIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Repositorio de Documentos</h1>
          <p className="text-muted-foreground mt-1">Almacenamiento centralizado seguro para todos los registros comerciales del cliente.</p>
        </div>
        <Button className="gap-2">
          <Upload className="h-4 w-4" />
          Subir Documento
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm">
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9 w-full md:w-[300px]" placeholder="Buscar archivos..." />
          </div>
          <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border rounded-lg overflow-hidden">
            <Button variant="ghost" size="icon" className="rounded-none bg-slate-50"><ListIcon className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="rounded-none"><Grid className="h-4 w-4" /></Button>
          </div>
          <Badge variant="outline" className="font-normal text-muted-foreground">{MOCK_DOCUMENTS.length} Archivos Totales</Badge>
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[40%]">Nombre</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Última Modificación</TableHead>
              <TableHead>Tamaño</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_DOCUMENTS.map((doc) => (
              <TableRow key={doc.id} className="hover:bg-slate-50/50">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 bg-primary/5 rounded flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{doc.name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase">{doc.type}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="capitalize text-[10px]">
                    {doc.category === 'report' ? 'Reporte' : doc.category === 'contract' ? 'Contrato' : 'Otro'}
                  </Badge>
                </TableCell>
                <TableCell>
                   <span className="flex items-center gap-1.5 text-xs text-slate-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                    {doc.status}
                  </span>
                </TableCell>
                <TableCell className="text-xs text-slate-500">{doc.updatedAt}</TableCell>
                <TableCell className="text-xs text-slate-500">{doc.size}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Download className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
