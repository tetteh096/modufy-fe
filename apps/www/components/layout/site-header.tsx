"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Menu, X } from "lucide-react";
import { ModufyLogo } from "@/components/brand/modufy-logo";
import { GlassPill } from "@/components/layout/glass-pill";
import { AboutNavTrigger } from "@/components/layout/mega-menu-about";
import { ModulesNavTrigger } from "@/components/layout/mega-menu-features";
import { ResourcesNavTrigger } from "@/components/layout/mega-menu-resources";
import { Button } from "@/components/ui/button";
import {
  aboutNavLinks,
  moduleNavCategories,
  mainNavLinks,
  resourcesNavLinks,
} from "@/lib/nav-content";
import { appPath } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { useScrolledPastHero } from "@/hooks/use-scrolled-past-hero";

function NavTextLink({
  href,
  label,
  active,
  onNavigate,
  light,
}: {
  href: string;
  label: string;
  active?: boolean;
  onNavigate?: () => void;
  light?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "rounded-full px-4 py-2.5 text-[15px] font-medium transition-colors duration-300",
        light
          ? active
            ? "bg-white/20 text-white"
            : "text-white/90 hover:bg-white/10 hover:text-white"
          : active
            ? "bg-secondary text-secondary-foreground"
            : "text-brand-sea-grey hover:bg-muted hover:text-brand-sea-grey"
      )}
    >
      {label}
    </Link>
  );
}

function MobileAccordion({
  label,
  children,
  defaultOpen = false,
}: {
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border border-border bg-white/70">
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="flex w-full items-center justify-between px-4 py-3.5 text-[15px] font-semibold text-brand-sea-grey"
      >
        {label}
        <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="space-y-1 border-t border-border px-2 pb-3 pt-2">{children}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<"modules" | "about" | "resources" | null>(null);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
    setActiveMenu(null);
  }, [pathname]);

  const closeMobile = () => setMobileOpen(false);

  const modulesActive =
    pathname.startsWith("/modules") ||
    moduleNavCategories.some((category) =>
      category.modules.some((module) => pathname.startsWith(module.href))
    );

  const aboutActive =
    pathname.startsWith("/about") || pathname.startsWith("/why-us") || pathname.startsWith("/demo");

  const resourcesActive = resourcesNavLinks.some(
    (item) =>
      pathname === item.href ||
      pathname.startsWith(`${item.href}/`) ||
      (item.href.includes("#") && pathname === item.href.split("#")[0])
  );

  const isHome = pathname === "/";
  const scrolledPastHero = useScrolledPastHero(isHome);
  const heroNav = isHome && !scrolledPastHero;

  return (
    <header data-site-header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <GlassPill
        className={cn(
          "mx-auto max-w-7xl overflow-visible rounded-[2rem] px-3 py-2 sm:px-4 sm:py-2.5",
          heroNav
            ? "border-white/25 bg-white/12 text-white shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
            : "border-white/90 bg-white/92 shadow-[0_8px_40px_rgba(54,54,54,0.14)]"
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <ModufyLogo size="md" light={heroNav} />

          <nav className="hidden items-center justify-center gap-0.5 lg:flex">
            <NavTextLink href="/" label="Home" active={isHome} light={heroNav} />
            <ModulesNavTrigger
              active={modulesActive}
              menuOpen={activeMenu === "modules"}
              onMenuChange={(open) => setActiveMenu(open ? "modules" : null)}
              light={heroNav}
            />
            <AboutNavTrigger
              active={aboutActive}
              menuOpen={activeMenu === "about"}
              onMenuChange={(open) => setActiveMenu(open ? "about" : null)}
              light={heroNav}
            />
            <ResourcesNavTrigger
              active={resourcesActive}
              menuOpen={activeMenu === "resources"}
              onMenuChange={(open) => setActiveMenu(open ? "resources" : null)}
              light={heroNav}
            />
            {mainNavLinks
              .filter((item) => item.href !== "/")
              .map((item) => (
                <NavTextLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  active={pathname === item.href || pathname.startsWith(`${item.href}/`)}
                  light={heroNav}
                />
              ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Button
              href={appPath("/login")}
              variant="ghost"
              size="sm"
              external
              className={heroNav ? "text-white hover:bg-white/10" : undefined}
            >
              Login
            </Button>
            <Button href={appPath("/register")} size="md" external>
              Get Started
            </Button>
          </div>

          <button
            type="button"
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center rounded-full lg:hidden",
              heroNav ? "text-white hover:bg-white/10" : "text-brand-sea-grey hover:bg-muted"
            )}
            onClick={() => setMobileOpen((value) => !value)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </GlassPill>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="mx-auto mt-3 max-h-[calc(100vh-6rem)] max-w-7xl overflow-y-auto lg:hidden"
          >
            <GlassPill className="rounded-3xl p-4">
              <nav className="space-y-2">
                <NavTextLink href="/" label="Home" active={isHome} onNavigate={closeMobile} />

                <MobileAccordion label="Modules">
                  {moduleNavCategories.map((category) => (
                    <div key={category.id} className="rounded-xl bg-muted/40 p-2">
                      <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-brand-leaf-green">
                        {category.label}
                      </p>
                      {category.modules.map((module) => (
                        <Link
                          key={module.href}
                          href={module.href}
                          onClick={closeMobile}
                          className="block rounded-xl px-3 py-2.5 text-sm hover:bg-white/80"
                        >
                          <span className="font-medium">{module.label}</span>
                          <span className="mt-0.5 block text-xs text-muted-foreground">{module.description}</span>
                        </Link>
                      ))}
                    </div>
                  ))}
                  <Link
                    href="/modules"
                    onClick={closeMobile}
                    className="block rounded-xl px-3 py-2 text-sm font-semibold text-brand-leaf-green"
                  >
                    View all modules
                  </Link>
                </MobileAccordion>

                <MobileAccordion label="About">
                  {aboutNavLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMobile}
                      className="block rounded-xl px-3 py-2.5 text-sm hover:bg-muted/70"
                    >
                      <span className="font-medium">{item.label}</span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">{item.description}</span>
                    </Link>
                  ))}
                </MobileAccordion>

                <MobileAccordion label="Resources">
                  {resourcesNavLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMobile}
                      className="block rounded-xl px-3 py-2.5 text-sm hover:bg-muted/70"
                    >
                      <span className="font-medium">{item.label}</span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">{item.description}</span>
                    </Link>
                  ))}
                </MobileAccordion>

                {mainNavLinks
                  .filter((item) => item.href !== "/")
                  .map((item) => (
                    <NavTextLink
                      key={item.href}
                      href={item.href}
                      label={item.label}
                      active={pathname === item.href}
                      onNavigate={closeMobile}
                    />
                  ))}
              </nav>

              <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
                <Button href={appPath("/login")} variant="outline" external className="w-full">
                  Login
                </Button>
                <Button href="/demo" variant="secondary" className="w-full">
                  Book a demo
                </Button>
                <Button href={appPath("/register")} external className="w-full">
                  Get Started
                </Button>
              </div>
            </GlassPill>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
