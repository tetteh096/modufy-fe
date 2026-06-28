import Image from "next/image";
import type { BlogPost } from "@/lib/blog-content";
import { BlogPostLink, BlogReadMoreArrow } from "@/components/blog/blog-shared";

export function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <article className="group flex flex-col gap-6 border-b border-border py-8 first:pt-0 last:border-b-0 sm:flex-row sm:items-start">
      <BlogPostLink slug={post.slug} className="block shrink-0 overflow-hidden rounded-2xl sm:w-72">
        <Image
          src={post.image}
          alt=""
          width={288}
          height={200}
          className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-44"
        />
      </BlogPostLink>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="rounded-full bg-accent px-3 py-1 font-medium text-secondary-foreground">
            {post.category}
          </span>
          <span className="text-muted-foreground">{post.date}</span>
        </div>
        <BlogPostLink slug={post.slug}>
          <h3 className="mt-3 text-xl font-bold leading-snug transition-colors group-hover:text-brand-leaf-green sm:text-2xl">
            {post.title}
          </h3>
        </BlogPostLink>
        {post.excerpt ? (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
        ) : null}
        <BlogPostLink
          slug={post.slug}
          className="mt-4 inline-flex text-foreground transition-transform hover:translate-x-1"
        >
          <BlogReadMoreArrow />
        </BlogPostLink>
      </div>
    </article>
  );
}
