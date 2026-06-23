import type { Metadata } from "next";
import { PublicBlogPostView } from "@/components/features/blog/public-blog-post-view";
import { resolveBlogCoverSrc } from "@/lib/blog-cover";
import type { BlogPost } from "@/types/api";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

async function fetchPublicStorefront(slug: string): Promise<{ business_name?: string } | null> {
  try {
    const res = await fetch(`${API}/public/${encodeURIComponent(slug)}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: { business_name?: string } };
    return json.data ?? null;
  } catch {
    return null;
  }
}

async function fetchPublicPost(slug: string, postSlug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${API}/public/${encodeURIComponent(slug)}/blog/${encodeURIComponent(postSlug)}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: BlogPost };
    return json.data ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; postSlug: string }>;
}): Promise<Metadata> {
  const { slug, postSlug } = await params;
  const [post, storefront] = await Promise.all([
    fetchPublicPost(slug, postSlug),
    fetchPublicStorefront(slug),
  ]);
  if (!post) {
    return { title: "Post not found" };
  }
  const pageTitle = post.seo_title || post.title;
  const businessName = storefront?.business_name;
  const absoluteTitle = businessName ? `${pageTitle} | ${businessName}` : pageTitle;
  const description = post.meta_description || post.excerpt || undefined;
  const cover = resolveBlogCoverSrc(post.featured_image_url, post.slug || post.id);
  return {
    title: { absolute: absoluteTitle },
    description,
    openGraph: {
      title: absoluteTitle,
      description,
      type: "article",
      publishedTime: post.published_at,
      images: [{ url: cover }],
    },
    twitter: {
      card: "summary_large_image",
      title: absoluteTitle,
      description,
      images: [cover],
    },
  };
}

export default async function StorefrontBlogPostPage({
  params,
}: {
  params: Promise<{ slug: string; postSlug: string }>;
}) {
  const { slug, postSlug } = await params;
  const post = await fetchPublicPost(slug, postSlug);
  return <PublicBlogPostView post={post} />;
}
