"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Search, Sparkles, X } from "lucide-react";
import type { PublicProduct, PublicVariant } from "@/types/api";
import { buildCatalog, categoryShopUrl } from "./storefront-catalog";
import { StorefrontProductCard } from "./storefront-product-card";
import { searchProducts } from "./storefront-utils";
import { useStorefront } from "./storefront-context";
import { SfStagger, SfStaggerItem } from "./storefront-motion";

export function StorefrontSearch({
  products,
  accent,
  currency,
  businessName,
  onAdd,
}: {
  products: PublicProduct[];
  accent: string;
  currency: string;
  businessName: string;
  onAdd: (product: PublicProduct, variant?: PublicVariant) => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { basePath } = useStorefront();
  const initialQ = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQ);

  useEffect(() => {
    setQuery(initialQ);
  }, [initialQ]);

  const catalog = useMemo(() => buildCatalog(products), [products]);
  const results = useMemo(() => searchProducts(products, query), [products, query]);
  const trimmed = query.trim();
  const hasQuery = trimmed.length > 0;

  const suggestions = useMemo(() => {
    const cats = catalog.slice(0, 6).map((c) => c.name);
    const names = products.slice(0, 6).map((p) => p.name);
    return [...new Set([...cats, ...names])].slice(0, 8);
  }, [catalog, products]);

  function applySearch(next: string) {
    const q = next.trim();
    setQuery(next);
    const url = q ? `${basePath}/search?q=${encodeURIComponent(q)}` : `${basePath}/search`;
    router.replace(url, { scroll: false });
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    applySearch(query);
  }

  return (
    <section className="sf-search-page">
      <div className="sf-search-hero" style={{ ["--sf-search-accent" as string]: accent }}>
        <div className="sf-search-hero-glow" aria-hidden />
        <span className="sf-search-eyebrow">
          <Sparkles className="h-4 w-4" />
          Search {businessName}
        </span>
        <h1>Find what you&apos;re looking for</h1>
        <p>Browse products, categories, and tags across the store.</p>

        <form className="sf-search-form" onSubmit={onSubmit}>
          <Search className="sf-search-form-icon h-5 w-5" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              applySearch(e.target.value);
            }}
            placeholder="Search products, categories, tags…"
            autoFocus
          />
          {hasQuery ? (
            <button
              type="button"
              className="sf-search-clear"
              aria-label="Clear search"
              onClick={() => applySearch("")}
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
          <button type="submit" className="sf-search-submit" style={{ background: accent }}>
            Search
          </button>
        </form>
      </div>

      <div className="sf-search-body">
        {!hasQuery ? (
          <div className="sf-search-suggestions">
            <p className="sf-search-suggestions-label">Popular searches</p>
            <div className="sf-search-chips">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="sf-search-chip"
                  onClick={() => applySearch(s)}
                >
                  {s}
                </button>
              ))}
            </div>
            {catalog.length > 0 ? (
              <div className="sf-search-categories">
                <p className="sf-search-suggestions-label">Shop by category</p>
                <div className="sf-search-category-grid">
                  {catalog.map((cat) => (
                    <Link
                      key={cat.name}
                      href={categoryShopUrl(basePath, cat.name)}
                      className="sf-search-category-card"
                    >
                      <strong>{cat.name}</strong>
                      <span>{cat.count} items</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : results.length === 0 ? (
          <div className="sf-search-empty">
            <Search className="h-10 w-10" />
            <h2>No results for &ldquo;{trimmed}&rdquo;</h2>
            <p>Try a different keyword or browse the full catalog.</p>
            <Link href={`${basePath}/shop`} className="sf-btn sf-btn-solid" style={{ background: accent }}>
              Browse all products
            </Link>
          </div>
        ) : (
          <>
            <p className="sf-search-results-meta">
              <strong>{results.length}</strong> result{results.length !== 1 ? "s" : ""} for &ldquo;{trimmed}&rdquo;
            </p>
            <SfStagger key={trimmed} className="storefront-products-grid">
              {results.map((p) => (
                <SfStaggerItem key={p.id}>
                  <StorefrontProductCard
                    product={p}
                    accent={accent}
                    currency={currency}
                    onAdd={onAdd}
                  />
                </SfStaggerItem>
              ))}
            </SfStagger>
          </>
        )}
      </div>
    </section>
  );
}
