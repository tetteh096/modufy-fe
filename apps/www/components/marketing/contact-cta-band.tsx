import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";

export function ContactCtaBand() {
  return (
    <section className="bg-foreground py-14 text-background md:py-16">
      <div className="container-site flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <FadeIn>
          <h2 className="text-2xl font-bold sm:text-3xl">Still, you have any questions?</h2>
        </FadeIn>
        <FadeIn delay={0.05}>
          <Button
            href="/contact"
            className="bg-background text-foreground hover:brightness-95"
          >
            Contact Us
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}
