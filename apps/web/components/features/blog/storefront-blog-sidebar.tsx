"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  FolderOpen,
  Mail,
  Phone,
  Search,
  Tag,
} from "lucide-react";
import { formatDate } from "@/lib/format";
import { resolveBlogCoverSrc } from "@/lib/blog-cover";
import { resolveMediaUrl } from "@/lib/media-url";
import type {
  PublicBlogCategoryCount,
  PublicBlogPostSummary,
  PublicStorefront,
} from "@/types/api";

type StorefrontBlogSidebarProps = {
  posts: PublicBlogPostSummary[];
  basePath: string;
  accent: string;
  businessName: string;
  sf: PublicStorefront;
  categories?: PublicBlogCategoryCount[];
  tags?: string[];
  currentCategory?: string;
  currentQuery?: string;
  currentSlug?: string;
  blogListPath?: string;
};

export function StorefrontBlogSidebar({
  posts,
  basePath,
  accent,
  businessName,
  sf,
  categories = [],
  tags = [],
  currentCategory,
  currentQuery,
  currentSlug,
  blogListPath,
}: StorefrontBlogSidebarProps) {
  const router = useRouter();
  const listPath = blogListPath ?? `${basePath}/blog`;
  const [search, setSearch] = useState(currentQuery ?? "");
  const recent = posts.filter((p) => p.slug !== currentSlug).slice(0, 4);

  const buildListHref = (params: { q?: string; category?: string }) => {
    const qs = new URLSearchParams();
    if (params.q) qs.set("q", params.q);
    if (params.category) qs.set("category", params.category);
    const query = qs.toString();
    return query ? `${listPath}?${query}` : listPath;
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = search.trim();
    router.push(
      buildListHref({
        q: trimmed || undefined,
        category: currentCategory || undefined,
      }),
    );
  };

  const phone = sf.show_phone && sf.phone ? sf.phone : null;
  const whatsapp = sf.show_whatsapp && sf.whatsapp ? sf.whatsapp : null;
  const email = sf.show_email && sf.email ? sf.email : null;

  return (
    <aside className="sf-blog-sidebar">
      <div className="sf-blog-sidebar-block">
        <h3>
          <Search className="h-4 w-4" style={{ color: accent }} />
          Search
        </h3>
        <form onSubmit={handleSearch} className="sf-blog-sidebar-search">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search articles…"
            aria-label="Search articles"
          />
          <button type="submit" aria-label="Submit search">
            <Search className="h-4 w-4" />
          </button>
        </form>
        {currentQuery ? (
          <p className="sf-blog-sidebar-filter-note">
            Filtering by: <strong>&ldquo;{currentQuery}&rdquo;</strong>
          </p>
        ) : null}
      </div>

      {categories.length > 0 ? (
        <div className="sf-blog-sidebar-block">
          <h3>
            <FolderOpen className="h-4 w-4" style={{ color: accent }} />
            Categories
          </h3>
          <ul className="sf-blog-sidebar-categories">
            <li>
              <Link
                href={buildListHref({ q: currentQuery || undefined })}
                className={`sf-blog-sidebar-category${!currentCategory ? " is-active" : ""}`}
                style={
                  !currentCategory
                    ? {
                        background: `color-mix(in srgb, ${accent} 12%, white)`,
                        color: accent,
                      }
                    : undefined
                }
              >
                All articles
              </Link>
            </li>
            {categories.map((category) => {
              const isActive = currentCategory === category.name;
              return (
                <li key={category.name}>
                  <Link
                    href={buildListHref({
                      category: category.name,
                      q: currentQuery || undefined,
                    })}
                    className={`sf-blog-sidebar-category${isActive ? " is-active" : ""}`}
                    style={
                      isActive
                        ? {
                            background: `color-mix(in srgb, ${accent} 12%, white)`,
                            color: accent,
                          }
                        : undefined
                    }
                  >
                    <span>{category.name}</span>
                    <span
                      className="sf-blog-sidebar-category-count"
                      style={
                        isActive
                          ? { background: accent, color: "#fff" }
                          : undefined
                      }
                    >
                      {category.count}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      {recent.length > 0 ? (
        <div className="sf-blog-sidebar-block">
          <h3>
            <Calendar className="h-4 w-4" style={{ color: accent }} />
            Recent posts
          </h3>
          <ul className="sf-blog-sidebar-list">
            {recent.map((post) => {
              const cover = resolveMediaUrl(
                resolveBlogCoverSrc(post.featured_image_url, post.slug || post.id),
              );
              return (
                <li key={post.id}>
                  <Link href={`${basePath}/blog/${post.slug}`} className="sf-blog-sidebar-item">
                    <span className="sf-blog-sidebar-thumb">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={cover} alt="" loading="lazy" />
                    </span>
                    <span className="sf-blog-sidebar-copy">
                      {post.category ? (
                        <span className="sf-blog-sidebar-item-category" style={{ color: accent }}>
                          <FolderOpen className="h-3 w-3" />
                          {post.category}
                        </span>
                      ) : null}
                      <strong>{post.title}</strong>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      {(phone || whatsapp || email) ? (
        <div className="sf-blog-sidebar-block sf-blog-sidebar-help" style={{ borderColor: accent }}>
          <h3>Need help? Call us</h3>
          {phone ? (
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="sf-blog-sidebar-help-icon"
              style={{ background: accent }}
              aria-label={`Call ${businessName}`}
            >
              <Phone className="h-5 w-5" />
            </a>
          ) : null}
          <p>Speak with {businessName} for personalised guidance.</p>
          {phone ? (
            <a href={`tel:${phone.replace(/\s/g, "")}`} className="sf-blog-sidebar-help-link">
              {phone}
            </a>
          ) : null}
          {whatsapp ? (
            <a
              href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
              className="sf-blog-sidebar-help-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp · {whatsapp}
            </a>
          ) : null}
        </div>
      ) : null}

      {tags.length > 0 ? (
        <div className="sf-blog-sidebar-block">
          <h3>
            <Tag className="h-4 w-4" style={{ color: accent }} />
            Tags
          </h3>
          <ul className="sf-blog-sidebar-tags">
            {tags.map((tag) => (
              <li key={tag}>
                <Link
                  href={buildListHref({
                    q: tag,
                    category: currentCategory || undefined,
                  })}
                  className="sf-blog-sidebar-tag"
                >
                  {tag}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {email ? (
        <div className="sf-blog-sidebar-block sf-blog-sidebar-newsletter">
          <h3>Stay updated</h3>
          <p>Get news and tips from {businessName}.</p>
          <a href={`mailto:${email}`} className="sf-blog-sidebar-newsletter-btn" style={{ color: accent }}>
            <Mail className="h-4 w-4" />
            {email}
          </a>
        </div>
      ) : null}
    </aside>
  );
}
