"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShieldCheck, LayoutGrid, Settings, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Businesses", href: "/admin/businesses", icon: LayoutGrid },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { clearAuth } = useAuthStore();
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut();
    clearAuth();
    router.push("/login");
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-56 shrink-0 border-r bg-card flex flex-col">
        <div className="flex items-center gap-2.5 p-4 border-b">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm">
            <ShieldCheck className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold tracking-tight">Modufy Admin</p>
            <p className="text-[10px] text-muted-foreground">Platform control</p>
          </div>
        </div>

        <nav className="flex-1 p-2 space-y-0.5">
          {nav.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                pathname.startsWith(href)
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-2 border-t">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="h-14 border-b flex items-center px-6 bg-background/95 backdrop-blur-sm sticky top-0 z-10">
          <ShieldCheck className="h-4 w-4 text-primary mr-2 shrink-0" />
          <span className="font-semibold text-sm">
            {nav.find((n) => pathname.startsWith(n.href))?.label ?? "Admin"}
          </span>
        </header>
        <div className="p-6 max-w-screen-xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
