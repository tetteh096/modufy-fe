"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { GlassPanel } from "@/components/layout/glass-pill";
import {
  CenteredMegaMenuPortal,
  MegaMenuBackdrop,
  useMegaMenuTrigger,
} from "@/components/layout/mega-menu-portal";
import { moduleNavCategories } from "@/lib/nav-content";
import { cn } from "@/lib/utils";

export function ModulesMegaMenu({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const [activeId, setActiveId] = useState(moduleNavCategories[0].id);
  const activeCategory =
    moduleNavCategories.find((category) => category.id === activeId) ??
    moduleNavCategories[0];

  return (
    <GlassPanel className="w-[min(calc(100vw-2rem),960px)] p-4">
      <div className="mb-3 flex items-center justify-between gap-4 px-1">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-leaf-green">Modules</p>
          <p className="text-sm text-muted-foreground">Paid add-ons that plug into Modufy Core</p>
        </div>
        <Link
          href="/modules"
          onClick={onClose}
          className="text-sm font-semibold text-brand-leaf-green hover:text-brand-tangerine"
        >
          All modules →
        </Link>
      </div>
      <div className="grid overflow-hidden rounded-[1.25rem] border border-white/70 bg-white/72 backdrop-blur-md lg:grid-cols-[260px_minmax(0,1fr)_240px]">
        <div className="border-b border-white/50 bg-white/55 p-2 lg:border-b-0 lg:border-r">
          {moduleNavCategories.map((category) => {
            const Icon = category.icon;
            const isActive = category.id === activeId;
            return (
              <motion.button
                key={category.id}
                type="button"
                onMouseEnter={() => setActiveId(category.id)}
                onClick={() => setActiveId(category.id)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-2xl px-3 py-3.5 text-left transition-colors",
                  isActive ? "bg-secondary text-secondary-foreground" : "hover:bg-muted"
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                    isActive ? "bg-brand-leaf-green text-white" : "bg-accent text-brand-leaf-green"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-brand-sea-grey">{category.label}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                    {category.description}
                  </span>
                </span>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white/60 p-5 backdrop-blur-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {activeCategory.label}
            </p>
            <div className="mt-4 space-y-1">
              {activeCategory.modules.map((module) => {
                const moduleActive = pathname === module.href || pathname.startsWith(`${module.href}/`);
                return (
                  <div key={module.href}>
                    <Link
                      href={module.href}
                      onClick={onClose}
                      className={cn(
                        "group block rounded-2xl px-4 py-3.5 transition-colors",
                        moduleActive ? "bg-accent" : "hover:bg-muted"
                      )}
                    >
                      <span className="flex items-center gap-1 text-base font-medium text-brand-sea-grey">
                        {module.label}
                        <ArrowRight className="h-4 w-4 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                      </span>
                      <span className="mt-1 block text-sm text-muted-foreground">{module.description}</span>
                    </Link>
                  </div>
                );
              })}
            </div>
            <Link
              href={activeCategory.cta.href}
              onClick={onClose}
              className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-leaf-green transition hover:text-brand-tangerine"
            >
              {activeCategory.cta.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </AnimatePresence>

        <div className="relative hidden min-h-[340px] overflow-hidden rounded-r-[1.1rem] lg:block">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory.id}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <Image
                src={activeCategory.image}
                alt={activeCategory.imageAlt}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-sea-grey/85 via-brand-sea-grey/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <p className="text-base font-semibold leading-snug">{activeCategory.label}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-white/80">{activeCategory.description}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </GlassPanel>
  );
}

/** @deprecated use ModulesMegaMenu */
export const FeaturesMegaMenu = ModulesMegaMenu;

export function ModulesNavTrigger({
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
          Modules
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
        menuId="modules"
        onHoverEnter={cancelClose}
        onHoverLeave={handleMenuPointerLeave}
      >
        <ModulesMegaMenu onClose={close} />
      </CenteredMegaMenuPortal>
    </>
  );
}

/** @deprecated use ModulesNavTrigger */
export const FeaturesNavTrigger = ModulesNavTrigger;
