import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BookOpen,
  Bot,
  Calendar,
  FileText,
  MessageSquare,
  Package,
  ShoppingBag,
  Store,
  Users,
  Wallet,
} from "lucide-react";
import { homeImages } from "@/lib/home-images";

export type ModuleCategoryId = "revenue" | "operations" | "engage" | "finance";

export type ModufyModule = {
  slug: string;
  name: string;
  tagline: string;
  category: ModuleCategoryId;
  tier: "core" | "paid";
  icon: LucideIcon;
  image: string;
  imageAlt: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  heroTitle: string;
  heroDescription: string;
  overview: readonly string[];
  capabilities: readonly string[];
  whoItsFor: readonly string[];
  connectsWith: readonly string[];
};

export const modufyModules: ModufyModule[] = [
  {
    slug: "core",
    name: "Modufy Core",
    tagline: "Customers, sales, expenses, and team — included with every account",
    category: "revenue",
    tier: "core",
    icon: Users,
    image: homeImages.features.pipeline,
    imageAlt: "Modufy core dashboard on desktop and mobile",

    seo: {
      title: "Core Business Management Software for Growing Teams",
      description:
        "Modufy Core is included with every account — manage customers, record sales, track expenses, invite your team, and stay on top of alerts before you add a single paid module.",
      keywords: [
        "business management software",
        "CRM",
        "sales tracking",
        "expense management",
        "team permissions",
        "Modufy Core",
      ],
    },
    heroTitle: "Run your business from one foundation.",
    heroDescription:
      "Core is always on. Manage customers, record sales, track expenses, invite your team, and stay on top of what needs attention — before you add a single paid module.",
    overview: [
      "Every Modufy account starts with Core: your customer book, daily sales, expense capture, notifications, and role-based team access.",
      "Paid modules plug into Core instead of replacing it. A POS sale, invoice payment, and storefront order all land in the same financial picture.",
    ],
    capabilities: [
      "Customer records with tags, balance, and full history",
      "Quick sales — cash, mobile money, and card",
      "Expense tracking with categories and receipt photos",
      "Team invites, roles, and granular permissions",
      "Multi-branch support for growing locations",
      "In-app alerts and attention dashboard",
      "1:1 SMS and email to individual customers",
    ],
    whoItsFor: [
      "Shops and service businesses starting digital record-keeping",
      "Teams replacing spreadsheets for customers and daily sales",
      "Owners who want one login before adding invoicing or inventory",
    ],
    connectsWith: ["invoices", "inventory", "pos", "accounts", "marketing"],
  },
  {
    slug: "invoices",
    name: "Invoicing",
    tagline: "Create, brand, send, and get paid on professional invoices",
    category: "revenue",
    tier: "paid",
    icon: FileText,
    image: homeImages.features.invoice,
    imageAlt: "Modufy invoicing and billing",

    seo: {
      title: "Invoicing & Billing Software for Growing Businesses",
      description:
        "Create branded invoices, send payment reminders, track invoice statuses, record payments, and manage Ghana VAT and E-VAT workflows with Modufy.",
      keywords: ["invoicing software", "billing", "quotes", "payment tracking", "VAT invoices Ghana", "E-VAT"],
    },
    heroTitle: "Bill professionally. Get paid faster.",
    heroDescription:
      "From draft to paid — create branded invoices, send automatic payment reminders, generate proforma quotes, and stay compliant with Ghana E-VAT. Every payment flows directly into your books.",
    overview: [
      "Invoicing turns informal sales into formal documents your customers trust. Line items can come from your inventory catalog or be entered manually.",
      "When a payment lands, Accounts updates automatically. No duplicate entry between billing and bookkeeping.",
    ],
    capabilities: [
      "Branded invoice PDFs with your logo and colours",
      "Status workflow: draft, sent, viewed, partial, paid, overdue",
      "Send via WhatsApp, SMS, email, or shareable link",
      "Proforma quotes that convert to invoices in one click",
      "Multi-currency invoices and payment recording",
      "Ghana VAT, NHIL, and GETFund line breakdown",
      "GRA E-VAT transmission and approval codes",
    ],
    whoItsFor: [
      "B2B suppliers and wholesalers sending formal bills",
      "Freelancers and agencies converting quotes to invoices",
      "Businesses that need VAT-compliant documents in Ghana",
    ],
    connectsWith: ["core", "inventory", "accounts", "marketing"],
  },
  {
    slug: "inventory",
    name: "Inventory & Stock",
    tagline: "Products, services, and stock in one catalog",
    category: "operations",
    tier: "paid",
    icon: Package,
    image: homeImages.features.inventory,
    imageAlt: "Modufy inventory management",

    seo: {
      title: "Inventory Management Software for Growing Businesses",
      description:
        "Track products, services, variants, stock levels, suppliers, and purchase orders. Modufy Inventory feeds invoices, POS, appointments, and your online storefront from one catalog.",
      keywords: [
        "inventory management",
        "stock control",
        "SKU tracking",
        "purchase orders",
        "retail catalog",
        "low stock alerts",
      ],
    },
    heroTitle: "Know what you have. Know what you sold.",
    heroDescription:
      "One catalog for physical products and billable services. Stock moves automatically when you sell through POS, invoices, or your storefront.",
    overview: [
      "Inventory is the product brain of Modufy. Define what you sell once — then use it everywhere else in the platform.",
      "Low-stock alerts, supplier records, and purchase orders keep retail and wholesale teams ahead of stockouts.",
    ],
    capabilities: [
      "Products with photos, SKU, barcode, variants, and pricing",
      "Services with hourly or fixed rates and bookable flags",
      "Restock, adjust, and write-off with full movement history",
      "Supplier management and purchase orders",
      "FIFO and average-cost valuation methods",
      "Low-stock alerts and inventory valuation reports",
      "Storefront visibility controls per item",
    ],
    whoItsFor: [
      "Retailers and pharmacies managing physical stock",
      "Salons and clinics selling products alongside services",
      "Wholesalers tracking cost price and supplier orders",
    ],
    connectsWith: ["core", "invoices", "pos", "marketplace", "appointments", "accounts"],
  },
  {
    slug: "pos",
    name: "Point of Sale",
    tagline: "Professional in-store checkout and register sessions",
    category: "operations",
    tier: "paid",
    icon: ShoppingBag,
    image: homeImages.features.orders,
    imageAlt: "Modufy point of sale and order tracking",

    seo: {
      title: "Point of Sale (POS) Software",
      description:
        "Modufy POS is a full-screen register for shops and counters — barcode scan, held carts, shift sessions, receipts, and live stock deduction.",
      keywords: ["point of sale", "POS software", "retail checkout", "cash register", "barcode POS"],
    },
    heroTitle: "Checkout built for the counter",
    heroDescription:
      "Scan, sell, and receipt in seconds. Every completed sale posts to Core and Accounts — one financial truth, whether customers buy in-store or online.",
    overview: [
      "POS is Modufy’s register experience for retail counters and busy service desks. It pulls your live catalog from Inventory and deducts stock on every sale.",
      "Open and close shift sessions with cash float tracking so managers know exactly what happened on each register.",
    ],
    capabilities: [
      "Full-screen product grid with barcode and SKU search",
      "Park and resume held carts during busy periods",
      "Register sessions with open/close and cash float",
      "Receipts via print, WhatsApp, or SMS",
      "Void same-day sales with permission controls",
      "Discount overrides for authorised staff",
      "Automatic stock deduction and Accounts posting",
    ],
    whoItsFor: [
      "Shops, pharmacies, and hardware stores with a physical counter",
      "Salons selling retail products at checkout",
      "Any business that needs fast barcode-led sales",
    ],
    connectsWith: ["core", "inventory", "accounts", "invoices"],
  },
  {
    slug: "appointments",
    name: "Appointments & Bookings",
    tagline: "Take bookings, collect deposits, reduce no-shows",
    category: "engage",
    tier: "paid",
    icon: Calendar,
    image: homeImages.features.appointments,
    imageAlt: "Modufy appointment booking calendar",

    seo: {
      title: "Appointment Booking Software",
      description:
        "Let customers book services online without an account. Modufy Appointments handles calendar, deposits, reminders, and auto-invoicing on completion.",
      keywords: ["appointment booking", "online scheduling", "salon booking", "service deposits", "booking reminders"],
    },
    heroTitle: "Fill your calendar without the back-and-forth",
    heroDescription:
      "Customers book from your public storefront. Collect deposits via Paystack, send SMS reminders, and auto-generate an invoice when the appointment is done.",
    overview: [
      "Appointments connects your bookable services from Inventory to a live calendar your team manages every day.",
      "Guest booking means customers only need a name and phone — no account required — which removes friction for first-time clients.",
    ],
    capabilities: [
      "Week and day calendar views for your team",
      "Business hours, availability, and blocked slots",
      "Guest booking from your public storefront",
      "Deposit collection via mobile money or card",
      "SMS and email reminders before appointments",
      "Status flow: pending, confirmed, completed, cancelled",
      "Auto-invoice when an appointment is marked complete",
    ],
    whoItsFor: [
      "Salons, barbers, spas, and beauty studios",
      "Clinics and consultants with scheduled sessions",
      "Any service business tired of DM-based booking",
    ],
    connectsWith: ["inventory", "marketplace", "invoices", "marketing", "core"],
  },
  {
    slug: "marketplace",
    name: "Online Storefront",
    tagline: "Your public page to browse, book, and buy",
    category: "revenue",
    tier: "paid",
    icon: Store,
    image: homeImages.features.orders,
    imageAlt: "Modufy online storefront",

    seo: {
      title: "Online Storefront & Marketplace for Growing Businesses",
      description:
        "Publish a branded storefront at your Modufy link. List products and services from Inventory, take guest orders and enquiries, run promotions, collect reviews, and manage orders in one place.",
      keywords: [
        "online storefront",
        "small business website",
        "sell online",
        "service booking page",
        "product catalog online",
        "Modufy marketplace",
      ],
    },
    heroTitle: "Your business online — without building a website.",
    heroDescription:
      "A public page at your Modufy link. List products and services from Inventory, take orders and enquiries, run promotions, and collect reviews.",
    overview: [
      "Marketplace is your customer-facing storefront. It adapts to product businesses and service businesses from the same catalog you already manage.",
      "Promotions, coupons, portfolio galleries, and an enquiry inbox turn a simple catalog into a full commercial presence.",
    ],
    capabilities: [
      "Publish/unpublish storefront with your branding",
      "Product and service listings from Inventory",
      "Guest ordering and enquiry forms",
      "Portfolio and project galleries",
      "Promotions, coupons, and discount analytics",
      "Customer reviews with reply and moderation",
      "Order management linked to customer records",
    ],
    whoItsFor: [
      "Retailers who want online orders without Shopify complexity",
      "Service businesses needing a booking and portfolio page",
      "Brands that outgrew Instagram DMs for sales",
    ],
    connectsWith: ["inventory", "appointments", "invoices", "blog", "marketing", "core"],
  },
  {
    slug: "marketing",
    name: "Marketing Campaigns",
    tagline: "SMS and email campaigns to your customer book",
    category: "revenue",
    tier: "paid",
    icon: MessageSquare,
    image: homeImages.features.marketing,
    imageAlt: "Modufy marketing campaigns megaphone",

    seo: {
      title: "SMS & Email Marketing Software for Growing Businesses",
      description:
        "Send SMS and email campaigns from your Modufy customer book. Build segments, use templates with merge tags, track deliveries, and handle opt-outs with SMS wallet tracking built in.",
      keywords: [
        "SMS marketing",
        "email campaigns",
        "customer segments",
        "bulk messaging",
        "marketing automation",
        "SMS wallet",
      ],
    },
    heroTitle: "Reach your customers where they already are.",
    heroDescription:
      "Build segments from your customer book, choose a template, and send — with opt-out handling and SMS wallet tracking built in.",
    overview: [
      "Marketing is for outbound campaigns, while Core handles one-to-one messages. Together they cover transactional and promotional communication.",
      "Segments are saved audience rules evaluated at send time, so your lists stay fresh without manual exports.",
    ],
    capabilities: [
      "SMS and email templates with merge tags",
      "Saved audience segments with live preview",
      "Campaign drafts with sent/failed/skipped rollups",
      "Suppression list and opt-out compliance",
      "Starter templates: welcome, promotion, win-back, birthday",
      "SMS wallet integration for credit tracking",
      "Email unsubscribe links handled automatically",
    ],
    whoItsFor: [
      "Shops running seasonal promotions to past buyers",
      "Salons sending appointment reminders and offers",
      "Any business with a customer list ready to re-engage",
    ],
    connectsWith: ["core", "invoices", "marketplace", "appointments"],
  },
  {
    slug: "accounts",
    name: "Accounting & Finance",
    tagline: "Automatic books from every transaction",
    category: "finance",
    tier: "paid",
    icon: Wallet,
    image: homeImages.features.analytics,
    imageAlt: "Modufy accounting and finance reports",

    seo: {
      title: "Accounting & Bookkeeping Software",
      description:
        "Modufy Accounts auto-posts from sales, invoices, expenses, inventory, and POS. P&L, cash flow, VAT returns, and journal ledger in one place.",
      keywords: ["accounting software", "bookkeeping", "P&L report", "VAT returns Ghana", "small business finance"],
    },
    heroTitle: "Books that update themselves",
    heroDescription:
      "Every sale, invoice payment, expense, and stock movement can post to your ledger automatically. See P&L, cash flow, and tax summaries without re-keying data.",
    overview: [
      "Accounts is the financial layer of Modufy. It receives entries from Core and every paid module so your reports reflect real activity.",
      "Accountants get journal views, manual adjustments, and export-friendly summaries — owners get dashboards they can actually read.",
    ],
    capabilities: [
      "Auto-posting from sales, invoices, expenses, inventory, POS",
      "Profit & loss and cash flow reports",
      "VAT summaries and tax period filing markers",
      "Double-entry chart of accounts",
      "Manual journal entries when you need them",
      "Multi-currency ledger with exchange rates",
      "Ghana GRA and Nigeria FIRS tax support",
    ],
    whoItsFor: [
      "Owners who want real-time P&L without a separate accounting tool",
      "Accountants supporting Modufy-powered clients",
      "VAT-registered businesses needing compliant summaries",
    ],
    connectsWith: ["core", "invoices", "inventory", "pos", "appointments"],
  },
  {
    slug: "blog",
    name: "Storefront Blog",
    tagline: "Content marketing on your public page",
    category: "engage",
    tier: "paid",
    icon: BookOpen,
    image: homeImages.features.mobile,
    imageAlt: "Modufy storefront content and messaging",

    seo: {
      title: "Business Blog for Your Storefront",
      description:
        "Publish SEO-friendly blog posts on your Modufy storefront. Build trust, share updates, and drive organic traffic to your products and services.",
      keywords: ["business blog", "content marketing", "storefront SEO", "small business blog"],
    },
    heroTitle: "Tell your story on your storefront",
    heroDescription:
      "Draft, publish, and organise posts that live on your public Modufy page — with cover images, categories, tags, and SEO fields built in.",
    overview: [
      "Blog gives your storefront a content layer. Posts appear under your business link alongside products and booking pages.",
      "SEO title and meta description fields help each article rank for the topics your customers search for.",
    ],
    capabilities: [
      "Draft and publish workflow",
      "Cover image upload per post",
      "SEO title and meta description fields",
      "Categories and tags for organisation",
      "Public listing on your storefront",
      "Unique slug URL per article",
      "Linked from your main storefront navigation",
    ],
    whoItsFor: [
      "Businesses investing in local SEO and trust content",
      "Brands sharing tips, updates, and case studies",
      "Storefronts that want more than a product grid",
    ],
    connectsWith: ["marketplace", "marketing", "ai"],
  },
  {
    slug: "ai",
    name: "AI Assistant",
    tagline: "Draft faster, understand your numbers",
    category: "finance",
    tier: "paid",
    icon: Bot,
    image: homeImages.features.analytics,
    imageAlt: "Modufy AI assistant analytics",

    seo: {
      title: "AI Assistant for Business Operations",
      description:
        "Modufy AI drafts invoice lines, categorises expenses, explains P&L in plain language, and powers an assist chat — tenant-scoped with usage budgets.",
      keywords: ["AI for business", "invoice drafting AI", "expense categorisation", "business assistant"],
    },
    heroTitle: "Less admin. Clearer decisions.",
    heroDescription:
      "AI helps you draft invoice lines from plain English, summarise your day, explain financial reports, and answer questions about your business data.",
    overview: [
      "AI sits alongside your modules — it never auto-posts financial records without your review.",
      "Usage is tenant-scoped with monthly budgets. Bring your own Anthropic key if you prefer.",
    ],
    capabilities: [
      "Draft invoice line items from natural language",
      "Suggest expense categories on new entries",
      "Daily briefing from sales and attention data",
      "Customer call briefs from history and balance",
      "Plain-language P&L explanations",
      "Multi-turn assist chat with business context",
      "Enable/disable and budget controls per business",
    ],
    whoItsFor: [
      "Busy owners who want faster document creation",
      "Teams new to financial reports needing plain summaries",
      "Businesses experimenting with AI without separate tools",
    ],
    connectsWith: ["core", "invoices", "accounts", "blog", "inventory"],
  },
];

export const moduleCategoryMeta: Record<
  ModuleCategoryId,
  { label: string; description: string; icon: LucideIcon }
> = {
  revenue: {
    label: "Grow revenue",
    description: "Win deals, bill faster, and keep customers coming back.",
    icon: BarChart3,
  },
  operations: {
    label: "Run operations",
    description: "Stock, orders, and day-to-day work — without the chaos.",
    icon: Package,
  },
  engage: {
    label: "Engage customers",
    description: "Stay close to clients with messaging and scheduling built in.",
    icon: MessageSquare,
  },
  finance: {
    label: "Control finances",
    description: "Books, reports, and tax-ready records for growing teams.",
    icon: Wallet,
  },
};

export function getModuleBySlug(slug: string): ModufyModule | undefined {
  return modufyModules.find((module) => module.slug === slug);
}

export function getModulesByCategory(category: ModuleCategoryId): ModufyModule[] {
  return modufyModules.filter((module) => module.category === category);
}

export const moduleCategoryOrder: ModuleCategoryId[] = [
  "revenue",
  "operations",
  "engage",
  "finance",
];
