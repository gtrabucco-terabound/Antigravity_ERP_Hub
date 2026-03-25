"use client"

import { useState } from "react";
import { 
  Users, 
  Search, 
  ShieldAlert, 
  UserPlus, 
  MoreHorizontal, 
  ShieldCheck, 
  Briefcase 
} from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { useTenant } from "@/context/tenant-context";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { useMembership } from "@/firebase/auth/use-membership";
import { TeamMemberDialog } from "@/components/team/team-member-dialog";
import { updateTenantUserAction } from "@/app/actions/user-admin";
import { Loader2 } from "lucide-react";

export default function TeamPage() {
  const db = useFirestore();
  const { selectedTenant } = useTenant();
  const { membership } = useMembership();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<any>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  const tenantId = selectedTenant?.id || "";

  // Seguridad Front-End: ADMIN, MANAGER, IT pueden ver el equipo
  const canManageTeam = membership?.role && ["ADMIN", "MANAGER", "IT"].includes(membership.role);

  // Obtenemos miembros del Tenant
  const membersQuery = useMemoFirebase(() => {
    if (!db || !tenantId) return null;
    return query(
      collection(db, "_gl_tenants", tenantId, "members"),
      orderBy("joinedAt", "desc")
    );
  }, [db, tenantId]);

  const { data: members, loading } = useCollection(membersQuery);

  if (!canManageTeam) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <ShieldAlert className="h-16 w-16 text-red-500/20 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800">Acceso Restringido</h2>
        <p className="text-slate-500 mt-2 max-w-md">Solo los administradores del workspace pueden gestionar el equipo y los accesos a módulos.</p>
      </div>
    );
  }

  const roleLabels: Record<string, string> = {
    "ADMIN": "Dueño (Admin)",
    "MANAGER": "Gerente General",
    "AREA_MANAGER": "Gerente de Área",
    "SUPERVISOR": "Supervisor",
    "OPERATIVE": "Operativo / Técnico",
    "ADMINISTRATIVE": "Administrativo",
    "FINANCE": "Finanzas",
    "IT": "Sistemas",
    "AUDITOR": "Auditor"
  };

  const roleColors: Record<string, string> = {
    "ADMIN": "bg-indigo-900 text-indigo-100 border-indigo-900",
    "MANAGER": "bg-indigo-100 text-indigo-800 border-indigo-300",
    "AREA_MANAGER": "bg-blue-50 text-blue-700 border-blue-200",
    "SUPERVISOR": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "OPERATIVE": "bg-slate-100 text-slate-700 border-slate-200",
    "ADMINISTRATIVE": "bg-orange-50 text-orange-700 border-orange-200",
    "FINANCE": "bg-emerald-100 text-emerald-800 border-emerald-300",
    "IT": "bg-purple-50 text-purple-700 border-purple-200",
    "AUDITOR": "bg-yellow-50 text-yellow-800 border-yellow-300"
  };

  const handleCreateMember = () => {
    setMemberToEdit(null);
    setIsDialogOpen(true);
  };

  const handleEditMember = (member: any) => {
    setMemberToEdit(member);
    setIsDialogOpen(true);
  };

  const handleSuspendMember = async (memberId: string, currentStatus: string) => {
    try {
      setProcessingId(memberId);
      const newStatus = currentStatus === "active" ? "suspended" : "active";
      await updateTenantUserAction({
        uid: memberId,
        tenantId,
        status: newStatus
      });
    } catch (error) {
      console.error("Error toggling member status:", error);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Equipo y Accesos</h1>
          <p className="text-slate-500 font-medium">Gestione los usuarios de su workspace y sus permisos por módulo.</p>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2" onClick={handleCreateMember}>
            <UserPlus className="h-4 w-4" /> Invitar Miembro
          </Button>
        </div>
      </div>

      <TeamMemberDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        tenantId={tenantId} 
        memberToEdit={memberToEdit}
      />

      <Card className="border-none shadow-sm">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Buscar por ID de usuario o email..." 
              className="pl-10 bg-slate-50/50 border-slate-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="w-[350px] font-bold text-slate-700">Usuario ID</TableHead>
              <TableHead className="font-bold text-slate-700">Rol Global</TableHead>
              <TableHead className="font-bold text-slate-700">Módulos Asignados</TableHead>
              <TableHead className="font-bold text-slate-700">Estado</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center text-slate-500">Cargando equipo...</TableCell>
              </TableRow>
            ) : members && members.length > 0 ? (
              members.map((member: any) => (
                <TableRow key={member.id} className="hover:bg-slate-50/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <Users className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 text-sm">{member.id}</span>
                        <span className="text-xs text-slate-500 truncate w-[200px]">UID interno de plataforma</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`font-bold ${roleColors[member.role] || roleColors["OPERATIVE"]}`}>
                      {member.role === "ADMIN" && <ShieldCheck className="h-3 w-3 mr-1" />}
                      {roleLabels[member.role] || member.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {member.modules?.length > 0 
                        ? member.modules.map((mod: string) => (
                            <Badge key={mod} variant="secondary" className="text-[10px] font-medium bg-slate-100">
                              <Briefcase className="h-3 w-3 mr-1 text-slate-400" /> {mod}
                            </Badge>
                          ))
                        : <span className="text-xs text-slate-400 italic">No asignados (Depende del Rol)</span>
                      }
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${member.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <span className="text-sm font-medium text-slate-600 capitalize">{member.status || 'Activo'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEditMember(member)}>Modificar Permisos</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className={member.status === 'active' ? "text-red-600" : "text-emerald-600"}
                          onClick={() => handleSuspendMember(member.id, member.status || 'active')}
                          disabled={processingId === member.id}
                        >
                          {processingId === member.id ? (
                            <><Loader2 className="h-3 w-3 mr-2 animate-spin" /> Procesando...</>
                          ) : (
                            member.status === 'active' ? "¿Suspender Acceso?" : "Activar Acceso"
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center text-slate-500">
                  <p>No se encontraron otros miembros en tu equipo.</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
