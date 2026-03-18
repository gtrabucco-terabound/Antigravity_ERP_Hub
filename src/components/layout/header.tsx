"use client"

import { Bell, User, Search, Globe, ChevronDown, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, limit } from "firebase/firestore";
import { useState, useEffect } from "react";

export function Header() {
  const router = useRouter();
  const db = useFirestore();
  const [selectedTenant, setSelectedTenant] = useState<{ name: string, tenantId: string } | null>(null);

  // Consulta real a Firestore para obtener los tenants (clientes) globales
  const tenantsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "_gl_tenants"), limit(10));
  }, [db]);

  const { data: tenants, loading } = useCollection(tenantsQuery);

  // Seleccionar el primer tenant por defecto cuando carguen los datos
  useEffect(() => {
    if (tenants && tenants.length > 0 && !selectedTenant) {
      setSelectedTenant({
        name: (tenants[0] as any).name,
        tenantId: (tenants[0] as any).tenantId
      });
    }
  }, [tenants, selectedTenant]);

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar dentro de TerraLink..."
            className="pl-9 bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-primary w-full max-w-md h-9"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Selector de Tenant Conectado a Firestore */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex flex-col items-end h-auto py-1 px-2 hover:bg-slate-50">
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Cargando base...</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold text-slate-900 leading-none">
                      {selectedTenant?.name || "Seleccionar Cliente"}
                    </span>
                    <ChevronDown className="h-3 w-3 text-slate-400" />
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    ID: {selectedTenant?.tenantId || "---"}
                  </span>
                </>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>Cambiar de Cliente (Base de Datos)</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {tenants?.map((t: any) => (
              <DropdownMenuItem 
                key={t.id} 
                onClick={() => setSelectedTenant({ name: t.name, tenantId: t.tenantId })}
                className="flex justify-between items-center"
              >
                <span>{t.name}</span>
                <Badge variant="outline" className="text-[10px] opacity-60">{t.tenantId}</Badge>
              </DropdownMenuItem>
            ))}
            {(!tenants || tenants.length === 0) && !loading && (
              <div className="p-4 text-center text-xs text-muted-foreground">
                No se encontraron tenants en la colección /_gl_tenants
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 hidden sm:flex">
          Admin de Cliente
        </Badge>
        
        <Button variant="ghost" size="icon" className="relative" onClick={() => router.push('/notifications')}>
          <Bell className="h-5 w-5 text-slate-600" />
          <span className="absolute top-2 right-2.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9 border border-slate-100">
                <AvatarImage src="https://picsum.photos/seed/user/32/32" alt="Usuario" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Alex Dupont</p>
                <p className="text-xs leading-none text-muted-foreground">alex.dupont@teracorp.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/profile')}>
              <User className="mr-2 h-4 w-4" />
              <span>Ajustes de Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600" onClick={() => router.push('/login')}>
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
