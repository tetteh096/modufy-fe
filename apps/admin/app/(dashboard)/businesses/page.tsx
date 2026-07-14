"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Building2, ChevronRight, Globe, Package, Search } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface BusinessItem {
  id: string;
  name: string;
  slug: string;
  country: string;
  category: string;
  owner_email: string;
  modules_enabled: string[];
  verified: boolean;
  suspended: boolean;
  created_at: string;
}

function BusinessRow({ business }: { business: BusinessItem }) {
  return (
    <div className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/40">
      <Link href={`/businesses/${business.id}`} className="flex min-w-0 flex-1 items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
          {business.name.slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{business.name}</p>
          <div className="mt-0.5 flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Globe className="h-3 w-3 shrink-0" />
              {business.country}
            </span>
            {business.category && (
              <span className="text-xs text-muted-foreground">· {business.category}</span>
            )}
            <span className="truncate text-xs text-muted-foreground">· {business.owner_email}</span>
            {business.verified && (
              <Badge className="h-4 border-0 bg-green-500/10 px-1.5 text-[10px] text-green-700">
                verified
              </Badge>
            )}
            {business.suspended && (
              <Badge variant="destructive" className="h-4 px-1.5 text-[10px]">
                suspended
              </Badge>
            )}
          </div>
        </div>
      </Link>

      <div className="flex shrink-0 items-center gap-3">
        {business.modules_enabled.length > 0 ? (
          <Badge className="gap-1 border-0 bg-primary/10 text-xs text-primary hover:bg-primary/15">
            <Package className="h-3 w-3" />
            {business.modules_enabled.length} module{business.modules_enabled.length !== 1 ? "s" : ""}
          </Badge>
        ) : (
          <Badge variant="outline" className="text-xs text-muted-foreground">
            Core only
          </Badge>
        )}
        <span className="hidden text-xs text-muted-foreground lg:block">
          {new Date(business.created_at).toLocaleDateString()}
        </span>
        <Button
          size="sm"
          variant="outline"
          className="h-8 text-xs"
          render={<Link href={`/businesses/${business.id}/modules`} />}
        >
          Modules
        </Button>
        <Link
          href={`/businesses/${business.id}`}
          className="text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100"
        >
          Open workspace
        </Link>
        <Link href={`/businesses/${business.id}`}>
          <ChevronRight className="h-4 w-4 text-muted-foreground/40 transition-colors group-hover:text-muted-foreground" />
        </Link>
      </div>
    </div>
  );
}

function BusinessSkeleton() {
  return (
    <div className="flex items-center gap-4 px-5 py-4">
      <Skeleton className="h-10 w-10 rounded-lg" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="h-6 w-24 rounded-full" />
    </div>
  );
}

function BusinessesContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") ?? "";
  const [search, setSearch] = useState(initialSearch);

  useEffect(() => {
    setSearch(searchParams.get("search") ?? "");
  }, [searchParams]);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-businesses", search],
    queryFn: () => adminApi.businesses(search ? { search } : undefined),
  });

  const businesses = data?.businesses ?? [];
  const total = data?.total ?? 0;
  const withModules = businesses.filter((b) => b.modules_enabled.length > 0).length;

  return (
    <div>
      <PageHeader
        title="Businesses"
        description="Select a business to open its workspace — modules, team, SMS, AI, and more."
      />

      {!isLoading && total > 0 && (
        <div className="mb-6 grid grid-cols-3 gap-4">
          {[
            { label: "Total businesses", value: total },
            { label: "With paid modules", value: withModules },
            { label: "Core only", value: total - withModules },
          ].map(({ label, value }) => (
            <Card key={label}>
              <CardHeader className="px-4 pt-4 pb-1">
                <CardTitle className="text-xs font-medium text-muted-foreground">{label}</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <p className="text-2xl font-bold">{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          <div className="flex items-center gap-3 border-b px-5 py-3">
            <div className="relative max-w-xs flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search businesses…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 pl-9"
              />
            </div>
            {total > 0 && (
              <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                {search ? `${businesses.length} of ${total}` : `${total} total`}
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="divide-y">
              {Array.from({ length: 6 }).map((_, i) => (
                <BusinessSkeleton key={i} />
              ))}
            </div>
          ) : businesses.length === 0 ? (
            <EmptyState
              icon={<Building2 className="h-8 w-8" />}
              title={search ? "No businesses match" : "No businesses yet"}
              description={
                search
                  ? `No results for "${search}"`
                  : "Businesses will appear here once they sign up."
              }
            />
          ) : (
            <div className="divide-y">
              {businesses.map((b) => (
                <BusinessRow key={b.id} business={b} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function BusinessesPage() {
  return (
    <Suspense fallback={<div className="flex h-64 items-center justify-center"><Skeleton className="h-full w-full rounded-2xl" /></div>}>
      <BusinessesContent />
    </Suspense>
  );
}
