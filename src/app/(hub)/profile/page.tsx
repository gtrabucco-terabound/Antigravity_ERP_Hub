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

export default function ProfilePage() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Settings Saved",
        description: "Your preferences have been updated in your hub profile.",
      });
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your identity and hub preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1 space-y-1">
          <Button variant="secondary" className="w-full justify-start gap-2 bg-primary/10 text-primary border-none">
            <User className="h-4 w-4" /> Personal Info
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2 text-slate-600">
            <Shield className="h-4 w-4" /> Security
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2 text-slate-600">
            <Bell className="h-4 w-4" /> Notifications
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2 text-slate-600">
            <Globe className="h-4 w-4" /> Language
          </Button>
        </aside>

        <div className="md:col-span-3 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Public Profile</CardTitle>
              <CardDescription>How others see you across the Terabound platform.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20 ring-4 ring-slate-50">
                  <AvatarImage src="https://picsum.photos/seed/user/80/80" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" size="sm">Change Photo</Button>
                  <p className="text-xs text-muted-foreground">JPG, GIF or PNG. 1MB max.</p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Full Name</Label>
                  <Input id="firstName" defaultValue="Alex Dupont" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Work Email</Label>
                  <Input id="email" defaultValue="alex.dupont@teracorp.com" disabled />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Interface Preferences</CardTitle>
              <CardDescription>Customize the hub look and feel for your workspace.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4 text-slate-400" />
                    <Label className="text-sm font-semibold">Dark Mode</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">Adjust the UI theme for your environment.</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                   <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-slate-400" />
                    <Label className="text-sm font-semibold">System Language</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">Preferred language for navigation and alerts.</p>
                </div>
                <Select defaultValue="en">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Select" />
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
              <Button variant="ghost">Reset Defaults</Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : <><Check className="mr-2 h-4 w-4" /> Save Changes</>}
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-red-100 bg-red-50/20">
            <CardHeader>
              <CardTitle className="text-red-900">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-red-900">Sign out from all devices</p>
                  <p className="text-xs text-red-700/70">Disconnect your current session across all platforms.</p>
                </div>
                <Button variant="destructive" size="sm" className="gap-2">
                  <LogOut className="h-4 w-4" /> Logout All
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}