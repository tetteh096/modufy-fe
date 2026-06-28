"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { isNavGroup, type NavItem } from "@/lib/nav-types";
import { isExternalNav, resolveNavHref } from "@/lib/site-config";
import { cn } from "@/lib/utils";

function isItemActive(item: NavItem, pathname: string): boolean {
  if (isNavGroup(item)) {
    return item.children.some((child) => isItemActive(child, pathname));
  }
  const href = resolveNavHref(item);
  if (href === "/" || href === "#") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLeaf({
  item,
  className,
  onNavigate,
  active,
}: {
  item: NavItem;
  className?: string;
  onNavigate?: () => void;
  active?: boolean;
}) {
  if (isNavGroup(item)) return null;
  const href = resolveNavHref(item);
  const external = isExternalNav(item);
  const classes = cn(
    "block rounded-lg px-3 py-2 text-sm transition-colors",
    active
      ? "bg-secondary font-medium text-secondary-foreground"
      : "text-muted-foreground hover:bg-muted hover:text-foreground",
    className
  );

  if (external) {
    return (
      <a href={href} className={classes} onClick={onNavigate}>
        {item.label}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} onClick={onNavigate}>
      {item.label}
    </Link>
  );
}

function DesktopFlyout({
  items,
  pathname,
  depth = 0,
  onNavigate,
}: {
  items: NavItem[];
  pathname: string;
  depth?: number;
  onNavigate?: () => void;
}) {
  return (
    <div
      className={cn(
        "min-w-48 rounded-2xl border border-border bg-card p-2 shadow-xl shadow-black/5",
        depth > 0 && "absolute left-full top-0 ml-1.5"
      )}
    >
      {items.map((item) =>
        isNavGroup(item) ? (
          <div key={item.label} className="group/nested relative">
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <span>{item.label}</span>
              <ChevronRight className="h-4 w-4 opacity-60" />
            </button>
            <div className="invisible absolute left-full top-0 z-50 ml-1 min-w-48 opacity-0 transition-all group-hover/nested:visible group-hover/nested:opacity-100">
              <DesktopFlyout items={item.children} pathname={pathname} depth={depth + 1} onNavigate={onNavigate} />
            </div>
          </div>
        ) : (
          <NavLeaf
            key={item.label + (item.href ?? item.appHref)}
            item={item}
            active={isItemActive(item, pathname)}
            onNavigate={onNavigate}
          />
        )
      )}
    </div>
  );
}

export function DesktopNavDropdown({
  label,
  items,
  active,
}: {
  label: string;
  items: NavItem[];
  active?: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
          active || open
            ? "bg-secondary text-secondary-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        {label}
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>
      <div
        className={cn(
          "absolute left-0 top-full z-50 pt-2 transition-all duration-200",
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0 pointer-events-none"
        )}
      >
        <DesktopFlyout items={items} pathname={pathname} onNavigate={() => setOpen(false)} />
      </div>
    </div>
  );
}

export function MobileNavSection({
  label,
  items,
  onNavigate,
  pathname,
  depth = 0,
}: {
  label: string;
  items: NavItem[];
  onNavigate: () => void;
  pathname: string;
  depth?: number;
}) {
  const [expanded, setExpanded] = useState(depth === 0);

  return (
    <div className={cn(depth > 0 && "ml-2 border-l border-border pl-3")}>
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className={cn(
          "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left",
          depth === 0 ? "text-xs font-semibold uppercase tracking-wider text-muted-foreground" : "text-sm font-medium"
        )}
      >
        {label}
        {depth === 0 ? (
          <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} />
        ) : null}
      </button>
      {expanded ? (
        <div className="pb-1">
          {items.map((item) =>
            isNavGroup(item) ? (
              <MobileNavSection
                key={item.label}
                label={item.label}
                items={item.children}
                onNavigate={onNavigate}
                pathname={pathname}
                depth={depth + 1}
              />
            ) : (
              <NavLeaf
                key={item.label + (item.href ?? item.appHref)}
                item={item}
                active={isItemActive(item, pathname)}
                className="py-2.5 font-medium"
                onNavigate={onNavigate}
              />
            )
          )}
        </div>
      ) : null}
    </div>
  );
}

export function NavLink({
  href,
  label,
  active,
  onNavigate,
  className,
}: {
  href: string;
  label: string;
  active?: boolean;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-secondary text-secondary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        className
      )}
    >
      {label}
    </Link>
  );
}

export function isNavItemActive(item: NavItem | { href: string }, pathname: string): boolean {
  if ("children" in item && item.children) {
    return item.children.some((child) => isItemActive(child, pathname));
  }
  if (!("href" in item) || !item.href || item.href === "#") return false;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
