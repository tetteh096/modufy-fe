import { SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { LayoutShell } from "@/components/layout/layout-shell";
import { MainContentChrome } from "@/components/layout/main-content-chrome";
import { LockScreenGuard } from "@/components/features/auth/lock-screen-guard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutShell>
      <AppSidebar />
      <SidebarInset className="flex min-h-screen flex-col min-w-0">
        <MainContentChrome>
          <LockScreenGuard>{children}</LockScreenGuard>
        </MainContentChrome>
      </SidebarInset>
    </LayoutShell>
  );
}
