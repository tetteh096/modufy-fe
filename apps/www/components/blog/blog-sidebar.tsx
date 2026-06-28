"use client";

import Image from "next/image";
import Link from "next/link";
import { blogCategories, blogTags, recentPosts } from "@/lib/blog-content";
import { BlogPostLink } from "@/components/blog/blog-shared";

export function BlogSidebar() {
  return (
    <aside className="space-y-6 lg:sticky lg:top-24">
      <div className="rounded-2xl border border-border bg-card p-4">
        <form className="flex items-center gap-2" onSubmit={(e) => e.preventDefault()}>
          <input
            type="search"
            placeholder="Search..."
            className="h-11 flex-1 rounded-xl border border-border bg-background px-4 text-sm outline-none ring-primary/30 focus:ring-2"
          />
          <button
            type="submit"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground"
            aria-label="Search"
          >
            <Image src="/images/icon/search.svg" alt="" width={18} height={18} className="invert" />
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="text-lg font-semibold">Categories:</h3>
        <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
          {blogCategories.map((category) => (
            <li key={category}>
              <Link href="/blog" className="transition-colors hover:text-brand-leaf-green">
                {category}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="text-lg font-semibold">Recent Posts:</h3>
        <div className="mt-4 space-y-4">
          {recentPosts.map((post) => (
            <div key={post.slug} className="flex gap-3">
              <BlogPostLink slug={post.slug} className="shrink-0 overflow-hidden rounded-lg">
                <Image src={post.image} alt="" width={72} height={72} className="h-16 w-16 object-cover" />
              </BlogPostLink>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{post.date}</p>
                <BlogPostLink
                  slug={post.slug}
                  className="mt-1 block text-sm font-medium leading-snug hover:text-brand-leaf-green"
                >
                  {post.title}
                </BlogPostLink>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="text-lg font-semibold">Tags:</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {blogTags.map((tag) => (
            <Link
              key={tag}
              href="/blog"
              className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-brand-leaf-green hover:text-brand-leaf-green"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-brand-leaf-green p-6 text-white">
        <h3 className="text-lg font-semibold">How can we help you?</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/85">
          We are here to help you! Tell us how we can help and we&apos;ll get in touch within next
          24hrs
        </p>
        <Link
          href="/contact"
          className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-brand-tangerine px-6 text-sm font-semibold text-white transition hover:brightness-105"
        >
          Contact Us
        </Link>
      </div>
    </aside>
  );
}
