export const features = [
  {
    title: "Sales pipeline management",
    description:
      "Visualize your sales process, track opportunities, and forecast revenue with pipeline management tools.",
    icon: "pipeline" as const,
  },
  {
    title: "Marketing automation",
    description:
      "Automate marketing campaigns, email outreach, and lead nurturing to engage customers effectively.",
    icon: "marketing" as const,
  },
  {
    title: "Analytics and reporting",
    description:
      "Generate in-depth reports and analytics to make data-driven decisions and measure performance.",
    icon: "analytics" as const,
  },
  {
    title: "Track customer movement",
    description:
      "Monitor and analyze client behavior, interactions, and engagement online or offline.",
    icon: "tracking" as const,
  },
] as const;

export const brandLogos = [
  "Acme",
  "Northline",
  "Brightpath",
  "Corestack",
  "Flowbase",
] as const;

export const testimonials = [
  {
    quote:
      "We've been using Modufy for over a year now, and I can't stress enough how transformative it has been for our business. The impact on customer relations, sales, and overall efficiency is tremendous.",
    author: "Jonas Aly",
    role: "Founder @ Company",
    initials: "JA",
  },
  {
    quote:
      "A game changer for our business. Our team finally has one place for leads, invoices, and customer follow-ups, without juggling five different tools.",
    author: "Amara Osei",
    role: "Operations Lead",
    initials: "AO",
  },
  {
    quote:
      "The marketing and sales features work together seamlessly. We close deals faster and our customer satisfaction scores have never been higher.",
    author: "David Mensah",
    role: "Sales Director",
    initials: "DM",
  },
] as const;

export const pricingPlans = [
  {
    id: "basic",
    name: "Basic",
    description: "Works perfect for small teams",
    includesLabel: "Basic plan includes:",
    monthly: 19,
    yearly: 39,
    features: [
      "Live chat widget for website",
      "All basic CRM features",
      "Up to 5,000 contacts",
      "Flow base chatbot",
      "24/7 Email Support",
    ],
    highlighted: false,
  },
  {
    id: "standard",
    name: "Standard",
    description: "Great for small and medium teams",
    includesLabel: "Standard plan includes:",
    monthly: 49,
    yearly: 69,
    features: [
      "All multimedia channels",
      "All advanced CRM features",
      "Up to 15,000 contacts",
      "Flow + AI base chatbot",
      "24/7 Support (Live, Email, Chat)",
    ],
    highlighted: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Great for large teams",
    includesLabel: "Enterprise plan includes:",
    monthly: 89,
    yearly: 99,
    features: [
      "All multimedia channels",
      "All enterprise CRM features",
      "Up to 25,000 contacts",
      "Flow + AI base chatbot",
      "24/7 Support (Live, Email, Chat)",
    ],
    highlighted: false,
  },
] as const;

export const integrations = [
  "Slack",
  "Stripe",
  "Shopify",
  "Mailchimp",
  "QuickBooks",
  "Google",
  "HubSpot",
  "Zapier",
  "Notion",
  "Dropbox",
  "Asana",
  "Salesforce",
] as const;
