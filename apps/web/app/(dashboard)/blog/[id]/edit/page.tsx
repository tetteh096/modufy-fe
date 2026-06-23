"use client";

import Link from "next/link";
import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { blogApi } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { SectionLoader } from "@/components/shared/page-loader";
import { BlogPostForm } from "@/components/features/blog/blog-post-form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog", "post", id],
    queryFn: () => blogApi.get(id),
  });

  if (isLoading) return <SectionLoader />;

  if (!post) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        Post not found.{" "}
        <Link href="/blog" className="text-primary hover:underline">
          Back to blog
        </Link>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={post.title}
        description="Edit content and SEO settings"
        action={
          <div className="flex items-center gap-2">
            <Badge variant={post.status === "published" ? "default" : "secondary"}>
              {post.status === "published" ? "Published" : "Draft"}
            </Badge>
            <Button render={<Link href="/blog" />} variant="outline" size="sm" className="gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              All posts
            </Button>
          </div>
        }
      />
      <BlogPostForm mode="edit" post={post} />
    </div>
  );
}
