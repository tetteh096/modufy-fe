"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { createPortal } from "react-dom";
import { ChevronRight, type LucideIcon } from "lucide-react";
import type { AppModuleNavConfig } from "@/lib/app-module-nav";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useUIStore } from "@/store/ui";
import { cn } from "@/lib/utils";

type ModuleCollapsibleSidebarNavProps = {
  config: AppModuleNavConfig;
};

const CLOSE_ANIM_MS = 220;
const FLYOUT_BRIDGE_PX = 12;
const FLYOUT_ROW_PX = 30;
const FLYOUT_HEADER_PX = 36;
const FLYOUT_LIST_PAD_PX = 8;
const FLYOUT_MAX_LIST_PX = 280;

function estimateFlyoutHeight(itemCount: number) {
  const listH = Math.min(itemCount * FLYOUT_ROW_PX + FLYOUT_LIST_PAD_PX, FLYOUT_MAX_LIST_PX);
  return FLYOUT_HEADER_PX + listH;
}

function getFlyoutPosition(anchorEl: HTMLElement, iconStrip: boolean, itemCount: number) {
  const rect = anchorEl.getBoundingClientRect();
  const flyoutH = estimateFlyoutHeight(itemCount);
  const viewportPad = 8;
  const maxTop = Math.max(viewportPad, window.innerHeight - flyoutH - viewportPad);
  const top = Math.min(Math.max(viewportPad, rect.top), maxTop);

  if (iconStrip) {
    const gap = document.querySelector('[data-slot="sidebar-gap"]');
    const gapRect = gap?.getBoundingClientRect();
    return {
      top,
      left: (gapRect?.right ?? rect.right) - FLYOUT_BRIDGE_PX,
    };
  }
  return {
    top,
    left: rect.right + 4,
  };
}

function ModuleFlyoutPanel({
  config,
  Icon,
  iconStrip,
  visible,
  closing,
  pos,
  inModule,
  onClose,
}: {
  config: AppModuleNavConfig;
  Icon: LucideIcon;
  iconStrip: boolean;
  visible: boolean;
  closing: boolean;
  pos: { top: number; left: number };
  inModule: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted || !visible) return null;

  return createPortal(
    <div
      className={cn(
        "sidebar-module-flyout pointer-events-auto fixed z-50 overflow-visible border bg-card text-card-foreground",
        iconStrip ? "sidebar-module-flyout--strip" : "sidebar-module-flyout--floating",
        closing && "is-closing",
      )}
      style={{ top: pos.top, left: pos.left }}
      role="menu"
      aria-label={`${config.label} submenu`}
    >
      <div className="sidebar-module-flyout-inner overflow-hidden">
        <Link
          href={config.href}
          onClick={onClose}
          className={cn(
            "sidebar-module-flyout-header flex items-center gap-2 border-b border-border/60 px-2.5 py-2 text-[0.8125rem] font-medium transition-colors hover:bg-muted/50",
            inModule && "bg-primary/10 text-primary",
          )}
        >
          <Icon className="sidebar-module-flyout-icon shrink-0 text-muted-foreground" />
          <span className="min-w-0 flex-1 truncate">{config.label}</span>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 rotate-90 text-muted-foreground/60" />
        </Link>

        <ul className="sidebar-module-flyout-list flex flex-col gap-px p-1">
          {config.subNav.map((item) => {
            const active = item.isActive(pathname, searchParams);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  role="menuitem"
                  onClick={onClose}
                  className={cn(
                    "sidebar-module-flyout-link flex items-center rounded-md px-2.5 py-1.5 text-[0.8125rem] leading-tight transition-colors hover:bg-muted/70",
                    active && "bg-primary/10 font-medium text-primary",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>,
    document.body,
  );
}

/** Mobile — compact inline accordion. */
function ModuleSidebarMobileItem({ config }: ModuleCollapsibleSidebarNavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const Icon = config.icon;
  const inModule = config.isInModule(pathname);
  const [open, setOpen] = useState(inModule);

  useEffect(() => {
    if (inModule) setOpen(true);
  }, [inModule]);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        render={<Link href={config.href} />}
        isActive={inModule}
        tooltip={config.label}
        className={cn(
          "rounded-lg",
          inModule &&
            "bg-sidebar-accent font-medium text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        )}
      >
        <Icon className="sidebar-nav-icon shrink-0" />
        <span className="truncate">{config.label}</span>
      </SidebarMenuButton>
      <SidebarMenuAction
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        aria-expanded={open}
        aria-label={open ? `Collapse ${config.label}` : `Expand ${config.label}`}
      >
        <ChevronRight className={cn("h-3.5 w-3.5 transition-transform duration-200", open && "rotate-90")} />
      </SidebarMenuAction>
      {open ? (
        <SidebarMenuSub className="sidebar-module-inline-sub">
          {config.subNav.map((item) => (
            <SidebarMenuSubItem key={item.href}>
              <SidebarMenuSubButton
                render={<Link href={item.href} />}
                isActive={item.isActive(pathname, searchParams)}
                size="sm"
                className="sidebar-module-inline-sub-btn"
              >
                <span>{item.label}</span>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      ) : null}
    </SidebarMenuItem>
  );
}

function ModuleSidebarFlyoutItem({ config }: ModuleCollapsibleSidebarNavProps) {
  const pathname = usePathname();
  const Icon = config.icon;
  const inModule = config.isInModule(pathname);
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const sidebarSize = useUIStore((s) => s.sidebarSize);
  const [hoverInStrip, setHoverInStrip] = useState(true);

  useEffect(() => {
    if (sidebarSize !== "hover") {
      setHoverInStrip(true);
      return;
    }
    const sidebar = document.querySelector('[data-slot="sidebar"]');
    if (!sidebar) return;

    function readStrip() {
      setHoverInStrip(sidebar!.getAttribute("data-sidebar-strip") !== "false");
    }

    readStrip();
    const observer = new MutationObserver(readStrip);
    observer.observe(sidebar, {
      attributes: true,
      attributeFilter: ["data-sidebar-strip"],
    });
    return () => observer.disconnect();
  }, [sidebarSize]);

  const isIconStrip =
    isCollapsed &&
    (sidebarSize === "default" ||
      sidebarSize === "compact" ||
      sidebarSize === "condensed" ||
      (sidebarSize === "hover" && hoverInStrip));

  const anchorRef = useRef<HTMLLIElement>(null);
  const [open, setOpen] = useState(false);
  const [flyoutVisible, setFlyoutVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const updatePosition = useCallback(() => {
    const el = anchorRef.current;
    if (!el) return;
    setPos(getFlyoutPosition(el, isIconStrip, config.subNav.length));
  }, [isIconStrip, config.subNav.length]);

  const handleClose = useCallback(() => {
    setClosing(true);
    window.setTimeout(() => {
      setFlyoutVisible(false);
      setOpen(false);
      setClosing(false);
    }, CLOSE_ANIM_MS);
  }, []);

  const toggleOpen = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (open) {
        handleClose();
        return;
      }
      updatePosition();
      setOpen(true);
      setFlyoutVisible(true);
      setClosing(false);
    },
    [open, handleClose, updatePosition],
  );

  useEffect(() => {
    if (!flyoutVisible) return;
    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [flyoutVisible, updatePosition]);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: globalThis.MouseEvent) {
      const el = anchorRef.current;
      if (!el?.contains(e.target as Node)) {
        const flyouts = document.querySelectorAll(".sidebar-module-flyout");
        for (const flyout of flyouts) {
          if (flyout.contains(e.target as Node)) return;
        }
        handleClose();
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open, handleClose]);

  return (
    <>
      <SidebarMenuItem
        ref={anchorRef}
        className="relative"
        data-flyout-open={open ? "true" : undefined}
      >
        <SidebarMenuButton
          render={isIconStrip ? undefined : <Link href={config.href} />}
          onClick={isIconStrip ? toggleOpen : undefined}
          isActive={inModule}
          tooltip={isIconStrip ? config.label : undefined}
          className={cn(
            "rounded-lg transition-colors duration-150",
            !inModule && !open && "text-sidebar-foreground/75 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground",
            inModule &&
              !open &&
              "bg-sidebar-accent font-medium text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
            open && "bg-sidebar-accent/60 text-sidebar-accent-foreground",
          )}
        >
          <Icon className="sidebar-nav-icon shrink-0" />
          <span className="truncate group-data-[collapsible=icon]:hidden">{config.label}</span>
        </SidebarMenuButton>

        <SidebarMenuAction
          onClick={toggleOpen}
          aria-expanded={open}
          aria-label={open ? `Close ${config.label} menu` : `Open ${config.label} menu`}
          className={cn(
            "sidebar-module-chevron",
            "group-data-[collapsible=icon]:flex!",
            open && "text-sidebar-accent-foreground opacity-100",
          )}
        >
          <ChevronRight
            className={cn("h-3.5 w-3.5 transition-transform duration-200", open && "rotate-90")}
          />
        </SidebarMenuAction>
      </SidebarMenuItem>

      <ModuleFlyoutPanel
        config={config}
        Icon={Icon}
        iconStrip={isIconStrip}
        visible={flyoutVisible}
        closing={closing}
        pos={pos}
        inModule={inModule}
        onClose={handleClose}
      />
    </>
  );
}

export function ModuleCollapsibleSidebarNav({ config }: ModuleCollapsibleSidebarNavProps) {
  const { isMobile } = useSidebar();

  if (isMobile) {
    return <ModuleSidebarMobileItem config={config} />;
  }

  return <ModuleSidebarFlyoutItem config={config} />;
}
