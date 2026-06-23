import { PosModuleGate } from "@/components/features/pos/pos-module-gate";
import { PosIdleLock } from "@/components/features/pos/pos-idle-lock";
import { LockScreenGuard } from "@/components/features/auth/lock-screen-guard";

export default function PosLayout({ children }: { children: React.ReactNode }) {
  return (
    <LockScreenGuard>
      <PosIdleLock />
      <PosModuleGate>{children}</PosModuleGate>
    </LockScreenGuard>
  );
}
