"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/shared/spinner";
import { authClient } from "@/lib/auth-client";
import { useAdminStore } from "@/store/admin";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
type FormValues = z.infer<typeof schema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const { setAuth } = useAdminStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormValues) {
    const { error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setError("root", { message: "Invalid credentials" });
      toast.error("Sign in failed");
      return;
    }

    // Exchange session for JWT — admin token endpoint rejects non-super_admin
    const res = await fetch("/api/auth/token");

    if (!res.ok) {
      const body = await res.json() as { error?: string };
      const msg = body.error === "Not an admin account"
        ? "This account does not have admin access."
        : "Sign in failed. Check your credentials.";
      setError("root", { message: msg });
      toast.error(msg);
      await authClient.signOut();
      return;
    }

    const { token } = await res.json() as { token: string };
    const session = await authClient.getSession();

    if (session?.data?.user && token) {
      setAuth(token, {
        id: session.data.user.id,
        email: session.data.user.email,
        name: session.data.user.name,
      });
    }

    toast.success("Welcome, admin.");
    router.push("/businesses");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center gap-2.5 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-md">
              <ShieldCheck className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold tracking-tight">BizOS</span>
          </div>
          <p className="text-sm text-muted-foreground">Platform administration</p>
        </div>

        <Card className="shadow-lg border-border/60">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Admin sign in</CardTitle>
            <CardDescription>Restricted to BizOS team accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@bizos.app"
                  autoComplete="email"
                  autoFocus
                  {...register("email")}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="pr-10"
                    {...register("password")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full w-10 hover:bg-transparent text-muted-foreground"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
              </div>

              {errors.root && (
                <p className="text-xs text-destructive text-center">{errors.root.message}</p>
              )}

              <Button type="submit" className="w-full font-semibold" size="lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <><Spinner size="sm" className="mr-2 text-primary-foreground" /> Signing in…</>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
