import { TopBar } from "@/components/layout/top-bar";
import { SupportSessionBanner } from "@/components/features/support/support-session-banner";

/**
 * Shared shell: main TopBar + one scrollable content area.
 * Used by the dashboard (with AppSidebar) and by settings (own sidebar only).
 */
export function MainContentChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <SupportSessionBanner />
      <TopBar />
      <main className="dashboard-canvas flex-1 overflow-y-auto w-full">
        <div className="mx-auto w-full max-w-7xl xl:max-w-[90rem] px-4 py-4 md:px-5 md:py-5 lg:px-6">
          {children}
        </div>
      </main>
    </div>
  );
}
