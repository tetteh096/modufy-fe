"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Building2, Package, LifeBuoy, CalendarClock, UserPlus, Ban, ArrowRight,
} from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { PageHeader } from "@/components/shared/page-header";
import { SectionLoader } from "@/components/shared/page-loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/businesses", label: "All businesses" },
  { href: "/tickets", label: "Support tickets" },
  { href: "/demos", label: "Demo requests" },
  { href: "/audit", label: "Audit log" },
];

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => adminApi.dashboard(),
  });

  const cards = data
    ? [
        { label: "Total businesses", value: data.total_businesses, icon: Building2, href: "/businesses" },
        { label: "With paid modules", value: data.businesses_with_modules, icon: Package, href: "/businesses" },
        { label: "Open tickets", value: data.open_tickets, icon: LifeBuoy, href: "/tickets" },
        { label: "New demo requests", value: data.new_demo_requests, icon: CalendarClock, href: "/demos" },
        { label: "Signups (7 days)", value: data.new_signups_7d, icon: UserPlus, href: "/businesses" },
        { label: "Suspended", value: data.suspended_businesses, icon: Ban, href: "/businesses" },
      ]
    : [];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Platform overview — businesses, support, and growth."
      />

      {isLoading ? (
        <SectionLoader className="py-16" />
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {cards.map(({ label, value, icon: Icon, href }) => (
              <Link key={label} href={href}>
                <Card className="hover:bg-muted/40 transition-colors h-full">
                  <CardHeader className="pb-1 pt-4 px-4 flex flex-row items-center justify-between">
                    <CardTitle className="text-xs font-medium text-muted-foreground">{label}</CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="pb-4 px-4">
                    <p className="text-3xl font-bold">{value}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick links</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {links.map(({ href, label }) => (
                <Button key={href} variant="outline" size="sm" render={<Link href={href} />}>
                  {label}
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
