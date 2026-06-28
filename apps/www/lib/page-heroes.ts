import { contactTopics } from "@/lib/contact-content";
import { homeImages } from "@/lib/home-images";

export const pageHeroes = {
  about: {
    eyebrow: "About us",
    title: "Software for teams who've outgrown spreadsheets",
    subtitle:
      "Modufy started with a simple idea: growing businesses shouldn't need a dozen disconnected tools to sell, stock, bill, and stay in touch with customers.",
    image: homeImages.pages.about,
    imageAlt: "Modufy team collaborating in a modern workspace",
  },
  whyUs: {
    eyebrow: "Why Modufy",
    title: "One calm workspace instead of ten tabs",
    subtitle:
      "CRM, invoicing, inventory, POS, and marketing that share the same customers, products, and numbers — so your team stops copying data between apps.",
    image: homeImages.pages.whyUs,
    imageAlt: "Business team reviewing operations on a laptop",
  },
  faq: {
    eyebrow: "FAQ",
    title: "Answers before you ask",
    subtitle:
      "Plans, modules, security, integrations, and getting started — the questions we hear most from growing teams.",
    image: homeImages.pages.faq,
    imageAlt: "Support conversation at a help desk",
  },
  blog: {
    eyebrow: "Blog",
    title: "Ideas for running a sharper business",
    subtitle:
      "Product updates, operational tips, and stories from teams using Modufy to sell, stock, and scale.",
    image: homeImages.pages.blog,
    imageAlt: "Writer working on a business article",
  },
  docs: {
    eyebrow: "Documentation",
    title: "Set up, configure, and grow",
    subtitle:
      "Quickstart guides, module walkthroughs, integration notes, and API references for developers.",
    image: homeImages.pages.docs,
    imageAlt: "Developer reading documentation on screen",
  },
  demo: {
    eyebrow: "Book a demo",
    title: "Your business, live on Modufy",
    subtitle:
      "A focused 30-minute walkthrough — not a sales pitch. We'll show the modules and workflows that matter to how you sell, stock, and bill.",
    image: homeImages.pages.demo,
    imageAlt: "Product demo on a video call",
    tags: ["30 minutes", "Live Q&A", "No obligation"],
  },
  integrations: {
    eyebrow: "Integrations",
    title: "Works with your stack",
    subtitle:
      "Connect payments, messaging, ecommerce, and accounting — without rebuilding how your team already works.",
    image: homeImages.pages.integrations,
    imageAlt: "Connected software integrations diagram",
  },
  testimonials: {
    eyebrow: "Testimonials",
    title: "Teams that run on Modufy",
    subtitle:
      "Retailers, service businesses, and growing operators on what changed when their tools finally talked to each other.",
    image: homeImages.pages.testimonials,
    imageAlt: "Happy business owner in their shop",
  },
  modules: {
    eyebrow: "Modules",
    title: "Pick what you need. Add more as you grow.",
    subtitle:
      "Core is included with every account. Enable invoicing, inventory, POS, appointments, and more when you're ready.",
    image: homeImages.pages.modules,
    imageAlt: "Modular business software dashboard",
  },
  contact: {
    eyebrow: "Contact us",
    title: "We'd love to hear from you",
    subtitle:
      "Questions about modules, pricing, or getting your team set up — send a message or book time with us directly.",
    image: homeImages.story.support,
    imageAlt: "Customer support representative smiling",
    tags: contactTopics,
  },
  privacy: {
    eyebrow: "Legal",
    title: "Privacy policy",
    subtitle: "How Modufy collects, uses, and protects your data.",
    image: homeImages.pages.legal,
    imageAlt: "Secure data privacy concept",
  },
  terms: {
    eyebrow: "Legal",
    title: "Terms & conditions",
    subtitle: "The agreement between you and Modufy when you use the platform.",
    image: homeImages.pages.legal,
    imageAlt: "Legal documents on a desk",
  },
  notFound: {
    eyebrow: "404",
    title: "Page not found",
    subtitle: "The page you're looking for doesn't exist or may have moved.",
    image: homeImages.pages.notFound,
    imageAlt: "Empty hallway suggesting a missing page",
  },
} as const;
