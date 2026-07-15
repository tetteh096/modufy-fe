export type Currency = "USD" | "EUR" | "GBP";

export const currencySymbols: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
};

export const currencyRates: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
};

export type BillingCycle = "monthly" | "yearly";

export type PricingPlanDef = {
  id: string;
  name: string;
  tagline: string;
  monthlyBase: number;
  yearlyBase: number;
  highlighted: boolean;
  badge?: string;
  includesFrom?: string;
  features: readonly string[];
};

export const pricingPlans: PricingPlanDef[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Start with core modules: simple and straightforward",
    monthlyBase: 19,
    yearlyBase: 14,
    highlighted: false,
    features: [
      "Up to 3 team members",
      "Sales & CRM essentials",
      "Invoices and basic reporting",
      "Email support",
      "10 integrations",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    tagline: "Add marketing and operations as you scale",
    monthlyBase: 39,
    yearlyBase: 29,
    highlighted: false,
    includesFrom: "Starter",
    features: [
      "Up to 10 team members",
      "Email marketing automations",
      "Inventory & POS modules",
      "Priority email support",
      "25 integrations",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    tagline: "Automate workflows and unlock advanced analytics",
    monthlyBase: 59,
    yearlyBase: 49,
    highlighted: true,
    badge: "Most popular",
    includesFrom: "Growth",
    features: [
      "Up to 25 team members",
      "Advanced reporting & dashboards",
      "Appointments & communications",
      "Live chat support",
      "40 integrations",
    ],
  },
  {
    id: "ultimate",
    name: "Ultimate",
    tagline: "Full platform access with team visibility and control",
    monthlyBase: 99,
    yearlyBase: 79,
    highlighted: false,
    includesFrom: "Professional",
    features: [
      "Unlimited team members",
      "Accounts, expenses & tax tools",
      "Dedicated account manager",
      "Custom roles & permissions",
      "All integrations + API access",
    ],
  },
];

export function computePlanPrice(
  plan: PricingPlanDef,
  opts: { teamSize: number; billing: BillingCycle; currency: Currency }
) {
  const base = opts.billing === "yearly" ? plan.yearlyBase : plan.monthlyBase;
  const teamMultiplier = 1 + Math.max(0, opts.teamSize - 1) * 0.08;
  const raw = base * teamMultiplier * currencyRates[opts.currency];
  return Math.round(raw);
}

export type ComparisonRow = {
  feature: string;
  starter: string | boolean;
  growth: string | boolean;
  professional: string | boolean;
  ultimate: string | boolean;
};

export type ComparisonGroup = {
  title: string;
  rows: ComparisonRow[];
};

export const pricingComparisonGroups: ComparisonGroup[] = [
  {
    title: "Core platform",
    rows: [
      { feature: "Team members", starter: "Up to 3", growth: "Up to 10", professional: "Up to 25", ultimate: "Unlimited" },
      { feature: "Modular add-ons", starter: true, growth: true, professional: true, ultimate: true },
      { feature: "Mobile access", starter: true, growth: true, professional: true, ultimate: true },
      { feature: "Custom roles", starter: false, growth: false, professional: true, ultimate: true },
    ],
  },
  {
    title: "Sales & CRM",
    rows: [
      { feature: "Pipeline management", starter: true, growth: true, professional: true, ultimate: true },
      { feature: "Invoices & quotes", starter: true, growth: true, professional: true, ultimate: true },
      { feature: "Email marketing", starter: false, growth: true, professional: true, ultimate: true },
      { feature: "Revenue forecasting", starter: false, growth: false, professional: true, ultimate: true },
    ],
  },
  {
    title: "Operations",
    rows: [
      { feature: "Inventory module", starter: false, growth: true, professional: true, ultimate: true },
      { feature: "Point of Sale", starter: false, growth: true, professional: true, ultimate: true },
      { feature: "Appointments", starter: false, growth: false, professional: true, ultimate: true },
      { feature: "Multi-location", starter: false, growth: false, professional: false, ultimate: true },
    ],
  },
  {
    title: "Support & security",
    rows: [
      { feature: "Email support", starter: true, growth: true, professional: true, ultimate: true },
      { feature: "Live chat support", starter: false, growth: false, professional: true, ultimate: true },
      { feature: "Dedicated manager", starter: false, growth: false, professional: false, ultimate: true },
      { feature: "SSO & audit logs", starter: false, growth: false, professional: false, ultimate: true },
    ],
  },
];

export const pricingAddons = [
  {
    title: "Advanced analytics",
    description: "Deeper dashboards, cohort reports, and exportable insights for finance teams.",
    price: "From $12/mo",
  },
  {
    title: "Extra integrations",
    description: "Connect custom tools via webhooks and our REST API beyond standard connectors.",
    price: "From $8/mo",
  },
  {
    title: "Onboarding package",
    description: "Guided setup with a Modufy specialist: data migration and team training included.",
    price: "One-time $199",
  },
] as const;

export const pricingFaqs = [
  {
    question: "Can I pay monthly or do I have to commit annually?",
    answer:
      "Both options are available. Annual billing saves up to 50% compared to monthly. You can switch billing cycles from your account settings at any time.",
  },
  {
    question: "How much does Modufy cost?",
    answer:
      "Plans start at $14/month on annual billing for small teams. Price scales with team size and modules enabled. Use the calculator above to estimate your cost.",
  },
  {
    question: "What's the difference between the plans?",
    answer:
      "Each plan unlocks more modules, team seats, and support levels. Starter covers CRM basics; Growth adds marketing and ops; Professional adds automation; Ultimate is full platform access.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes: 14 days free on any paid plan. No credit card required to start. You can explore modules and invite your team before subscribing.",
  },
  {
    question: "Can I add modules without changing plans?",
    answer:
      "Yes. Modufy is modular, enable inventory, POS, or accounts as add-ons on most plans without jumping to the next tier.",
  },
  {
    question: "Do you offer nonprofit or startup discounts?",
    answer:
      "We offer reduced pricing for qualified nonprofits and early-stage startups. Contact our team with your details and we'll find the right fit.",
  },
] as const;

/** @deprecated use pricingPlans */
export const pricingPagePlans = pricingPlans.map((plan) => ({
  id: plan.id,
  name: plan.name,
  description: plan.tagline,
  includesLabel: plan.includesFrom ? `Everything in ${plan.includesFrom}, plus:` : "Plan includes:",
  monthly: plan.monthlyBase,
  yearly: plan.yearlyBase,
  features: plan.features,
  highlighted: plan.highlighted,
}));

export const pricingComparison = {
  columns: ["Starter", "Growth", "Professional", "Ultimate"] as const,
  rows: pricingComparisonGroups.flatMap((g) => g.rows.map((r) => ({ feature: r.feature, values: [r.starter, r.growth, r.professional, r.ultimate] as const }))),
};

export const pricingSolutionsIntro = {
  title: "Modular pricing that scales with you",
  description:
    "Start with what you need, add modules as you grow. Every plan includes core CRM: expand into inventory, POS, marketing, and finance when you're ready.",
};
