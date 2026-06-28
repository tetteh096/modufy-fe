import Image from "next/image";
import Link from "next/link";
import { contactInfo } from "@/lib/contact-content";
import { FadeIn } from "@/components/ui/fade-in";

const channels = [
  {
    icon: "/images/icon/call2.svg",
    title: "Call us directly",
    href: `tel:${contactInfo.phones[0].replace(/[^\d+]/g, "")}`,
    lines: contactInfo.phones,
    external: false,
  },
  {
    icon: "/images/icon/email3.svg",
    title: "Email us",
    href: `mailto:${contactInfo.emails[0]}`,
    lines: contactInfo.emails,
    external: false,
  },
  {
    icon: "/images/icon/map2.svg",
    title: "Our office address",
    href: undefined,
    lines: contactInfo.office.lines,
    external: false,
  },
] as const;

export function ContactInfoBand() {
  return (
    <section className="bg-foreground py-14 text-background md:py-16">
      <div className="container-site">
        <div className="grid gap-10 md:grid-cols-3">
          {channels.map((channel, index) => {
            const content = (
              <div className="flex flex-col items-center gap-4 text-center md:flex-row md:items-start md:text-left">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                  <Image src={channel.icon} alt="" width={28} height={28} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{channel.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/75">
                    {channel.lines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            );

            return (
              <FadeIn key={channel.title} delay={index * 0.05}>
                {channel.href ? (
                  <Link href={channel.href} className="block transition-opacity hover:opacity-90">
                    {content}
                  </Link>
                ) : (
                  content
                )}
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
