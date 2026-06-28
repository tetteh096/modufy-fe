"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { GlassPanel } from "@/components/layout/glass-pill";
import {
  CenteredMegaMenuPortal,
  MegaMenuBackdrop,
  useMegaMenuTrigger,
} from "@/components/layout/mega-menu-portal";
import { aboutNavLinks } from "@/lib/nav-content";
import { cn } from "@/lib/utils";

export function AboutMegaMenu({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <GlassPanel className="w-[min(calc(100vw-2rem),640px)] p-3">
      <div className="mb-2 px-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-leaf-green">About</p>
        <p className="text-sm text-muted-foreground">Learn about Modufy and book time with our team</p>
      </div>
      <div className="grid overflow-hidden rounded-[1.25rem] border border-white/70 bg-white/72 backdrop-blur-md sm:grid-cols-[1fr_200px]">
        <div className="bg-white/55 p-2 backdrop-blur-sm">
          {aboutNavLinks.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <div key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "group flex items-start gap-3 rounded-2xl px-4 py-4 transition-colors",
                    active ? "bg-secondary text-secondary-foreground" : "hover:bg-white/50"
                  )}
                >
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-brand-leaf-green">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-1 text-base font-semibold text-brand-sea-grey">
                      {item.label}
                      <ArrowRight className="h-4 w-4 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </span>
                    <span className="mt-1 block text-sm text-muted-foreground">{item.description}</span>
                  </span>
                </Link>
              </div>
            );
          })}
        </div>

        <div className="relative hidden min-h-[260px] overflow-hidden rounded-r-[1.1rem] sm:block">
          <Image src="/images/team/team1.png" alt="Modufy team" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-sea-grey/80 via-brand-sea-grey/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4 text-white">
            <p className="text-sm font-semibold">Built for growing teams</p>
            <Link
              href="/demo"
              onClick={onClose}
              className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-brand-tangerine"
            >
              Book a demo <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}

export function AboutNavTrigger({
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
      <div
        ref={ref}
        className="relative"
        onMouseEnter={open}
        onPointerLeave={handlePointerLeave}
      >
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
          About
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
        menuId="about"
        onHoverEnter={cancelClose}
        onHoverLeave={handleMenuPointerLeave}
      >
        <AboutMegaMenu onClose={close} />
      </CenteredMegaMenuPortal>
    </>
  );
}
