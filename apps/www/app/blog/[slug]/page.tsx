import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogSidebar } from "@/components/blog/blog-sidebar";
import { PageHero } from "@/components/marketing/page-hero";
import { blogPosts, getBlogPost, latestArticles, recentPosts } from "@/lib/blog-content";
import { pageHeroes } from "@/lib/page-heroes";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const allPosts = [...blogPosts, ...recentPosts, ...latestArticles];

export function generateStaticParams() {
  return allPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Blog Post" };
  return { title: post.title, description: post.excerpt || post.title };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <>
      <PageHero
        eyebrow={post.category}
        title={post.title}
        subtitle={post.excerpt}
        image={pageHeroes.blog.image}
        imageAlt={post.title}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.title },
        ]}
      />
      <section className="section-padding">
        <div className="container-site">
          <div className="grid gap-10 lg:grid-cols-12">
            <article className="lg:col-span-8">
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
                <span className="rounded-full bg-accent px-3 py-1 font-medium text-secondary-foreground">
                  {post.category}
                </span>
                <span className="text-muted-foreground">{post.date}</span>
              </div>
              <div className="prose prose-neutral mt-8 max-w-none">
                <h2>{post.title}</h2>
                {post.excerpt ? <p>{post.excerpt}</p> : null}
                <p>
                  Full article content will load from your CMS when connected. This placeholder keeps
                  the blog detail layout ready for production content.
                </p>
                <p>
                  <Link href="/blog" className="font-medium text-brand-leaf-green">
                    ← Back to blog
                  </Link>
                </p>
              </div>
            </article>
            <div className="lg:col-span-4">
              <BlogSidebar />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
