"use client"

import { MOCK_NOTIFICATIONS } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCircle2, MoreHorizontal, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

export default function NotificationsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications Center</h1>
          <p className="text-muted-foreground mt-1">Updates across all modules for your tenant.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <CheckCircle2 className="h-4 w-4" />
          Mark all as read
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Tabs defaultValue="all" className="flex-1">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="urgent">High Priority</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9 w-[200px]" placeholder="Filter by keyword..." />
          </div>
          <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
        </div>
      </div>

      <div className="space-y-4">
        {MOCK_NOTIFICATIONS.map((n) => (
          <Card key={n.id} className={cn("border-none shadow-sm transition-all hover:shadow-md", !n.read && "border-l-4 border-l-primary")}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                  n.severity === 'high' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'
                )}>
                  <Bell className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={cn("text-sm font-semibold", !n.read ? "text-slate-900" : "text-slate-600")}>
                      {n.title}
                    </h3>
                    <span className="text-[10px] text-muted-foreground bg-slate-50 px-2 py-0.5 rounded border">
                      {format(new Date(n.timestamp), 'MMM d, h:mm a')}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {n.body}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        {n.severity}
                      </Badge>
                      {n.moduleId && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-primary/5 text-primary border-primary/10">
                          {n.moduleId}
                        </Badge>
                      )}
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}