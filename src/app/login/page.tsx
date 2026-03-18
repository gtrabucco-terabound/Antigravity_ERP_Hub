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

    // Simulate Auth Process
    setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard');
      toast({
        title: "Login Successful",
        description: "Welcome to TerraLink Hub.",
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
          <p className="text-slate-500 mt-2">Terabound Modular ERP Platform</p>
        </div>

        <Card className="border-slate-200 shadow-xl shadow-slate-200/50">
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
            <CardDescription>Enter your enterprise credentials to access your tenant hub.</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input id="email" type="email" placeholder="name@company.com" required />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <button type="button" className="text-xs text-primary hover:underline">Forgot password?</button>
                </div>
                <Input id="password" type="password" required />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign in to Hub"}
              </Button>
              <p className="text-xs text-center text-muted-foreground px-8">
                By signing in, you agree to the Terabound Platform Terms of Service and Privacy Policy.
              </p>
            </CardFooter>
          </form>
        </Card>

        <div className="text-center">
          <p className="text-sm text-slate-500">
            Tenant authentication is enforced. <br/>
            Contact your IT administrator for access requests.
          </p>
        </div>
      </div>
    </div>
  );
}