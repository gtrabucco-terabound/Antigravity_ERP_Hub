"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, ShieldCheck, Briefcase } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { createTenantUserAction } from "@/app/actions/user-admin"
import { useTenant } from "@/context/tenant-context"
import { useFirestore, useCollection } from "@/firebase"
import { collection } from "firebase/firestore"

const formSchema = z.object({
  displayName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Correo electrónico inválido"),
  role: z.enum([
    "ADMIN",
    "MANAGER",
    "AREA_MANAGER",
    "SUPERVISOR",
    "OPERATIVE",
    "ADMINISTRATIVE",
    "FINANCE",
    "IT",
    "AUDITOR"
  ]),
  modules: z.array(z.string()).default([])
})

interface TeamMemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tenantId: string
}

export function TeamMemberDialog({ open, onOpenChange, tenantId }: TeamMemberDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { selectedTenant } = useTenant()
  const db = useFirestore()
  
  // Obtenemos los módulos reales de la base de datos global
  const { data: allModules } = useCollection(db ? collection(db, "_gl_modules") : null)
  
  // Filtramos solo los módulos que el Tenant (empresa) tiene contratados y activos
  const tenantActiveModules = selectedTenant?.activeModules || []
  const AVAILABLE_MODULES = (allModules || [])
    .filter(mod => tenantActiveModules.includes(mod.id))
    .map(mod => ({
      id: mod.id,
      name: mod.name || mod.id
    }))


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: "",
      email: "",
      role: "OPERATIVE",
      modules: []
    },
  })

  const selectedRole = form.watch("role")

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)
      
      // Roles ejecutivos/IT fuerzan todos los módulos
      const hasFullAccess = ["ADMIN", "MANAGER", "IT", "AUDITOR"].includes(values.role);
      const finalModules = hasFullAccess 
        ? AVAILABLE_MODULES.map(m => m.id) 
        : values.modules;

      const result = await createTenantUserAction({
        email: values.email.trim(),
        displayName: values.displayName.trim(),
        tenantId,
        role: values.role,
        modules: finalModules
      })

      if (result.success) {
        // En una app real, mostraríamos un Toast de éxito
        form.reset()
        onOpenChange(false)
      } else {
        form.setError("root", { type: "server", message: result.error || "Ocurrió un error al invitar al usuario." })
      }
    } catch (error: any) {
      form.setError("root", { type: "server", message: "Error interno del servidor." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invitar Miembro al Equipo</DialogTitle>
          <DialogDescription>
            Agregue un nuevo usuario a este Workspace. Recibirá un correo para configurar su contraseña.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej. Juan Pérez" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo Electrónico (Email)</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="juan@ejemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nivel de Acceso (Rol)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar Rol" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="OPERATIVE">Operador / Técnico</SelectItem>
                      <SelectItem value="ADMINISTRATIVE">Administrativo</SelectItem>
                      <SelectItem value="SUPERVISOR">Supervisor</SelectItem>
                      <SelectItem value="FINANCE">Finanzas / Contabilidad</SelectItem>
                      <SelectItem value="AREA_MANAGER">Gerente de Área</SelectItem>
                      <SelectItem value="MANAGER">Gerente General</SelectItem>
                      <SelectItem value="IT">IT / Sistemas</SelectItem>
                      <SelectItem value="AUDITOR">Auditor / Consulta</SelectItem>
                      <SelectItem value="ADMIN">Admin Empresa (Dueño)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!["ADMIN", "MANAGER", "IT", "AUDITOR"].includes(selectedRole) && (
              <FormField
                control={form.control}
                name="modules"
                render={() => (
                  <FormItem>
                    <div className="mb-4 mt-6">
                      <FormLabel className="text-base flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-slate-500" /> Acceso a Módulos
                      </FormLabel>
                      <FormDescription>
                        Seleccione los módulos a los que el usuario tendrá acceso operativo.
                      </FormDescription>
                    </div>
                    <div className="space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
                      {AVAILABLE_MODULES.length === 0 ? (
                        <p className="text-sm text-slate-500 italic">No hay módulos contratados en esta empresa.</p>
                      ) : (
                        AVAILABLE_MODULES.map((moduleItem) => (
                          <FormField
                            key={moduleItem.id}
                            control={form.control}
                            name="modules"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={moduleItem.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(moduleItem.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, moduleItem.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== moduleItem.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">
                                    {moduleItem.name}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {form.formState.errors.root && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600 font-medium">
                {form.formState.errors.root.message}
              </div>
            )}

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? "Enviando..." : "Invitar y Crear Acceso"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
