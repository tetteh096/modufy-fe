"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Building2, Eye, EyeOff, Users } from "lucide-react";
import { businessApi, getApiErrorMessage } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { formatTeamRole } from "@/lib/team-roles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/shared/spinner";
import { TeamRoleBadge } from "@/components/features/team/team-role-badge";
import { useAuthStore } from "@/store/auth";

const accountSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email"),
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Z]/, "Include an uppercase letter")
      .regex(/[0-9]/, "Include a number"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type AccountForm = z.infer<typeof accountSchema>;

function JoinContent() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") ?? "";
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<"account" | "accept">("account");
  const [sessionChecked, setSessionChecked] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  const {
    data: preview,
    isLoading: previewLoading,
    error: previewError,
  } = useQuery({
    queryKey: ["invite-preview", token],
    queryFn: () => businessApi.team.previewInvite(token),
    enabled: !!token,
    retry: false,
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<AccountForm>({
    resolver: zodResolver(accountSchema),
  });

  useEffect(() => {
    if (preview?.email) setValue("email", preview.email);
  }, [preview, setValue]);

  useEffect(() => {
    authClient.getSession().then((s) => {
      setHasSession(!!s?.data?.user);
      setSessionChecked(true);
      if (s?.data?.user) setStep("accept");
    });
  }, []);

  const acceptMutation = useMutation({
    mutationFn: () => businessApi.team.accept(token),
    onSuccess: async () => {
      const res = await fetch("/api/auth/token");
      const { token: jwt, onboarding_required } = await res.json();
      const session = await authClient.getSession();
      if (session?.data?.user && jwt && !onboarding_required) {
        setAuth(
          jwt,
          {
            id: session.data.user.id,
            email: session.data.user.email,
            name: session.data.user.name,
          },
          ""
        );
      }
      toast.success(`Welcome to ${preview?.business_name ?? "the team"}!`);
      router.push("/dashboard");
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  async function onCreateAccount(data: AccountForm) {
    if (preview?.email && data.email.toLowerCase() !== preview.email.toLowerCase()) {
      setError("email", { message: "Use the email this invite was sent to" });
      return;
    }

    const { error } = await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    if (error) {
      if (error.message?.toLowerCase().includes("email")) {
        setError("email", {
          message: "An account exists — sign in, then open this invite link again",
        });
      } else {
        toast.error(error.message ?? "Could not create account");
      }
      return;
    }

    const res = await fetch("/api/auth/token");
    const { token: jwt } = await res.json();
    const session = await authClient.getSession();
    if (session?.data?.user && jwt) {
      setAuth(
        jwt,
        {
          id: session.data.user.id,
          email: session.data.user.email,
          name: session.data.user.name,
        },
        ""
      );
    }

    setStep("accept");
    acceptMutation.mutate();
  }

  if (!token) {
    return (
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>Invalid invite</CardTitle>
          <CardDescription>This link is missing a token. Ask your manager for a new invite.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (previewLoading || !sessionChecked) {
    return (
      <div className="flex flex-col items-center gap-3">
        <Spinner className="h-8 w-8" />
        <p className="text-sm text-muted-foreground">Loading invite…</p>
      </div>
    );
  }

  if (previewError || !preview) {
    return (
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>Invite unavailable</CardTitle>
          <CardDescription>
            This link may have expired or already been used. Request a new invite from your
            team admin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button nativeButton={false} render={<Link href="/login" />} variant="outline" className="w-full">
            Sign in
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md shadow-lg animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Users className="h-6 w-6" />
        </div>
        <CardTitle>Join {preview.business_name}</CardTitle>
        <CardDescription className="flex flex-col items-center gap-2 pt-1">
          <span>You&apos;ve been invited as</span>
          <TeamRoleBadge role={preview.role} />
          <span className="text-xs">{formatTeamRole(preview.role)} access on BizOS</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {step === "account" && !hasSession && (
          <form onSubmit={handleSubmit(onCreateAccount)} className="space-y-4">
            <p className="text-sm text-muted-foreground rounded-lg bg-muted/40 p-3">
              Create your login (password). This is <strong>not</strong> the business owner
              signup — you join an existing team.
            </p>
            <div className="space-y-2">
              <Label htmlFor="name">Your name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                readOnly={!!preview.email}
                className={preview.email ? "bg-muted/50" : undefined}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || acceptMutation.isPending}
            >
              {(isSubmitting || acceptMutation.isPending) && (
                <Spinner className="mr-2 h-4 w-4" />
              )}
              Create account & join
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link href={`/login?next=/join?token=${token}`} className="text-primary font-medium">
                Sign in first
              </Link>
            </p>
          </form>
        )}

        {(step === "accept" || hasSession) && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              {hasSession
                ? "You're signed in. Accept to join this business."
                : "Finishing setup…"}
            </p>
            <Button
              className="w-full gap-2"
              disabled={acceptMutation.isPending}
              onClick={() => acceptMutation.mutate()}
            >
              {acceptMutation.isPending && <Spinner className="h-4 w-4" />}
              <Building2 className="h-4 w-4" />
              Join {preview.business_name}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function JoinPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/30">
      <Suspense
        fallback={
          <div className="flex items-center gap-2 text-muted-foreground">
            <Spinner className="h-6 w-6" />
            Loading…
          </div>
        }
      >
        <JoinContent />
      </Suspense>
    </div>
  );
}
