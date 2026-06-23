"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import QRCode from "qrcode";
import { toast } from "sonner";
import { ShieldCheck, KeyRound } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { syncAuthToken } from "@/lib/auth-session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/shared/spinner";
import { SettingsSection } from "@/components/features/settings/settings-section";

const passwordSchema = z.object({
  password: z.string().min(1, "Enter your password"),
});

type PasswordForm = z.infer<typeof passwordSchema>;

type SetupState = {
  totpURI: string;
  backupCodes: string[];
};

function userHas2fa(user: unknown): boolean {
  return Boolean(user && typeof user === "object" && "twoFactorEnabled" in user && user.twoFactorEnabled);
}

export function TwoFactorSettings() {
  const { data: session, isPending, refetch } = authClient.useSession();
  const enabled = userHas2fa(session?.user);

  const [setup, setSetup] = useState<SetupState | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [shownBackupCodes, setShownBackupCodes] = useState<string[] | null>(null);
  const [busy, setBusy] = useState(false);

  const enableForm = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) });
  const disableForm = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) });
  const regenForm = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) });

  useEffect(() => {
    if (!setup?.totpURI) {
      setQrDataUrl(null);
      return;
    }

    let active = true;
    QRCode.toDataURL(setup.totpURI, { width: 200, margin: 2 })
      .then((url) => {
        if (active) setQrDataUrl(url);
      })
      .catch(() => {
        if (active) setQrDataUrl(null);
      });

    return () => {
      active = false;
    };
  }, [setup?.totpURI]);

  async function startEnable(data: PasswordForm) {
    setBusy(true);
    const { data: result, error } = await authClient.twoFactor.enable({
      password: data.password,
      issuer: "BizOS",
    });
    setBusy(false);

    if (error) {
      toast.error(error.message ?? "Could not start 2FA setup");
      return;
    }

    if (!result?.totpURI || !result.backupCodes?.length) {
      toast.error("Unexpected response from server");
      return;
    }

    setSetup({ totpURI: result.totpURI, backupCodes: result.backupCodes });
    setShownBackupCodes(result.backupCodes);
    setVerifyCode("");
    toast.success("Scan the QR code, save your backup codes, then verify.");
  }

  async function completeSetup() {
    if (verifyCode.length < 6) {
      toast.error("Enter the 6-digit code from your authenticator app");
      return;
    }

    setBusy(true);
    const { error } = await authClient.twoFactor.verifyTotp({ code: verifyCode });
    setBusy(false);

    if (error) {
      toast.error(error.message ?? "Invalid code");
      return;
    }

    setSetup(null);
    setShownBackupCodes(null);
    setVerifyCode("");
    await refetch();
    await syncAuthToken();
    toast.success("Two-factor authentication is now enabled.");
  }

  async function disable2fa(data: PasswordForm) {
    setBusy(true);
    const { error } = await authClient.twoFactor.disable({ password: data.password });
    setBusy(false);

    if (error) {
      toast.error(error.message ?? "Could not disable 2FA");
      return;
    }

    disableForm.reset();
    await refetch();
    toast.success("Two-factor authentication disabled.");
  }

  async function regenerateCodes(data: PasswordForm) {
    setBusy(true);
    const { data: result, error } = await authClient.twoFactor.generateBackupCodes({
      password: data.password,
    });
    setBusy(false);

    if (error) {
      toast.error(error.message ?? "Could not generate backup codes");
      return;
    }

    if (!result?.backupCodes?.length) {
      toast.error("No backup codes returned");
      return;
    }

    regenForm.reset();
    setShownBackupCodes(result.backupCodes);
    toast.success("New backup codes generated. Store them somewhere safe.");
  }

  if (isPending) {
    return (
      <SettingsSection title="Two-factor authentication" icon={ShieldCheck}>
        <div className="flex justify-center py-6">
          <Spinner className="h-6 w-6" />
        </div>
      </SettingsSection>
    );
  }

  return (
    <SettingsSection
      title="Two-factor authentication"
      icon={ShieldCheck}
      description="Require a code from your authenticator app when signing in with email and password."
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Status</span>
        <Badge variant={enabled ? "default" : "secondary"}>
          {enabled ? "Enabled" : "Not enabled"}
        </Badge>
      </div>

      {setup ? (
        <div className="space-y-5 rounded-lg border border-dashed p-4">
          <p className="text-sm text-muted-foreground">
            Scan this QR code with Google Authenticator, 1Password, or another TOTP app.
          </p>

          <div className="flex flex-col items-center gap-3">
            {qrDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qrDataUrl} alt="Authenticator QR code" className="rounded-md border" width={200} height={200} />
            ) : (
              <div className="flex h-[200px] w-[200px] items-center justify-center rounded-md border bg-muted">
                <Spinner className="h-6 w-6" />
              </div>
            )}
            <p className="max-w-full break-all text-center text-xs text-muted-foreground font-mono">
              {setup.totpURI}
            </p>
          </div>

          {shownBackupCodes ? (
            <div className="rounded-md bg-muted/60 p-3">
              <p className="mb-2 text-sm font-medium">Backup codes — save these now</p>
              <ul className="grid grid-cols-2 gap-1 font-mono text-sm sm:grid-cols-3">
                {shownBackupCodes.map((code) => (
                  <li key={code}>{code}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="space-y-3">
            <Label htmlFor="verify-code">Verification code</Label>
            <Input
              id="verify-code"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="000000"
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              disabled={busy}
              className="max-w-xs font-mono text-lg tracking-widest"
            />
            <Button type="button" onClick={completeSetup} disabled={busy}>
              {busy ? <Spinner className="mr-2 h-4 w-4" /> : null}
              Confirm and enable
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setSetup(null);
                setShownBackupCodes(null);
                enableForm.reset();
              }}
            >
              Cancel setup
            </Button>
          </div>
        </div>
      ) : enabled ? (
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Sign-in with email and password will ask for your authenticator code.
          </p>

          <form onSubmit={regenForm.handleSubmit(regenerateCodes)} className="space-y-3 max-w-md">
            <p className="text-sm font-medium">Regenerate backup codes</p>
            <div className="space-y-1.5">
              <Label htmlFor="regen-password">Password</Label>
              <Input id="regen-password" type="password" autoComplete="current-password" {...regenForm.register("password")} />
            </div>
            <Button type="submit" variant="outline" disabled={busy}>
              {busy ? <Spinner className="mr-2 h-4 w-4" /> : null}
              Generate new backup codes
            </Button>
          </form>

          {shownBackupCodes ? (
            <div className="rounded-md border border-amber-500/40 bg-amber-500/5 p-3">
              <p className="mb-2 text-sm font-medium">New backup codes</p>
              <ul className="grid grid-cols-2 gap-1 font-mono text-sm sm:grid-cols-3">
                {shownBackupCodes.map((code) => (
                  <li key={code}>{code}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <form onSubmit={disableForm.handleSubmit(disable2fa)} className="space-y-3 max-w-md border-t pt-5">
            <p className="text-sm font-medium text-destructive">Disable two-factor authentication</p>
            <div className="space-y-1.5">
              <Label htmlFor="disable-password">Password</Label>
              <Input id="disable-password" type="password" autoComplete="current-password" {...disableForm.register("password")} />
            </div>
            <Button type="submit" variant="destructive" disabled={busy}>
              {busy ? <Spinner className="mr-2 h-4 w-4" /> : null}
              Disable 2FA
            </Button>
          </form>
        </div>
      ) : (
        <form onSubmit={enableForm.handleSubmit(startEnable)} className="space-y-3 max-w-md">
          <p className="text-sm text-muted-foreground">
            Confirm your password to generate a QR code for your authenticator app.
          </p>
          <div className="space-y-1.5">
            <Label htmlFor="enable-password">Password</Label>
            <Input id="enable-password" type="password" autoComplete="current-password" {...enableForm.register("password")} />
            {enableForm.formState.errors.password ? (
              <p className="text-xs text-destructive">{enableForm.formState.errors.password.message}</p>
            ) : null}
          </div>
          <Button type="submit" disabled={busy}>
            {busy ? <Spinner className="mr-2 h-4 w-4" /> : <KeyRound className="mr-2 h-4 w-4" />}
            Enable two-factor authentication
          </Button>
        </form>
      )}
    </SettingsSection>
  );
}
