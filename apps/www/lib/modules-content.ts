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
    tagline: "Customers, sales, expenses, and team: included with every account",
    category: "revenue",
    tier: "core",
    icon: Users,
    image: homeImages.features.pipeline,
    imageAlt: "Modufy core dashboard on desktop and mobile",

    seo: {
      title: "Core Business Management Software for Growing Teams",
      description:
        "Modufy Core is included with every account: manage customers, record sales, track expenses, invite your team, and stay on top of alerts before you add a single paid module.",
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
      "Customers, sales, expenses, and team access: always on. Add paid modules later without starting over.",
    overview: [
      "Every Modufy account starts with Core, your customer book, daily sales, expense capture, notifications, and role-based team access.",
      "Paid modules plug into Core instead of replacing it. A POS sale, invoice payment, and storefront order all land in the same financial picture.",
    ],
    capabilities: [
      "Customer records with tags, balance, and full history",
      "Quick sales: cash, mobile money, and card",
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
        "Create branded invoices, send payment reminders, track invoice statuses, and sync every payment into your books with Modufy Invoicing.",
      keywords: [
        "invoicing software",
        "billing",
        "quotes",
        "payment tracking",
        "multi-currency invoices",
        "accounts sync",
      ],
    },
    heroTitle: "Bill professionally. Get paid faster.",
    heroDescription:
      "Create branded invoices, send reminders, and sync every payment straight into your books, from draft to paid.",
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
      "Automatic sync into Accounting & Finance",
      "Payment reminders and shareable invoice links",
    ],
    whoItsFor: [
      "B2B suppliers and wholesalers sending formal bills",
      "Freelancers and agencies converting quotes to invoices",
      "Growing teams that need clear payment tracking",
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
      "One catalog for products and services. Sell through POS, invoices, or storefront, stock updates in the same place.",
    overview: [
      "Define what you sell once. POS, invoices, and storefront all read the same catalog.",
      "Low-stock alerts and purchase orders keep restock ahead of stockouts.",
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
      title: "POS System: Point of Sale for Every Sale",
      description:
        "Modufy’s POS system for retail counters and service desks. Scan, sell, hold carts, run shift sessions, and keep inventory and books in sync.",
      keywords: [
        "POS system",
        "point of sale",
        "retail POS",
        "barcode checkout",
        "POS software",
        "Modufy POS",
      ],
    },
    heroTitle: "The point of sale for every sale",
    heroDescription:
      "From first sale to full scale: scan, sell, and receipt at the counter while Inventory, customers, and books stay in sync.",
    overview: [
      "Close sales at the counter and keep stock, customers, and books in sync, the way connected retail should work.",
      "Open shift sessions, park busy carts, send receipts, and deduct inventory automatically on every completed sale.",
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
      "Guests book from your storefront. Collect a deposit, send reminders, and auto-create an invoice when the session is done.",
    overview: [
      "Connect bookable services from Inventory to a live calendar your team runs every day.",
      "Guest booking needs only a name and phone: less friction, fewer no-shows with deposits and reminders.",
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
      title: "Online Storefront for Growing Businesses",
      description:
        "Customize and publish a branded Modufy storefront. Sync products from Inventory, take guest orders and enquiries, run promotions, and collect reviews, without building a website from scratch.",
      keywords: [
        "online storefront",
        "small business website",
        "sell online",
        "service booking page",
        "product catalog online",
        "Modufy storefront",
      ],
    },
    heroTitle: "Your vision. Your storefront, live.",
    heroDescription:
      "Customize branding, sync products from Inventory, and publish a public page to browse, book, and buy, without building a website from scratch.",
    overview: [
      "Storefront is your customer-facing page. It adapts to product businesses and service businesses from the same catalog you already manage.",
      "Promotions, enquiries, and reviews turn a simple catalog into a full commercial presence, without a separate website project.",
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
      "Retailers who want online orders without website complexity",
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
    heroTitle: "Unify your messaging. Reach customers who already know you.",
    heroDescription:
      "Segments from your customer book. SMS or email. Opt-outs and wallet tracking, without leaving Modufy.",
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
      "Salons sending offers and rebooking nudges",
      "Any team with a customer list ready to re-engage",
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
      "Sales, invoice payments, expenses, and stock movements can post to your ledger automatically. P&L and cash flow without re-keying.",
    overview: [
      "Accounts is Modufy’s financial layer: entries from Core and paid modules become real reports.",
      "Owners get readable dashboards; accountants get journals, adjustments, and export-friendly summaries.",
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
      "Draft, publish, and organise posts that live beside your products and bookings: with covers, tags, and SEO fields built in.",
    overview: [
      "Blog adds a content layer to your storefront: posts sit next to products and booking pages.",
      "SEO title and meta fields help each article rank for the topics customers search.",
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
        "Modufy AI drafts invoice lines, categorises expenses, explains P&L in plain language, and powers an assist chat: tenant-scoped with usage budgets.",
      keywords: ["AI for business", "invoice drafting AI", "expense categorisation", "business assistant"],
    },
    heroTitle: "Less admin. Clearer decisions.",
    heroDescription:
      "AI helps you draft invoice lines from plain English, summarise your day, explain financial reports, and answer questions about your business data.",
    overview: [
      "AI sits alongside your modules, it never auto-posts financial records without your review.",
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
    description: "Stock, orders, and day-to-day work, without the chaos.",
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
