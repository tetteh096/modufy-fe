import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { homeImages } from "@/lib/home-images";

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.851L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M22 12.07C22 6.48 17.52 2 11.93 2S1.86 6.48 1.86 12.07c0 5.02 3.66 9.18 8.44 9.93v-7.02H7.9v-2.91h2.4V9.84c0-2.37 1.4-3.68 3.55-3.68 1.03 0 2.1.18 2.1.18v2.32h-1.18c-1.17 0-1.53.73-1.53 1.48v1.78h2.61l-.42 2.91h-2.19V22c4.78-.75 8.44-4.91 8.44-9.93z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

const footerColumns = [
  {
    title: "Modufy",
    links: [
      { label: "Pricing", href: "/pricing" },
      { label: "Why Modufy", href: "/why-us" },
      { label: "About us", href: "/about" },
      { label: "Modules", href: "/modules" },
      { label: "Integrations", href: "/integrations" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "Blog", href: "/blog" },
      { label: "FAQ", href: "/faq" },
      { label: "Success stories", href: "/testimonials" },
      { label: "Book a demo", href: "/demo" },
    ],
  },
  {
    title: "What we offer",
    links: [
      { label: "Core", href: "/modules/core" },
      { label: "Invoicing", href: "/modules/invoices" },
      { label: "Inventory", href: "/modules/inventory" },
      { label: "Storefront", href: "/modules/marketplace" },
      { label: "Marketing", href: "/modules/marketing" },
    ],
  },
  {
    title: "Support & contact",
    links: [
      { label: "Contact us", href: "/contact" },
      { label: "Help center", href: "/docs" },
      { label: "Login", href: "/login" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
] as const;

const socialLinks = [
  { href: siteConfig.social.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: siteConfig.social.tiktok, label: "TikTok", Icon: TikTokIcon },
  { href: siteConfig.social.youtube, label: "YouTube", Icon: YoutubeIcon },
  { href: siteConfig.social.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
  { href: siteConfig.social.twitter, label: "X", Icon: XIcon },
  { href: siteConfig.social.facebook, label: "Facebook", Icon: FacebookIcon },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-[#050505] text-white">
      {/* CTA */}
      <div className="px-4 pt-14 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-[92rem] overflow-hidden rounded-[2rem] sm:rounded-[2.75rem]">
          <Image
            src={homeImages.cta}
            alt=""
            fill
            className="object-cover object-[48%_30%] brightness-[0.5]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/40 to-transparent" />
          <div className="relative z-10 flex min-h-[300px] flex-col justify-end gap-6 px-8 py-12 sm:min-h-[380px] sm:px-14 sm:py-16 lg:min-h-[440px] lg:px-20">
            <span className="inline-flex w-fit rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
              Get started today!
            </span>
            <h2 className="max-w-2xl font-display text-5xl font-extrabold uppercase leading-[0.9] tracking-tight text-brand-tangerine sm:text-6xl lg:text-[5.5rem]">
              Pay less.
              <br />
              Grow more.
            </h2>
            <Link
              href="/demo"
              className="inline-flex w-fit items-center gap-2.5 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-black transition hover:scale-[1.02] hover:bg-brand-tangerine hover:text-white"
            >
              Book a call
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <p className="mx-auto mt-16 px-4 text-center font-display text-sm font-extrabold uppercase tracking-[0.28em] text-brand-tangerine sm:mt-20 sm:text-base">
        Fewer tools. Fuller operations.
      </p>

      {/* Links panel */}
      <div className="relative z-10 mx-auto mt-12 max-w-[92rem] px-4 sm:mt-16 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-white/20 bg-[#0b0b0b] px-8 py-12 shadow-[0_40px_80px_rgba(0,0,0,0.55)] sm:rounded-[2.5rem] sm:px-12 sm:py-14 lg:px-16 lg:py-[4.25rem]">
          <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-14">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <p className="text-[15px] font-bold tracking-tight text-white">
                  {column.title}
                </p>
                <ul className="mt-6 space-y-3.5">
                  {column.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className="text-[15px] text-white/50 transition hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-16 flex flex-col gap-8 border-t border-white/10 pt-10 sm:mt-20 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/40">
              <Link href="/terms" className="transition hover:text-white">
                Terms of Service
              </Link>
              <Link href="/privacy" className="transition hover:text-white">
                Privacy Policy
              </Link>
              <span>© {year} {siteConfig.name}</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {socialLinks.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 text-white/60 transition hover:border-brand-tangerine/60 hover:bg-brand-tangerine/10 hover:text-brand-tangerine"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Giant Modufy — clear gap under panel, no collision */}
      <div aria-hidden className="relative mt-8 overflow-hidden sm:mt-10">
        <div className="flex h-[clamp(9rem,26vw,16rem)] items-start justify-center px-2">
          <span className="select-none whitespace-nowrap font-brand text-[clamp(8rem,26vw,22rem)] font-normal uppercase leading-none tracking-[-0.04em] text-brand-tangerine">
            Modufy
          </span>
        </div>
      </div>
    </footer>
  );
}
