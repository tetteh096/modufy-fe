"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "next/navigation";
import { CalendarDays, Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PublicService } from "@/types/api";
import { StorefrontServiceCard } from "./storefront-service-card";
import { SfLeftDrawerPanel, SfShopFiltersBackdrop, SfStagger, SfStaggerItem } from "./storefront-motion";
import { fmt } from "./storefront-utils";

const PAGE_SIZE = 9;

type DurationBucket = "any" | "short" | "medium" | "long";

function countByCategory(services: PublicService[]) {
  const map = new Map<string, number>();
  for (const s of services) {
    const cat = s.category?.trim() || "General";
    map.set(cat, (map.get(cat) ?? 0) + 1);
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

function countByTag(services: PublicService[]) {
  const map = new Map<string, number>();
  for (const s of services) {
    for (const t of s.tags ?? []) {
      const tag = t.trim();
      if (tag) map.set(tag, (map.get(tag) ?? 0) + 1);
    }
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12);
}

function matchesDuration(mins: number, bucket: DurationBucket) {
  if (bucket === "any") return true;
  if (bucket === "short") return mins > 0 && mins <= 30;
  if (bucket === "medium") return mins > 30 && mins <= 60;
  return mins > 60;
}

export function StorefrontServices({
  services,
  accent,
  currency,
}: {
  services: PublicService[];
  accent: string;
  currency: string;
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
  const [bookableOnly, setBookableOnly] = useState(false);
  const [durationBucket, setDurationBucket] = useState<DurationBucket>("any");
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
    const prices = services.map((s) => s.price);
    if (prices.length === 0) return { min: 0, max: 1000 };
    return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
  }, [services]);

  const [priceMin, setPriceMin] = useState<number | "">("");
  const [priceMax, setPriceMax] = useState<number | "">("");

  const categories = useMemo(() => countByCategory(services), [services]);
  const tags = useMemo(() => countByTag(services), [services]);
  const bookableCount = useMemo(() => services.filter((s) => s.is_bookable).length, [services]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const min = priceMin === "" ? priceBounds.min : priceMin;
    const max = priceMax === "" ? priceBounds.max : priceMax;

    return services.filter((s) => {
      if (bookableOnly && !s.is_bookable) return false;
      if (!matchesDuration(s.duration_mins, durationBucket)) return false;
      if (selectedCats.size > 0) {
        const cat = s.category?.trim() || "General";
        if (!selectedCats.has(cat)) return false;
      }
      if (selectedTags.size > 0) {
        const sTags = s.tags ?? [];
        if (!sTags.some((t) => selectedTags.has(t))) return false;
      }
      if (s.price < min || s.price > max) return false;
      if (q) {
        const inName = s.name.toLowerCase().includes(q);
        const inDesc = (s.description ?? "").toLowerCase().includes(q);
        const inTags = (s.tags ?? []).some((t) => t.toLowerCase().includes(q));
        const inCat = (s.category ?? "").toLowerCase().includes(q);
        if (!inName && !inDesc && !inTags && !inCat) return false;
      }
      return true;
    });
  }, [
    services,
    search,
    selectedCats,
    selectedTags,
    priceMin,
    priceMax,
    priceBounds,
    bookableOnly,
    durationBucket,
  ]);

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
    setBookableOnly(false);
    setDurationBucket("any");
    setPage(1);
  }

  const sidebar = (
    <aside className="storefront-shop-sidebar">
      {bookableCount > 0 ? (
        <div className="storefront-filter-card">
          <div className="storefront-filter-header">
            <h3>Booking</h3>
          </div>
          <div className="storefront-filter-body storefront-filter-list">
            <label className="storefront-filter-row">
              <input
                type="checkbox"
                checked={bookableOnly}
                onChange={(e) => {
                  setBookableOnly(e.target.checked);
                  setPage(1);
                }}
                className="storefront-filter-check"
              />
              <span>Bookable online</span>
              <span className="storefront-filter-count" style={{ color: accent }}>
                {bookableCount}
              </span>
            </label>
          </div>
        </div>
      ) : null}

      <div className="storefront-filter-card">
        <div className="storefront-filter-header">
          <h3>Duration</h3>
        </div>
        <div className="storefront-filter-body storefront-filter-list">
          {(
            [
              ["any", "Any length"],
              ["short", "Up to 30 min"],
              ["medium", "30 – 60 min"],
              ["long", "Over 1 hour"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="storefront-filter-row">
              <input
                type="radio"
                name="svc-duration"
                checked={durationBucket === key}
                onChange={() => {
                  setDurationBucket(key);
                  setPage(1);
                }}
                className="storefront-filter-check"
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>

      {tags.length > 0 ? (
        <div className="storefront-filter-card">
          <div className="storefront-filter-header">
            <h3>Tags</h3>
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
      ) : null}

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
            <span>All</span>
            <span className="storefront-filter-count" style={{ color: accent }}>
              {services.length}
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
          <h3>Price</h3>
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
    <section className="storefront-section storefront-shop sf-services-page">
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
            placeholder="Search services…"
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
              <SfShopFiltersBackdrop open={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)} />
              <SfLeftDrawerPanel
                open={mobileFiltersOpen}
                className="sf-shop-filters-drawer"
                ariaLabel="Service filters"
              >
                <div className="sf-shop-filters-drawer-head">
                  <div>
                    <p className="sf-shop-filters-kicker">Services</p>
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
            document.body,
          )
        : null}

      <div className="storefront-shop-layout">
        <div className="storefront-shop-sidebar-wrap">{sidebar}</div>

        <div className="storefront-shop-main">
          {pageItems.length === 0 ? (
            <p className="storefront-shop-empty">No services match your filters.</p>
          ) : (
            <SfStagger
              key={`${safePage}-${search}-${[...selectedCats].join()}`}
              className="storefront-products-grid sf-services-grid"
            >
              {pageItems.map((s) => (
                <SfStaggerItem key={s.id}>
                  <StorefrontServiceCard service={s} accent={accent} />
                </SfStaggerItem>
              ))}
            </SfStagger>
          )}

          {filtered.length > 0 ? (
            <div className="storefront-shop-pagination">
              <p className="storefront-shop-results">
                Showing <strong>{pageItems.length}</strong> of <strong>{filtered.length}</strong> services
              </p>
              {totalPages > 1 ? (
                <nav className="storefront-pagination" aria-label="Service pages">
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
                      style={
                        n === safePage ? { background: accent, borderColor: accent, color: "white" } : undefined
                      }
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
              ) : null}
            </div>
          ) : null}

          {bookableCount > 0 ? (
            <p className="sf-services-book-hint">
              <CalendarDays className="h-4 w-4" />
              {bookableCount} service{bookableCount !== 1 ? "s" : ""} available to book online
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
