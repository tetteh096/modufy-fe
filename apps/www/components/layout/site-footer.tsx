import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ModufyLogo } from "@/components/brand/modufy-logo";
import { FooterNewsletter } from "@/components/layout/footer-newsletter";
import { Button } from "@/components/ui/button";
import { appPath, siteConfig } from "@/lib/site-config";

const socialLinks = [
  { href: siteConfig.social.linkedin, label: "LinkedIn" },
  { href: siteConfig.social.github, label: "GitHub" },
  { href: siteConfig.social.twitter, label: "X" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0c0c0c] text-white">
      <div className="border-b border-white/10">
        <div className="container-site flex flex-col items-start justify-between gap-6 py-12 md:flex-row md:items-center md:py-14">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-tangerine">
              Ready to grow?
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Start building with Modufy today
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/60">
              Free to start. Add modules as you scale — sales, inventory, POS, and more.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href={appPath("/register")} size="lg" external>
              Get started free
            </Button>
            <Button
              href="/demo"
              variant="outline"
              size="lg"
              className="border-white/20 bg-transparent text-white hover:border-white/40 hover:bg-white/10 hover:text-white"
            >
              Book a demo
            </Button>
          </div>
        </div>
      </div>

      <div className="container-site py-14 md:py-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <ModufyLogo size="md" light />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/55">
              {siteConfig.footerTagline}
            </p>
            <FooterNewsletter variant="dark" />
          </div>

          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-7">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/40">
                Product
              </p>
              <ul className="mt-4 space-y-3 text-sm">
                {siteConfig.nav.footer.navigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-white/70 transition-colors hover:text-brand-tangerine"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/40">
                Company
              </p>
              <ul className="mt-4 space-y-3 text-sm">
                {siteConfig.nav.footer.utility.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-white/70 transition-colors hover:text-brand-tangerine"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/40">
                Resources
              </p>
              <ul className="mt-4 space-y-3 text-sm">
                {siteConfig.nav.footer.resources.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group inline-flex items-center gap-1 text-white/70 transition-colors hover:text-brand-tangerine"
                    >
                      {item.label}
                      {item.href === "/demo" ? (
                        <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col-reverse items-center justify-between gap-6 py-6 md:flex-row">
          <p className="text-sm text-white/45">
            © {year} {siteConfig.name}. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-2">
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                className="inline-flex h-10 min-w-10 items-center justify-center rounded-full border border-white/15 px-3 text-xs font-semibold text-white/60 transition-colors hover:border-brand-tangerine/50 hover:bg-white/5 hover:text-brand-tangerine"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-white/45">
            <Link href="/privacy" className="transition-colors hover:text-white/80">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-white/80">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
