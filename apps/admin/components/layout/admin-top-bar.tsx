"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import {
  Bell,
  Building2,
  ChevronRight,
  Loader2,
  Moon,
  Search,
  Sun,
  X,
} from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminUserMenu } from "@/components/layout/admin-user-menu";

const nav = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Account", href: "/account" },
  { label: "Businesses", href: "/businesses" },
  { label: "Tickets", href: "/tickets" },
  { label: "Demos", href: "/demos" },
  { label: "Audit", href: "/audit" },
  { label: "Notifications", href: "/notifications" },
  { label: "Team", href: "/admins" },
  { label: "Settings", href: "/settings" },
];

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-muted-foreground hover:text-foreground"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}

export function AdminTopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const debouncedQuery = useDebouncedValue(query.trim(), 280);

  const currentPage = nav.find((n) => pathname.startsWith(n.href))?.label ?? "Admin";

  const { data, isFetching } = useQuery({
    queryKey: ["admin-topbar-search", debouncedQuery],
    queryFn: () => adminApi.businesses({ search: debouncedQuery }),
    enabled: debouncedQuery.length >= 2,
  });

  const businesses = data?.businesses?.slice(0, 6) ?? [];

  const closeSearch = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (e.key === "Escape") closeSearch();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeSearch]);

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  function goToBusiness(id: string) {
    closeSearch();
    router.push(`/businesses/${id}`);
  }

  function submitSearch() {
    const q = query.trim();
    if (!q) return;
    closeSearch();
    router.push(`/businesses?search=${encodeURIComponent(q)}`);
  }

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 sm:px-6">
      {/* Breadcrumb */}
      <div className="hidden min-w-0 shrink-0 items-center gap-1.5 text-sm sm:flex">
        <span className="text-muted-foreground">Modufy Admin</span>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
        <span className="truncate font-medium">{currentPage}</span>
      </div>

      {/* Search */}
      <div ref={searchRef} className="relative mx-auto w-full max-w-lg flex-1">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="search"
            placeholder="Search businesses, owners, slugs…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submitSearch();
            }}
            className="h-9 w-full bg-muted/40 pl-9 pr-20 focus-visible:bg-background"
          />
          <div className="pointer-events-none absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
            {query && (
              <button
                type="button"
                className="pointer-events-auto rounded p-0.5 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            <kbd className="hidden rounded border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline">
              ⌘K
            </kbd>
          </div>
        </div>

        {open && (query.length > 0 || debouncedQuery.length >= 2) && (
          <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-xl border bg-popover shadow-lg">
            {debouncedQuery.length < 2 ? (
              <p className="px-4 py-3 text-xs text-muted-foreground">Type at least 2 characters to search…</p>
            ) : isFetching ? (
              <div className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Searching…
              </div>
            ) : businesses.length === 0 ? (
              <div className="px-4 py-3">
                <p className="text-sm text-muted-foreground">No businesses found for &ldquo;{debouncedQuery}&rdquo;</p>
                <button
                  type="button"
                  className="mt-2 text-xs font-medium text-primary hover:underline"
                  onClick={submitSearch}
                >
                  View all businesses
                </button>
              </div>
            ) : (
              <>
                <div className="border-b px-3 py-2">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    Businesses
                  </p>
                </div>
                <ul className="max-h-72 overflow-y-auto py-1">
                  {businesses.map((biz) => (
                    <li key={biz.id}>
                      <button
                        type="button"
                        className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted/60"
                        onClick={() => goToBusiness(biz.id)}
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                          {biz.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">{biz.name}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {biz.owner_email} · {biz.country}
                          </p>
                        </div>
                        {biz.suspended && (
                          <span className="shrink-0 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive">
                            Suspended
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="border-t px-3 py-2">
                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium text-primary hover:bg-primary/5"
                    onClick={submitSearch}
                  >
                    <Building2 className="h-3.5 w-3.5" />
                    See all results for &ldquo;{debouncedQuery}&rdquo;
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          render={<Link href="/notifications" />}
        >
          <Bell className="h-4 w-4" />
          <span className="sr-only">Notifications</span>
        </Button>
        <ThemeToggle />
        <AdminUserMenu />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground sm:hidden"
          onClick={() => {
            inputRef.current?.focus();
            setOpen(true);
          }}
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
