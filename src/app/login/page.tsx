"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simular proceso de autenticación
    setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard');
      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido a TerraLink Hub.",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="bg-primary h-12 w-12 rounded-xl flex items-center justify-center shadow-lg mb-4">
            <ShieldCheck className="text-white h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">TerraLink<span className="text-primary font-normal">Hub</span></h1>
          <p className="text-slate-500 mt-2">Plataforma ERP Modular Terabound</p>
        </div>

        <Card className="border-slate-200 shadow-xl shadow-slate-200/50">
          <CardHeader>
            <CardTitle>Iniciar sesión</CardTitle>
            <CardDescription>Ingrese sus credenciales corporativas para acceder a su hub de cliente.</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input id="email" type="email" placeholder="nombre@empresa.com" required />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Contraseña</Label>
                  <button type="button" className="text-xs text-primary hover:underline">¿Olvidó su contraseña?</button>
                </div>
                <Input id="password" type="password" required />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Ingresar al Hub"}
              </Button>
              <p className="text-xs text-center text-muted-foreground px-8">
                Al iniciar sesión, acepta los Términos de Servicio y la Política de Privacidad de la plataforma Terabound.
              </p>
            </CardFooter>
          </form>
        </Card>

        <div className="text-center">
          <p className="text-sm text-slate-500">
            La autenticación de cliente es obligatoria. <br/>
            Contacte a su administrador de TI para solicitudes de acceso.
          </p>
        </div>
      </div>
    </div>
  );
}
