import { SidebarInset } from "@/components/ui/sidebar";
import { SettingsSidebar } from "@/components/layout/settings-sidebar";
import { LayoutShell } from "@/components/layout/layout-shell";
import { MainContentChrome } from "@/components/layout/main-content-chrome";
import { SettingsPageFrame } from "@/components/features/settings/settings-page-frame";
import { LockScreenGuard } from "@/components/features/auth/lock-screen-guard";

export default function SettingsRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutShell>
      <SettingsSidebar />
      <SidebarInset className="flex min-h-screen flex-col min-w-0">
        <MainContentChrome>
          <LockScreenGuard>
            <SettingsPageFrame>{children}</SettingsPageFrame>
          </LockScreenGuard>
        </MainContentChrome>
      </SidebarInset>
    </LayoutShell>
  );
}
