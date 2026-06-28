export const siteConfig = {
  name: "Modufy",
  tagline: "Business management for growing teams",
  footerTagline:
    "We're your innovation partner, delivering cutting-edge solutions that elevate your business to the next level.",
  description:
    "Modufy is a user-friendly, feature-rich business platform that helps you increase sales, manage clients, and close deals more efficiently.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3002",
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  social: {
    twitter: "https://twitter.com/",
    facebook: "https://facebook.com/",
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
  },
  nav: {
    main: [
      { label: "Home", href: "/" },
      { label: "Modules", href: "/modules" },
      { label: "About", href: "/about" },
      { label: "Pricing", href: "/pricing" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
    footer: {
      navigation: [
        { label: "Home", href: "/" },
        { label: "Modules", href: "/modules" },
        { label: "Why Us", href: "/why-us" },
        { label: "About", href: "/about" },
        { label: "Pricing", href: "/pricing" },
        { label: "Contact", href: "/contact" },
      ],
      utility: [
        { label: "FAQ", href: "/faq" },
        { label: "Testimonials", href: "/testimonials" },
        { label: "Integrations", href: "/integrations" },
      ],
      resources: [
        { label: "Documentation", href: "/docs" },
        { label: "Blog", href: "/blog" },
        { label: "FAQ", href: "/faq" },
        { label: "Integrations", href: "/integrations" },
        { label: "Book a demo", href: "/demo" },
      ],
    },
  },
} as const;

export function appPath(path: string) {
  const base = siteConfig.appUrl.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function resolveNavHref(item: { href?: string; appHref?: string }): string {
  if (item.appHref) return appPath(item.appHref);
  return item.href ?? "#";
}

export function isExternalNav(item: { href?: string; appHref?: string }): boolean {
  return Boolean(item.appHref) || (item.href?.startsWith("http") ?? false);
}
