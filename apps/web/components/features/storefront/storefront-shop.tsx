"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PublicProduct, PublicVariant } from "@/types/api";
import { StorefrontProductCard } from "./storefront-product-card";
import { SfLeftDrawerPanel, SfShopFiltersBackdrop, SfStagger, SfStaggerItem } from "./storefront-motion";
import { effectivePrice, fmt } from "./storefront-utils";

const PAGE_SIZE = 9;

function countByCategory(products: PublicProduct[]) {
  const map = new Map<string, number>();
  for (const p of products) {
    const cat = p.category?.trim() || "Other";
    map.set(cat, (map.get(cat) ?? 0) + 1);
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

function countByTag(products: PublicProduct[]) {
  const map = new Map<string, number>();
  for (const p of products) {
    for (const t of p.tags ?? []) {
      const tag = t.trim();
      if (tag) map.set(tag, (map.get(tag) ?? 0) + 1);
    }
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12);
}

export function StorefrontShop({
  products,
  accent,
  currency,
  title,
  onAdd,
}: {
  products: PublicProduct[];
  accent: string;
  currency: string;
  title: string;
  onAdd: (product: PublicProduct, variant?: PublicVariant) => void;
}) {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("q") ?? "";
  const initialCategory = searchParams.get("category") ?? "";

  const [search, setSearch] = useState(initialSearch);
  const [selectedCats, setSelectedCats] = useState<Set<string>>(() => {
    if (!initialCategory) return new Set();
    return new Set([initialCategory]);
  });
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mobileFiltersOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileFiltersOpen]);

  const priceBounds = useMemo(() => {
    const prices = products.map((p) => effectivePrice(p));
    if (prices.length === 0) return { min: 0, max: 1000 };
    return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
  }, [products]);

  const [priceMin, setPriceMin] = useState<number | "">("");
  const [priceMax, setPriceMax] = useState<number | "">("");

  const categories = useMemo(() => countByCategory(products), [products]);
  const tags = useMemo(() => countByTag(products), [products]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const min = priceMin === "" ? priceBounds.min : priceMin;
    const max = priceMax === "" ? priceBounds.max : priceMax;

    return products.filter((p) => {
      if (selectedCats.size > 0) {
        const cat = p.category?.trim() || "Other";
        if (!selectedCats.has(cat)) return false;
      }
      if (selectedTags.size > 0) {
        const pTags = p.tags ?? [];
        if (!pTags.some((t) => selectedTags.has(t))) return false;
      }
      const price = effectivePrice(p);
      if (price < min || price > max) return false;
      if (q) {
        const inName = p.name.toLowerCase().includes(q);
        const inTags = (p.tags ?? []).some((t) => t.toLowerCase().includes(q));
        const inCat = (p.category ?? "").toLowerCase().includes(q);
        if (!inName && !inTags && !inCat) return false;
      }
      return true;
    });
  }, [products, search, selectedCats, selectedTags, priceMin, priceMax, priceBounds]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function toggleCat(cat: string) {
    setSelectedCats((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
    setPage(1);
  }

  function toggleTag(tag: string) {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
    setPage(1);
  }

  function clearFilters() {
    setSelectedCats(new Set());
    setSelectedTags(new Set());
    setPriceMin("");
    setPriceMax("");
    setSearch("");
    setPage(1);
  }

  const sidebar = (
    <aside className="storefront-shop-sidebar">
      {tags.length > 0 && (
        <div className="storefront-filter-card">
          <div className="storefront-filter-header">
            <h3>Popular Tags</h3>
          </div>
          <div className="storefront-filter-body storefront-filter-list">
            {tags.map(([tag, count]) => (
              <label key={tag} className="storefront-filter-row">
                <input
                  type="checkbox"
                  checked={selectedTags.has(tag)}
                  onChange={() => toggleTag(tag)}
                  className="storefront-filter-check"
                />
                <span>{tag}</span>
                <span className="storefront-filter-count" style={{ color: accent }}>
                  {count}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="storefront-filter-card">
        <div className="storefront-filter-header">
          <h3>Categories</h3>
        </div>
        <div className="storefront-filter-body storefront-filter-list">
          <label className="storefront-filter-row">
            <input
              type="checkbox"
              checked={selectedCats.size === 0}
              onChange={() => {
                setSelectedCats(new Set());
                setPage(1);
              }}
              className="storefront-filter-check"
            />
            <span>All Categories</span>
            <span className="storefront-filter-count" style={{ color: accent }}>
              {products.length}
            </span>
          </label>
          {categories.map(([cat, count]) => (
            <label key={cat} className="storefront-filter-row">
              <input
                type="checkbox"
                checked={selectedCats.has(cat)}
                onChange={() => toggleCat(cat)}
                className="storefront-filter-check"
              />
              <span>{cat}</span>
              <span className="storefront-filter-count" style={{ color: accent }}>
                {count}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="storefront-filter-card">
        <div className="storefront-filter-header">
          <h3>Price Range</h3>
        </div>
        <div className="storefront-filter-body">
          <div className="storefront-price-inputs">
            <input
              type="number"
              min={priceBounds.min}
              max={priceBounds.max}
              placeholder={String(priceBounds.min)}
              value={priceMin}
              onChange={(e) => {
                setPriceMin(e.target.value === "" ? "" : Number(e.target.value));
                setPage(1);
              }}
              className="storefront-price-input"
            />
            <span>to</span>
            <input
              type="number"
              min={priceBounds.min}
              max={priceBounds.max}
              placeholder={String(priceBounds.max)}
              value={priceMax}
              onChange={(e) => {
                setPriceMax(e.target.value === "" ? "" : Number(e.target.value));
                setPage(1);
              }}
              className="storefront-price-input"
            />
          </div>
          <p className="storefront-price-hint">
            {fmt(priceBounds.min, currency)} – {fmt(priceBounds.max, currency)}
          </p>
        </div>
      </div>

      <button type="button" onClick={clearFilters} className="storefront-filter-apply" style={{ background: accent }}>
        Clear filters
      </button>
    </aside>
  );

  return (
    <section id="shop" className="storefront-section storefront-shop">
      {title ? (
        <div className="storefront-shop-heading">
          <div>
            <p className="storefront-shop-kicker">Shop</p>
            <h2 className="storefront-section-title storefront-shop-title">{title}</h2>
          </div>
        </div>
      ) : null}

      <div className="sf-shop-toolbar">
        <div className="storefront-shop-search-row">
          <Search className="storefront-shop-search-icon h-5 w-5" />
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search products…"
          />
        </div>
        <button
          type="button"
          className="storefront-shop-filters-toggle"
          onClick={() => setMobileFiltersOpen(true)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>
      </div>

      {mounted
        ? createPortal(
            <>
              <SfShopFiltersBackdrop
                open={mobileFiltersOpen}
                onClose={() => setMobileFiltersOpen(false)}
              />
              <SfLeftDrawerPanel
                open={mobileFiltersOpen}
                className="sf-shop-filters-drawer"
                ariaLabel="Shop filters"
              >
                <div className="sf-shop-filters-drawer-head">
                  <div>
                    <p className="sf-shop-filters-kicker">Shop</p>
                    <strong>Filters</strong>
                  </div>
                  <button
                    type="button"
                    className="sf-shop-filters-close"
                    aria-label="Close filters"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="sf-shop-filters-drawer-body">{sidebar}</div>
                <div className="sf-shop-filters-drawer-foot">
                  <button
                    type="button"
                    className="sf-shop-filters-show"
                    style={{ background: accent }}
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    Show {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                  </button>
                </div>
              </SfLeftDrawerPanel>
            </>,
            document.body
          )
        : null}

      <div className="storefront-shop-layout">
        <div className="storefront-shop-sidebar-wrap">{sidebar}</div>

        <div className="storefront-shop-main">
          {pageItems.length === 0 ? (
            <p className="storefront-shop-empty">No products match your filters.</p>
          ) : (
            <SfStagger key={`${safePage}-${search}-${[...selectedCats].join()}`} className="storefront-products-grid">
              {pageItems.map((p) => (
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
          )}

          {filtered.length > 0 && (
            <div className="storefront-shop-pagination">
              <p className="storefront-shop-results">
                Showing <strong>{pageItems.length}</strong> of <strong>{filtered.length}</strong> results
              </p>
              {totalPages > 1 && (
                <nav className="storefront-pagination" aria-label="Product pages">
                  <button
                    type="button"
                    disabled={safePage <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="storefront-page-btn"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setPage(n)}
                      className={cn("storefront-page-btn", n === safePage && "is-active")}
                      style={n === safePage ? { background: accent, borderColor: accent, color: "white" } : undefined}
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    type="button"
                    disabled={safePage >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="storefront-page-btn"
                  >
                    Next
                  </button>
                </nav>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
