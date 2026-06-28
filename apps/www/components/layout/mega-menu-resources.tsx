"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { GlassPanel } from "@/components/layout/glass-pill";
import {
  CenteredMegaMenuPortal,
  MegaMenuBackdrop,
  useMegaMenuTrigger,
} from "@/components/layout/mega-menu-portal";
import { resourcesNavLinks } from "@/lib/nav-content";
import { homeImages } from "@/lib/home-images";
import { cn } from "@/lib/utils";

export function ResourcesMegaMenu({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <GlassPanel className="w-[min(calc(100vw-2rem),720px)] p-3">
      <div className="mb-2 px-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-leaf-green">Resources</p>
        <p className="text-sm text-muted-foreground">Docs, guides, and help to get the most from Modufy</p>
      </div>
      <div className="grid overflow-hidden rounded-[1.25rem] border border-white/70 bg-white/72 backdrop-blur-md sm:grid-cols-[1fr_200px]">
        <div className="grid gap-1 bg-white/55 p-2 backdrop-blur-sm sm:grid-cols-2">
          {resourcesNavLinks.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "group flex items-start gap-3 rounded-2xl px-3 py-3.5 transition-colors",
                  active ? "bg-secondary text-secondary-foreground" : "hover:bg-white/50"
                )}
              >
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-brand-leaf-green">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-1 text-sm font-semibold text-brand-sea-grey">
                    {item.label}
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                    {item.description}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>

        <div className="relative hidden min-h-[280px] overflow-hidden rounded-r-[1.1rem] sm:block">
          <Image
            src={homeImages.story.pipeline}
            alt="Modufy documentation preview"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-sea-grey/85 via-brand-sea-grey/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4 text-white">
            <p className="text-sm font-semibold">New to Modufy?</p>
            <Link
              href="/docs"
              onClick={onClose}
              className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-brand-tangerine"
            >
              Read the quickstart <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}

export function ResourcesNavTrigger({
  active,
  menuOpen,
  onMenuChange,
  className,
  light,
}: {
  active?: boolean;
  menuOpen?: boolean;
  onMenuChange?: (open: boolean) => void;
  className?: string;
  light?: boolean;
}) {
  const {
    ref,
    isOpen,
    open,
    close,
    toggle,
    handlePointerLeave,
    handleMenuPointerLeave,
    cancelClose,
  } = useMegaMenuTrigger({ menuOpen, onMenuChange });

  return (
    <>
      <MegaMenuBackdrop open={isOpen} onClose={close} />
      <div ref={ref} className="relative" onMouseEnter={open} onPointerLeave={handlePointerLeave}>
        <button
          type="button"
          aria-expanded={isOpen}
          onClick={toggle}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[15px] font-medium transition-colors",
            light
              ? active || isOpen
                ? "bg-white/20 text-white"
                : "text-white/90 hover:bg-white/10 hover:text-white"
              : active || isOpen
                ? "bg-secondary text-secondary-foreground"
                : "text-brand-sea-grey hover:bg-muted hover:text-brand-sea-grey",
            className
          )}
        >
          Resources
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
              isOpen && "rotate-180"
            )}
          />
        </button>
      </div>

      <CenteredMegaMenuPortal
        open={isOpen}
        menuId="resources"
        onHoverEnter={cancelClose}
        onHoverLeave={handleMenuPointerLeave}
      >
        <ResourcesMegaMenu onClose={close} />
      </CenteredMegaMenuPortal>
    </>
  );
}
