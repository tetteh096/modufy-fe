"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  MessageSquare,
  Calendar,
  Mail,
  FileText,
  Users,
  BarChart3,
  Layers,
  Search,
  Bell,
  Grid3x3,
  Settings,
  Moon,
  ChevronDown,
  CalendarRange,
  ShoppingBag,
  TrendingUp,
  TrendingDown,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_MAIN = [
  { label: "Dashboard", href: "#", icon: LayoutDashboard, active: true, badge: "5" },
  { label: "Chat", href: "#", icon: MessageSquare },
  { label: "Calendar", href: "#", icon: Calendar },
  { label: "Email", href: "#", icon: Mail },
  { label: "Pages", href: "#", icon: FileText },
  { label: "Team", href: "#", icon: Users },
];

const NAV_APPS = [
  { label: "Analytics", href: "#", icon: BarChart3 },
  { label: "Components", href: "#", icon: Layers },
];

const METRICS = [
  { title: "TOTAL ORDERS", value: "687.3k", trend: "+9.19%", up: true, icon: ShoppingBag },
  { title: "TOTAL RETURNS", value: "9.62k", trend: "-7.11%", up: false, icon: TrendingDown },
  { title: "AVG. SALES", value: "$387.99", trend: "+12.5%", up: true, icon: TrendingUp },
  { title: "TOTAL SALES", value: "$892.1k", trend: "+3.2%", up: true, icon: BarChart3 },
];

const RECENT_ORDERS = [
  { name: "Marco Shoes", price: "$29.99", qty: "x1", status: "Sold" as const },
  { name: "High Waist Tshirt", price: "$9.99", qty: "x2", status: "Return" as const },
  { name: "Combed Cotton", price: "$44.00", qty: "x1", status: "Sold" as const },
  { name: "Outdoor Hat", price: "$18.50", qty: "x1", status: "Sold" as const },
];

const ACTIVITY = [
  { title: "Pages publishes the site", time: "Today 10:30 am" },
  { title: "Dhanoo sorts the product list", time: "Today 9:15 am" },
  { title: "Team adds a new export rule", time: "Yesterday 4:20 pm" },
];

function BoronLogo() {
  return (
    <div className="flex items-center gap-2">
      <span
        className="flex h-9 w-9 items-center justify-center rounded-[var(--boron-radius-md)] border-2 border-[var(--boron-neutral-900)] bg-[var(--boron-accent)] text-xs font-bold text-[var(--boron-neutral-100)] shadow-[var(--boron-shadow-brutal-sm)]"
        aria-hidden
      >
        B
      </span>
      <span className="text-lg font-bold tracking-wide text-[var(--boron-neutral-100)]">
        BORON
      </span>
    </div>
  );
}

function MetricCard({
  title,
  value,
  trend,
  up,
  icon: Icon,
}: (typeof METRICS)[number]) {
  return (
    <article className="boron-card flex flex-col gap-[var(--boron-space-7)] p-[var(--boron-space-7)]">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--boron-neutral-400)]">
          {title}
        </p>
        <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[var(--boron-neutral-900)] bg-[var(--boron-secondary)]">
          <Icon className="h-4 w-4 text-[var(--boron-neutral-900)]" strokeWidth={2} />
        </span>
      </div>
      <p className="text-3xl font-bold leading-none">{value}</p>
      <p
        className={cn(
          "text-sm font-medium",
          up ? "text-[var(--boron-trend-up)]" : "text-[var(--boron-trend-down)]"
        )}
      >
        {trend}
      </p>
    </article>
  );
}

function TrafficChart() {
  const rings = [88, 72, 56, 40];
  return (
    <div className="boron-card p-[var(--boron-space-7)]">
      <h2 className="mb-[var(--boron-space-7)] text-sm font-bold uppercase">
        Top traffic by source
      </h2>
      <div className="relative mx-auto flex aspect-square max-w-[236px] items-center justify-center">
        {rings.map((size, i) => (
          <span
            key={size}
            className="absolute rounded-full border-2 border-[var(--boron-neutral-900)]"
            style={{
              width: `${size}%`,
              height: `${size}%`,
              opacity: 1 - i * 0.15,
              backgroundColor:
                i % 2 === 0 ? "var(--boron-primary)" : "var(--boron-accent)",
            }}
          />
        ))}
        <span className="relative z-10 text-center text-xs font-medium text-[var(--boron-neutral-600)]">
          Direct · Social · Email
        </span>
      </div>
    </div>
  );
}

function OverviewChart() {
  const bars = [40, 65, 45, 80, 55, 70, 50, 90, 60, 75, 48, 85];
  return (
    <div className="boron-card flex flex-col p-[var(--boron-space-7)] lg:col-span-2">
      <div className="mb-[var(--boron-space-7)] flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-sm font-bold uppercase">Overview</h2>
        <div className="flex flex-wrap gap-[var(--boron-space-7)] text-xs font-medium text-[var(--boron-neutral-400)]">
          {["Revenue", "Expenses", "Investment", "Savings"].map((label) => (
            <span key={label} className="flex items-center gap-1">
              <span
                className="h-2 w-2 rounded-full border border-[var(--boron-neutral-900)]"
                style={{
                  backgroundColor:
                    label === "Revenue"
                      ? "var(--boron-primary)"
                      : label === "Expenses"
                        ? "var(--boron-trend-down)"
                        : label === "Investment"
                          ? "var(--boron-accent)"
                          : "var(--boron-secondary)",
                }}
              />
              {label}
            </span>
          ))}
        </div>
      </div>
      <div className="relative flex h-[200px] items-end gap-1 border-b-2 border-[var(--boron-neutral-900)] pb-1">
        {bars.map((h, i) => (
          <div key={i} className="flex flex-1 flex-col justify-end gap-0.5">
            <div
              className="w-full rounded-t-[var(--boron-radius-sm)] border-2 border-b-0 border-[var(--boron-neutral-900)] bg-[var(--boron-primary)] opacity-35"
              style={{ height: `${h}%` }}
            />
          </div>
        ))}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          <polyline
            fill="none"
            stroke="var(--boron-trend-down)"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            points="0,70 12,55 25,60 38,40 50,50 62,35 75,45 88,30 100,25"
          />
        </svg>
      </div>
    </div>
  );
}

export function BoronDashboardPreview() {
  return (
    <div className="boron-root min-h-screen font-[family-name:var(--font-boron)]">
      <div className="flex min-h-screen">
        <aside className="hidden w-[236px] shrink-0 flex-col bg-[var(--boron-neutral-900)] px-[var(--boron-space-7)] py-[var(--boron-space-8)] text-[var(--boron-neutral-300)] md:flex">
          <BoronLogo />
          <nav className="mt-[var(--boron-space-9)] flex flex-1 flex-col gap-6 overflow-y-auto">
            <div>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--boron-neutral-200)]">
                Menu
              </p>
              <ul className="space-y-1">
                {NAV_MAIN.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-[var(--boron-radius-pill)] px-3 py-2 text-sm font-medium transition-colors duration-[var(--boron-duration-fast)]",
                        item.active
                          ? "bg-[var(--boron-neutral-100)] text-[var(--boron-neutral-900)]"
                          : "text-[var(--boron-neutral-300)] hover:text-[var(--boron-neutral-100)]"
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" strokeWidth={2} />
                      {item.label}
                      {item.badge && (
                        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--boron-primary)] px-1 text-[10px] font-bold text-[var(--boron-neutral-100)]">
                          {item.badge}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--boron-neutral-200)]">
                Apps &amp; pages
              </p>
              <ul className="space-y-1">
                {NAV_APPS.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="flex items-center gap-3 rounded-[var(--boron-radius-pill)] px-3 py-2 text-sm font-medium text-[var(--boron-neutral-300)] hover:text-[var(--boron-neutral-100)]"
                    >
                      <item.icon className="h-4 w-4" strokeWidth={2} />
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-[70px] shrink-0 items-center gap-3 border-b-2 border-[var(--boron-neutral-900)] bg-[var(--boron-neutral-100)] px-[var(--boron-space-7)]">
            <button
              type="button"
              className="boron-btn boron-btn-primary flex h-10 w-10 items-center justify-center"
              aria-label="Toggle menu"
            >
              <LayoutDashboard className="h-4 w-4" />
            </button>
            <div className="boron-card flex flex-1 max-w-md items-center gap-2 border-2 px-3 py-2 shadow-[var(--boron-shadow-brutal-sm)]">
              <Search className="h-4 w-4 text-[var(--boron-neutral-400)]" />
              <span className="flex-1 text-sm text-[var(--boron-neutral-400)]">Search pages…</span>
              <kbd className="rounded-[var(--boron-radius-sm)] border border-[var(--boron-neutral-900)] px-1.5 py-0.5 text-[10px] font-medium">
                ⌘K
              </kbd>
            </div>
            <button type="button" className="boron-btn hidden px-3 py-2 text-sm font-semibold sm:block">
              Pages
              <ChevronDown className="ml-1 inline h-3 w-3" />
            </button>
            <div className="ml-auto flex items-center gap-1">
              {[Bell, Grid3x3, Settings, Moon].map((Icon, i) => (
                <button
                  key={i}
                  type="button"
                  className="boron-btn flex h-9 w-9 items-center justify-center"
                  aria-label="Utility"
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
              <button
                type="button"
                className="boron-btn ml-1 flex items-center gap-2 px-2 py-1.5 text-sm font-semibold"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[var(--boron-neutral-900)] bg-[var(--boron-accent)] text-xs text-[var(--boron-neutral-100)]">
                  DK
                </span>
                Dhanoo K.
                <ChevronDown className="h-3 w-3" />
              </button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-[var(--boron-space-7)] md:p-[var(--boron-space-8)]">
            <div className="mb-[var(--boron-space-7)] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="boron-btn flex items-center gap-1 px-3 py-2 text-xs font-semibold text-[var(--boron-neutral-600)]"
                >
                  <ArrowLeft className="h-3 w-3" />
                  Back to BizOS
                </Link>
                <h1 className="text-2xl font-bold uppercase tracking-tight">Dashboard</h1>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button type="button" className="boron-btn px-4 py-2 text-sm font-semibold">
                  Sort
                </button>
                <button
                  type="button"
                  className="boron-btn flex items-center gap-2 px-4 py-2 text-sm font-semibold"
                >
                  <CalendarRange className="h-4 w-4" />
                  01 May to 31 May
                </button>
              </div>
            </div>

            <div className="grid gap-[var(--boron-space-7)] sm:grid-cols-2 xl:grid-cols-4">
              {METRICS.map((m) => (
                <MetricCard key={m.title} {...m} />
              ))}
            </div>

            <div className="mt-[var(--boron-space-7)] grid gap-[var(--boron-space-7)] lg:grid-cols-3">
              <TrafficChart />
              <OverviewChart />
              <div className="flex flex-col gap-[var(--boron-space-7)]">
                <div className="boron-card flex flex-col p-[var(--boron-space-7)]">
                  <h2 className="mb-4 text-sm font-bold uppercase">Recent orders</h2>
                  <ul className="space-y-4">
                    {RECENT_ORDERS.map((order) => (
                      <li key={order.name} className="flex items-center gap-3">
                        <span className="h-10 w-10 shrink-0 rounded-[var(--boron-radius-md)] border-2 border-[var(--boron-neutral-900)] bg-[var(--boron-secondary)]" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">{order.name}</p>
                          <p className="text-xs text-[var(--boron-neutral-400)]">
                            {order.price} · {order.qty}
                          </p>
                        </div>
                        <span
                          className={cn(
                            "shrink-0 px-2 py-0.5 text-[10px] font-bold uppercase",
                            order.status === "Sold" ? "boron-badge-sold" : "boron-badge-return"
                          )}
                        >
                          {order.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className="boron-btn mt-4 w-full py-2 text-center text-sm font-semibold"
                  >
                    View all
                  </button>
                </div>
                <div className="boron-card p-[var(--boron-space-7)]">
                  <h2 className="mb-4 text-sm font-bold uppercase">Recent activity</h2>
                  <ul className="space-y-4">
                    {ACTIVITY.map((item) => (
                      <li key={item.title} className="border-l-2 border-[var(--boron-primary)] pl-3">
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="text-xs text-[var(--boron-neutral-400)]">{item.time}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
