"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User, Shield, Bell, Globe, Palette, LogOut, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/firebase/auth/use-user";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { toast } = useToast();
  const { user } = useUser();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Ajustes Guardados",
        description: "Sus preferencias han sido actualizadas en su perfil de hub.",
      });
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ajustes de la Cuenta</h1>
        <p className="text-muted-foreground mt-1">Gestione su identidad y preferencias de hub.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1 space-y-1">
          <Button variant="secondary" className="w-full justify-start gap-2 bg-primary/10 text-primary border-none">
            <User className="h-4 w-4" /> Info Personal
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2 text-slate-600">
            <Shield className="h-4 w-4" /> Seguridad
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2 text-slate-600">
            <Bell className="h-4 w-4" /> Notificaciones
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2 text-slate-600">
            <Globe className="h-4 w-4" /> Idioma
          </Button>
        </aside>

        <div className="md:col-span-3 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Perfil Público</CardTitle>
              <CardDescription>Cómo lo ven los demás en la plataforma Terabound.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20 ring-4 ring-slate-50">
                  <AvatarImage src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || "Usuario"}`} />
                  <AvatarFallback>{user?.displayName?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" size="sm">Cambiar Foto</Button>
                  <p className="text-xs text-muted-foreground">JPG, GIF o PNG. Máx 1MB.</p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre Completo</Label>
                  <Input id="firstName" defaultValue={user?.displayName || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo del Trabajo</Label>
                  <Input id="email" defaultValue={user?.email || ""} disabled />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Preferencias de Interfaz</CardTitle>
              <CardDescription>Personalice el aspecto y comportamiento del hub.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4 text-slate-400" />
                    <Label className="text-sm font-semibold">Modo Oscuro</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">Ajuste el tema de la interfaz para su entorno.</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                   <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-slate-400" />
                    <Label className="text-sm font-semibold">Idioma del Sistema</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">Idioma preferido para navegación y alertas.</p>
                </div>
                <Select defaultValue="es">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English (US)</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="pt">Português</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50/50 border-t flex justify-end gap-3 px-6 py-4">
              <Button variant="ghost">Restaurar Valores</Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Guardando..." : <><Check className="mr-2 h-4 w-4" /> Guardar Cambios</>}
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-red-100 bg-red-50/20">
            <CardHeader>
              <CardTitle className="text-red-900">Zona de Peligro</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-red-900">Cerrar sesión en todos los dispositivos</p>
                  <p className="text-xs text-red-700/70">Desconecte su sesión actual en todas las plataformas.</p>
                </div>
                <Button variant="destructive" size="sm" className="gap-2" onClick={async () => {
                  const auth = getAuth();
                  await signOut(auth);
                  router.push('/login');
                }}>
                  <LogOut className="h-4 w-4" /> Salir de Todo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
