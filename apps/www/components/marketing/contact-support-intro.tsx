import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { contactInfo, contactSocialLinks } from "@/lib/contact-content";
import { siteConfig } from "@/lib/site-config";

const channels = [
  {
    icon: Phone,
    title: "Call us",
    href: `tel:${contactInfo.phones[0].replace(/[^\d+]/g, "")}`,
    lines: contactInfo.phones,
  },
  {
    icon: Mail,
    title: "Email us",
    href: `mailto:${contactInfo.emails[0]}`,
    lines: contactInfo.emails,
  },
  {
    icon: MapPin,
    title: contactInfo.office.label,
    href: undefined,
    lines: contactInfo.office.lines,
  },
] as const;

export function ContactSupportIntro() {
  return (
    <FadeIn>
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-leaf-green">
        Support & sales
      </p>
      <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">{contactInfo.headline}</h2>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">{contactInfo.description}</p>
      <p className="mt-3 text-sm font-medium text-brand-leaf-green">{contactInfo.responseTime}</p>

      <div className="mt-8 grid gap-3 sm:grid-cols-1">
        {channels.map((channel) => {
          const Icon = channel.icon;
          const inner = (
            <div className="flex items-start gap-4 rounded-[1.25rem] border border-border bg-card p-4 transition hover:border-brand-leaf-green/30 hover:shadow-sm">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-brand-leaf-green">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold text-brand-sea-grey">{channel.title}</p>
                {channel.lines.map((line) => (
                  <p key={line} className="mt-0.5 text-sm text-muted-foreground">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          );

          return channel.href ? (
            <Link key={channel.title} href={channel.href} className="block">
              {inner}
            </Link>
          ) : (
            <div key={channel.title}>{inner}</div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button href="/demo" size="md">
          Book a demo
        </Button>
        <div className="flex flex-wrap gap-2">
          {contactSocialLinks.map((item) => (
            <a
              key={item.label}
              href={siteConfig.social[item.hrefKey]}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.label}
              className="inline-flex h-9 min-w-9 items-center justify-center rounded-full border border-border px-3 text-xs font-semibold text-muted-foreground transition hover:border-brand-tangerine hover:text-brand-tangerine"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </FadeIn>
  );
}
