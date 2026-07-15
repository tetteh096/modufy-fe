import type { Metadata } from "next";
import { FaqAccordion } from "@/components/about/faq-accordion";
import { ContactForm } from "@/components/marketing/contact-form";
import { ContactPageHero } from "@/components/marketing/contact-page-hero";
import { ContactSupportIntro } from "@/components/marketing/contact-support-intro";
import { FadeIn } from "@/components/ui/fade-in";
import { marketingFaqs } from "@/lib/faq-content";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with the ${siteConfig.name} team: book a call, ask a question, or request support.`,
};

const contactFaqs = marketingFaqs.slice(0, 5);

export default function ContactPage() {
  return (
    <>
      <ContactPageHero />

      <section className="relative z-10 -mt-6 pb-16 md:pb-24">
        <div className="container-site">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            <ContactSupportIntro />
            <FadeIn delay={0.08}>
              <ContactForm />
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="section-padding border-t border-border bg-[#f5f6f3]">
        <div className="container-site">
          <FadeIn className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-leaf-green">
              FAQ
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Common questions before you write</h2>
            <p className="mt-3 text-muted-foreground">
              Quick answers. If you don&apos;t find what you need, the form above goes straight to our team.
            </p>
          </FadeIn>
          <div className="mt-12">
            <FaqAccordion items={contactFaqs} />
          </div>
        </div>
      </section>
    </>
  );
}
