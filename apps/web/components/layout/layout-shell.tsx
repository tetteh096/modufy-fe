"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { LayoutSettingsController } from "@/components/layout/layout-settings-controller";
import { ThemeSettingsSheet } from "@/components/layout/theme-settings-sheet";
import { AuthGate } from "@/components/features/auth/auth-gate";
import { useUIStore } from "@/store/ui";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <LayoutSettingsController />
      <ThemeSettingsSheet />
      <AuthGate>{children}</AuthGate>
    </SidebarProvider>
  );
}
