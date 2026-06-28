import { AnimatedStat } from "@/components/ui/animated-stat";
import { FadeIn } from "@/components/ui/fade-in";
import { aboutStats } from "@/lib/about-content";

export function AboutStatsSection() {
  return (
    <section className="border-y border-border bg-muted/20 py-14 md:py-16">
      <div className="container-site">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {aboutStats.map((stat, index) => (
            <FadeIn key={stat.label} delay={index * 0.06} className="text-center">
              <AnimatedStat value={stat.value} suffix={stat.suffix} label={stat.label} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
