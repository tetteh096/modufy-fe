import { FaqAccordion } from "@/components/about/faq-accordion";
import { FadeIn } from "@/components/ui/fade-in";

export function FaqSection() {
  return (
    <section className="section-padding">
      <div className="container-site">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Questions about Modufy</h2>
        </FadeIn>
        <div className="mt-12">
          <FaqAccordion />
        </div>
      </div>
    </section>
  );
}
