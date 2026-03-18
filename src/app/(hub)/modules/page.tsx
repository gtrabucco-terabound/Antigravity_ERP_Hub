"use client"

import { MOCK_MODULES } from "@/lib/mock-data";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Layers, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function ModulesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Modules Launcher</h1>
          <p className="text-muted-foreground mt-1">Access and manage your tenant-enabled modules.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9 w-[200px] md:w-[300px]" placeholder="Search modules..." />
          </div>
          <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {MOCK_MODULES.map((module) => (
          <Card key={module.id} className="flex flex-col border-none shadow-sm hover:shadow-md transition-shadow group">
            <CardHeader className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                  <Layers className="h-6 w-6" />
                </div>
                <Badge variant={module.status === 'active' ? 'default' : 'secondary'}>
                  {module.status}
                </Badge>
              </div>
              <CardTitle className="group-hover:text-primary transition-colors">{module.name}</CardTitle>
              <CardDescription className="mt-2 text-slate-500 leading-relaxed">
                {module.description}
              </CardDescription>
            </CardHeader>
            <CardFooter className="pt-0">
              <Button className="w-full bg-slate-900 hover:bg-slate-800" disabled={module.status !== 'active'}>
                {module.status === 'active' ? (
                  <>Open Application <ExternalLink className="ml-2 h-4 w-4" /></>
                ) : (
                  "Temporarily Offline"
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {MOCK_MODULES.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-xl bg-slate-50 p-8 text-center">
          <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Layers className="h-8 w-8 text-slate-300" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900">No Modules Enabled</h2>
          <p className="text-slate-500 mt-2 max-w-md">Your tenant currently has no modules enabled. Please contact your administrator or the platform provider to enable features for your account.</p>
          <Button className="mt-6">Browse Catalog</Button>
        </div>
      )}
    </div>
  );
}