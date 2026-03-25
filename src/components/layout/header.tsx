
"use client"

import { Bell, User, Search, ChevronDown, Loader2 } from "lucide-react";
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
import { useEffect } from "react";
import { useTenant } from "@/context/tenant-context";
import { useUser } from "@/firebase/auth/use-user";
import { useMembership } from "@/firebase/auth/use-membership";
import { getAuth, signOut } from "firebase/auth";

export function Header() {
  const router = useRouter();
  const db = useFirestore();
  const { selectedTenant, setSelectedTenant } = useTenant();
  const { user } = useUser();
  const { membership } = useMembership();
  
  // Solo Super Admins globales pueden saltar de Tenant
  // Configurarlo en Vercel o en el archivo .env.local como NEXT_PUBLIC_SUPER_ADMIN_EMAILS=super@terabound.com
  const superAdminEmails = (process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAILS || "admin@terabound.com").split(',');
  const canSwitchTenants = superAdminEmails.includes(user?.email || "");

  const tenantsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "_gl_tenants"), limit(10));
  }, [db]);

  const { data: tenants, loading } = useCollection(tenantsQuery);

  useEffect(() => {
    if (tenants && tenants.length > 0 && !selectedTenant) {
      const first = tenants[0] as any;
      setSelectedTenant({
        id: first.id,
        name: first.name,
        tenantId: first.tenantId,
        activeModules: first.activeModules || []
      });
    }
  }, [tenants, selectedTenant, setSelectedTenant]);

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={!canSwitchTenants}>
            <Button variant="ghost" className="flex flex-col items-end h-auto py-1 px-2 hover:bg-slate-50">
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Cargando...</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold text-slate-900 leading-none">
                      {selectedTenant?.name || "Seleccionar Cliente"}
                    </span>
                    {canSwitchTenants && <ChevronDown className="h-3 w-3 text-slate-400" />}
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    ID: {selectedTenant?.tenantId || "---"}
                  </span>
                </>
              )}
            </Button>
          </DropdownMenuTrigger>
          {canSwitchTenants && (
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>Cambiar de Cliente</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {tenants?.map((t: any) => (
                <DropdownMenuItem 
                  key={t.id} 
                  onClick={() => setSelectedTenant({ 
                    id: t.id, 
                    name: t.name, 
                    tenantId: t.tenantId,
                    activeModules: t.activeModules || []
                  })}
                  className="flex justify-between items-center"
                >
                  <span>{t.name}</span>
                  <Badge variant="outline" className="text-[10px] opacity-60">{t.tenantId}</Badge>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          )}
        </DropdownMenu>

        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 hidden sm:flex">
          {membership?.role === "ADMIN" ? "Admin de Cliente" : (membership?.role || "Operativo")}
        </Badge>
        
        <Button variant="ghost" size="icon" className="relative" onClick={() => router.push('/notifications')}>
          <Bell className="h-5 w-5 text-slate-600" />
          <span className="absolute top-2 right-2.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9 border border-slate-100">
                <AvatarImage src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || 'Usuario'}`} alt="Usuario" />
                <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.displayName || 'Usuario Terabound'}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
             <DropdownMenuItem onClick={() => router.push('/profile')}>
              <User className="mr-2 h-4 w-4" />
              <span>Ajustes de Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600" onClick={async () => {
              const auth = getAuth();
              await signOut(auth);
              router.push('/login');
            }}>
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
