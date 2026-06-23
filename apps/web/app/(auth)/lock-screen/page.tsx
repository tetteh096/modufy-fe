"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/shared/spinner";
import { AuthPasswordField } from "@/components/features/auth/auth-form-fields";
import { AuthPageShell } from "@/components/features/auth/auth-page-shell";
import { PinInput } from "@/components/features/account/pin-input";
import { authClient } from "@/lib/auth-client";
import { isValidPin, verifyPin, LOCK_PIN_LENGTH } from "@/lib/lock-pin";
import { useAuthStore } from "@/store/auth";
import { useLockStore } from "@/store/lock";

const schema = z.object({
  password: z.string().min(1, "Enter your password"),
});

type FormValues = z.infer<typeof schema>;

export default function LockScreenPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const pinHash = useLockStore((s) => s.pinHash);
  const unlock = useLockStore((s) => s.unlock);
  const returnPath = useLockStore((s) => s.returnPath);
  const hasPin = Boolean(pinHash);
  const [mode, setMode] = useState<"pin" | "password">(hasPin ? "pin" : "password");
  const [pin, setPin] = useState("");
  const [pinBusy, setPinBusy] = useState(false);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function unlockWithPin() {
    if (!isValidPin(pin)) {
      toast.error(`Enter your ${LOCK_PIN_LENGTH.min}-digit PIN`);
      return;
    }

    setPinBusy(true);
    const ok = await verifyPin(pin, pinHash);
    setPinBusy(false);

    if (!ok) {
      toast.error("Incorrect PIN");
      return;
    }

    unlock();
    toast.success("Welcome back");
    router.push(returnPath || "/dashboard");
  }

  async function onSubmit(data: FormValues) {
    if (!user?.email) {
      router.push("/login");
      return;
    }

    const { error } = await authClient.signIn.email({
      email: user.email,
      password: data.password,
    });

    if (error) {
      setError("root", { message: "Incorrect password" });
      toast.error("Incorrect password");
      return;
    }

    unlock();
    toast.success("Welcome back");
    router.push(returnPath || "/dashboard");
  }

  return (
    <AuthPageShell
      title="Lock screen"
      description={
        mode === "pin" && hasPin
          ? "Enter your lock PIN to continue."
          : "Enter your password to unlock."
      }
      footer={
        <p>
          Not you?{" "}
          <Link href="/logout" className="auth-link">
            Sign out
          </Link>
        </p>
      }
    >
      <div className="mb-2 flex flex-col items-center gap-3">
        <div className="auth-avatar" aria-hidden>
          {initials}
        </div>
        {user ? (
          <div className="text-center">
            <p className="font-semibold text-[var(--auth-ink)]">{user.name}</p>
            <p className="text-xs auth-text-muted">{user.email}</p>
          </div>
        ) : (
          <p className="auth-text-muted">Sign in to use lock screen</p>
        )}
      </div>

      {user ? (
        mode === "pin" && hasPin ? (
          <div className="space-y-5">
            <PinInput
              value={pin}
              onChange={setPin}
              disabled={pinBusy}
              autoFocus
              className="justify-center"
            />
            <button
              type="button"
              className="auth-btn-primary"
              disabled={pinBusy}
              onClick={unlockWithPin}
            >
              {pinBusy ? (
                <span className="inline-flex items-center gap-2">
                  <Spinner size="sm" className="text-white" />
                  Unlocking…
                </span>
              ) : (
                "Unlock"
              )}
            </button>
            <button
              type="button"
              className="auth-btn-ghost w-full"
              onClick={() => {
                setPin("");
                setMode("password");
              }}
            >
              Use password instead
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <AuthPasswordField
              id="password"
              label="Password"
              error={errors.password?.message ?? errors.root?.message}
              registration={{
                ...register("password"),
                autoComplete: "current-password",
                placeholder: "Enter your password",
              }}
            />
            <button type="submit" className="auth-btn-primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <Spinner size="sm" className="text-white" />
                  Unlocking…
                </span>
              ) : (
                "Unlock"
              )}
            </button>
            {hasPin ? (
              <button
                type="button"
                className="auth-btn-ghost w-full"
                onClick={() => setMode("pin")}
              >
                Use lock PIN instead
              </button>
            ) : null}
          </form>
        )
      ) : (
        <Link href="/login" className="auth-btn-primary">
          Sign in
        </Link>
      )}
    </AuthPageShell>
  );
}
