import Image from "next/image";
import type { BlogPost } from "@/lib/blog-content";
import { BlogPostLink, BlogReadMoreArrow } from "@/components/blog/blog-shared";
import { FadeIn } from "@/components/ui/fade-in";

export function BlogLatestGrid({ posts }: { posts: BlogPost[] }) {
  return (
    <section className="section-padding border-t border-border bg-muted/30">
      <div className="container-site">
        <FadeIn>
          <h2 className="text-3xl font-bold sm:text-4xl">Latest articles</h2>
        </FadeIn>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post, index) => (
            <FadeIn key={post.slug} delay={index * 0.06}>
              <article className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <BlogPostLink slug={post.slug} className="relative block overflow-hidden">
                  <Image
                    src={post.image}
                    alt=""
                    width={400}
                    height={260}
                    className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold">
                    {post.category}
                  </span>
                </BlogPostLink>
                <div className="p-5">
                  <p className="text-sm text-muted-foreground">{post.date}</p>
                  <BlogPostLink slug={post.slug}>
                    <h3 className="mt-2 text-lg font-semibold leading-snug transition-colors group-hover:text-brand-leaf-green">
                      {post.title}
                    </h3>
                  </BlogPostLink>
                  <BlogPostLink
                    slug={post.slug}
                    className="mt-4 inline-flex text-foreground transition-transform hover:translate-x-1"
                  >
                    <BlogReadMoreArrow />
                  </BlogPostLink>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
