"use client"

import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="h-24 w-24 bg-red-50 rounded-full flex items-center justify-center border-2 border-red-100 animate-pulse">
            <ShieldAlert className="h-12 w-12 text-red-500" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Access Restricted</h1>
          <p className="text-slate-500 leading-relaxed">
            Your account is authenticated, but your tenant configuration is missing or invalid. 
            TerraLink Hub requires valid tenant claims to grant access.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-left">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Diagnostics</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center justify-between">
              <span className="text-slate-600">Auth Status</span>
              <span className="text-emerald-600 font-medium">Authenticated</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-slate-600">Tenant ID</span>
              <span className="text-red-500 font-medium italic">Undefined</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-slate-600">Required Claims</span>
              <span className="text-red-500 font-medium">Missing</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button variant="outline" className="flex-1 gap-2" asChild>
            <Link href="/login">
              <ArrowLeft className="h-4 w-4" /> Back to Login
            </Link>
          </Button>
          <Button className="flex-1 gap-2" variant="default" asChild>
            <Link href="/">
              <Home className="h-4 w-4" /> Hub Home
            </Link>
          </Button>
        </div>

        <p className="text-xs text-slate-400 mt-8 italic">
          If you believe this is an error, please contact Terabound platform governance.
        </p>
      </div>
    </div>
  );
}