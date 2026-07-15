import type { LucideIcon } from "lucide-react";
import { HeartHandshake, Sparkles } from "lucide-react";
import { homeImages } from "@/lib/home-images";

export const aboutStats = [
  { value: 10, suffix: "+", label: "Modules on one platform" },
  { value: 4, suffix: "", label: "Countries in early access" },
  { value: 99, suffix: "%", label: "Uptime target" },
  { value: 24, suffix: "h", label: "Typical support response" },
] as const;

export const aboutValues: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: Sparkles,
    title: "Ship what operators actually need",
    description:
      "We build from real workflows, stock counts, invoice reminders, shift handoffs, not feature checklists copied from legacy ERPs.",
  },
  {
    icon: HeartHandshake,
    title: "Stay close to customers",
    description:
      "Every module shares the same customer record, so support, sales, and finance see one truth, and your clients feel the difference.",
  },
];

export const aboutTeam = [
  {
    name: "Amara Okonkwo",
    role: "CEO & Co-founder",
    image: homeImages.pages.team.one,
  },
  {
    name: "Daniel Reyes",
    role: "Head of Product",
    image: homeImages.pages.team.two,
  },
  {
    name: "Priya Sharma",
    role: "Lead Engineer",
    image: homeImages.pages.team.three,
  },
] as const;

export const aboutFaqs = [
  {
    question: "What makes Modufy different from other business software?",
    answer:
      "Modufy is modular by design. Core: customers, sales, expenses, and team access: is included with every account. You add invoicing, inventory, POS, or marketing only when you need them, and everything shares the same data.",
  },
  {
    question: "How secure is my business data?",
    answer:
      "Data is encrypted in transit and at rest. Every account is tenant-scoped, your team only sees your business. We run regular backups and follow industry-standard access controls.",
  },
  {
    question: "Can Modufy integrate with tools we already use?",
    answer:
      "Yes. Modufy connects with payment providers, ecommerce platforms, messaging channels, and accounting tools. Visit our Integrations page for the current list, or ask us about a specific connector.",
  },
  {
    question: "What kind of support can we expect?",
    answer:
      "Email and in-app support on all plans, with faster response on higher tiers. Documentation, module guides, and onboarding help are included, and our team runs live demos when you want a walkthrough.",
  },
  {
    question: "How does pricing work as we grow?",
    answer:
      "Plans scale by team size and billing cycle. Core is free to start. Paid modules are add-ons you enable when ready, no rip-and-replace migration required.",
  },
] as const;

export const journeyGallery = [
  [
    { src: homeImages.pages.journey.collaboration, alt: "Team collaborating on product roadmap" },
    { src: homeImages.pages.journey.workspace, alt: "Modern office workspace" },
  ],
  [{ src: homeImages.pages.journey.planning, alt: "Planning session with whiteboard" }],
  [
    { src: homeImages.pages.journey.meeting, alt: "Team meeting around a table" },
    { src: homeImages.pages.journey.retail, alt: "Retail operator using point of sale" },
  ],
] as const;

export const aboutJourneyCopy = {
  title: "Why we built Modufy",
  description:
    "We watched growing teams juggle spreadsheets, WhatsApp threads, and disconnected apps just to sell a product and send an invoice. Modufy brings those workflows into one modular platform: start with Core, add modules as you scale.",
};
