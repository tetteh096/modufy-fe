import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/ui/fade-in";
import { aboutTeam } from "@/lib/about-content";
import { siteConfig } from "@/lib/site-config";

export function TeamSection() {
  return (
    <section className="section-padding bg-foreground text-background">
      <div className="container-site">
        <FadeIn className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-3xl font-bold sm:text-4xl">The people behind Modufy</h2>
          <Link
            href="/contact"
            className="inline-flex h-11 items-center justify-center rounded-full border border-white/25 bg-white/10 px-6 text-sm font-semibold text-background transition hover:bg-white/20"
          >
            Join Our Team
          </Link>
        </FadeIn>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {aboutTeam.map((member, index) => (
            <FadeIn key={member.name} delay={index * 0.08}>
              <article className="group overflow-hidden rounded-2xl bg-background/5">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                    <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                    <p className="text-sm text-white/75">{member.role}</p>
                    <div className="mt-3 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      {["X", "FB", "IN"].map((label) => (
                        <a
                          key={label}
                          href={siteConfig.social.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-white/15 px-2 text-[10px] font-semibold text-white hover:bg-white/25"
                        >
                          {label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
