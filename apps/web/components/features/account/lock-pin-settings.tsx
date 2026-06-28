"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Check, Lock, Shield, Trash2, X } from "lucide-react";
import { PinInput } from "@/components/features/account/pin-input";
import { SettingsSection } from "@/components/features/settings/settings-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/shared/spinner";
import { hashPin, isValidPin, verifyPin, LOCK_PIN_LENGTH } from "@/lib/lock-pin";
import { useLockStore } from "@/store/lock";
import { cn } from "@/lib/utils";

function PinStep({
  step,
  title,
  description,
  children,
  footer,
}: {
  step: number;
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border/70 bg-muted/15 p-5 sm:p-6 space-y-4">
      <div className="flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary ring-1 ring-primary/20">
          {step}
        </span>
        <div className="min-w-0 space-y-1">
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
      <div className="pl-0 sm:pl-11">{children}</div>
      {footer ? <div className="pl-0 sm:pl-11 pt-1">{footer}</div> : null}
    </div>
  );
}

function MatchHint({ pin, confirm }: { pin: string; confirm: string }) {
  if (!pin && !confirm) {
    return (
      <p className="text-xs text-muted-foreground">
        Enter the same PIN in both fields ({LOCK_PIN_LENGTH.min}–{LOCK_PIN_LENGTH.max} digits).
      </p>
    );
  }
  if (confirm.length === 0) {
    return <p className="text-xs text-muted-foreground">Now re-enter your PIN to confirm.</p>;
  }
  if (pin === confirm && isValidPin(pin)) {
    return (
      <p className="text-xs font-medium text-primary inline-flex items-center gap-1.5">
        <Check className="h-3.5 w-3.5" />
        PINs match — ready to save
      </p>
    );
  }
  if (confirm.length >= LOCK_PIN_LENGTH.min && pin !== confirm) {
    return (
      <p className="text-xs font-medium text-destructive inline-flex items-center gap-1.5">
        <X className="h-3.5 w-3.5" />
        PINs do not match
      </p>
    );
  }
  return null;
}

export function LockPinSettings() {
  const pinHash = useLockStore((s) => s.pinHash);
  const setPinHash = useLockStore((s) => s.setPinHash);
  const hasPin = Boolean(pinHash);

  const [mode, setMode] = useState<"overview" | "set" | "change" | "remove">(
    hasPin ? "overview" : "set",
  );
  const [busy, setBusy] = useState(false);
  const [setPin, setSetPin] = useState("");
  const [setConfirm, setSetConfirm] = useState("");
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [newConfirm, setNewConfirm] = useState("");
  const [removePin, setRemovePin] = useState("");

  function resetDrafts() {
    setSetPin("");
    setSetConfirm("");
    setCurrentPin("");
    setNewPin("");
    setNewConfirm("");
    setRemovePin("");
    setMode(hasPin ? "overview" : "set");
  }

  async function saveNewPin() {
    if (!isValidPin(setPin)) {
      toast.error(`PIN must be ${LOCK_PIN_LENGTH.min}–${LOCK_PIN_LENGTH.max} digits`);
      return;
    }
    if (setPin !== setConfirm) {
      toast.error("PINs do not match");
      return;
    }

    setBusy(true);
    setPinHash(await hashPin(setPin));
    setBusy(false);
    toast.success("Lock screen PIN saved on this device");
    resetDrafts();
    setMode("overview");
  }

  async function updatePin() {
    if (!isValidPin(newPin)) {
      toast.error(`PIN must be ${LOCK_PIN_LENGTH.min}–${LOCK_PIN_LENGTH.max} digits`);
      return;
    }
    if (newPin !== newConfirm) {
      toast.error("PINs do not match");
      return;
    }

    setBusy(true);
    const ok = await verifyPin(currentPin, pinHash);
    if (!ok) {
      setBusy(false);
      toast.error("Current PIN is incorrect");
      return;
    }
    setPinHash(await hashPin(newPin));
    setBusy(false);
    toast.success("Lock screen PIN updated");
    resetDrafts();
  }

  async function removePinSetting() {
    if (!isValidPin(removePin)) {
      toast.error(`Enter your current ${LOCK_PIN_LENGTH.min}-digit PIN`);
      return;
    }

    setBusy(true);
    const ok = await verifyPin(removePin, pinHash);
    if (!ok) {
      setBusy(false);
      toast.error("Incorrect PIN");
      return;
    }
    setPinHash(null);
    setBusy(false);
    toast.success("Lock screen PIN removed");
    resetDrafts();
    setMode("set");
  }

  return (
    <SettingsSection
      icon={Lock}
      title="Lock screen & PIN"
      description="Lock Modufy when you step away. Optionally set a short PIN for quick unlock on this device."
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium">PIN status</span>
        <Badge variant={hasPin ? "default" : "secondary"}>
          {hasPin ? "PIN enabled" : "No PIN — password unlock only"}
        </Badge>
      </div>

      {mode === "overview" && hasPin ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            Your lock PIN is stored only in this browser. After locking, enter your PIN or use your
            account password to return.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" variant="outline" onClick={() => setMode("change")}>
              Change PIN
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => setMode("remove")}>
              <Trash2 className="mr-2 h-4 w-4" />
              Remove PIN
            </Button>
            <Button render={<Link href="/lock-screen" />} nativeButton={false} size="sm">
              Open lock screen
            </Button>
          </div>
        </div>
      ) : null}

      {mode === "set" ? (
        <div className="space-y-4">
          <PinStep
            step={1}
            title="Choose your PIN"
            description={`Pick ${LOCK_PIN_LENGTH.min}–${LOCK_PIN_LENGTH.max} digits you will remember. Each box is one digit.`}
          >
            <PinInput
              value={setPin}
              onChange={setSetPin}
              disabled={busy}
              autoFocus
            />
          </PinStep>

          <PinStep
            step={2}
            title="Confirm your PIN"
            description="Type the same PIN again so we know you entered it correctly."
            footer={<MatchHint pin={setPin} confirm={setConfirm} />}
          >
            <PinInput value={setConfirm} onChange={setSetConfirm} disabled={busy} />
          </PinStep>

          <div className="flex flex-wrap gap-2 pt-1">
            <Button
              type="button"
              disabled={busy || !isValidPin(setPin) || setPin !== setConfirm}
              onClick={saveNewPin}
            >
              {busy ? <Spinner className="mr-2 h-4 w-4" /> : null}
              Save lock PIN
            </Button>
            {hasPin ? (
              <Button type="button" variant="ghost" onClick={resetDrafts}>
                Cancel
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}

      {mode === "change" ? (
        <div className="space-y-4">
          <PinStep step={1} title="Current PIN" description="Enter the PIN you use to unlock today.">
            <PinInput value={currentPin} onChange={setCurrentPin} disabled={busy} autoFocus />
          </PinStep>
          <PinStep step={2} title="New PIN" description="Choose your new PIN.">
            <PinInput value={newPin} onChange={setNewPin} disabled={busy} />
          </PinStep>
          <PinStep
            step={3}
            title="Confirm new PIN"
            description="Re-enter the new PIN."
            footer={<MatchHint pin={newPin} confirm={newConfirm} />}
          >
            <PinInput value={newConfirm} onChange={setNewConfirm} disabled={busy} />
          </PinStep>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              disabled={busy || !isValidPin(newPin) || newPin !== newConfirm}
              onClick={updatePin}
            >
              {busy ? <Spinner className="mr-2 h-4 w-4" /> : null}
              Update PIN
            </Button>
            <Button type="button" variant="ghost" onClick={resetDrafts}>
              Cancel
            </Button>
          </div>
        </div>
      ) : null}

      {mode === "remove" ? (
        <div className="space-y-4">
          <PinStep
            step={1}
            title="Confirm removal"
            description="Enter your current PIN to remove it. You will unlock with your password instead."
          >
            <PinInput value={removePin} onChange={setRemovePin} disabled={busy} autoFocus />
          </PinStep>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="destructive" disabled={busy} onClick={removePinSetting}>
              {busy ? <Spinner className="mr-2 h-4 w-4" /> : null}
              Remove PIN
            </Button>
            <Button type="button" variant="ghost" onClick={resetDrafts}>
              Cancel
            </Button>
          </div>
        </div>
      ) : null}

      {!hasPin && mode === "set" ? (
        <div
          className={cn(
            "rounded-lg border border-dashed border-border/70 bg-muted/10 px-4 py-3",
            "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
          )}
        >
          <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 shrink-0 mt-0.5" />
            <span>
              After saving, use <strong className="text-foreground font-medium">Lock screen</strong>{" "}
              from the avatar menu when you step away.
            </span>
          </div>
          <Button render={<Link href="/lock-screen" />} nativeButton={false} variant="outline" size="sm">
            Preview lock screen
          </Button>
        </div>
      ) : null}
    </SettingsSection>
  );
}
