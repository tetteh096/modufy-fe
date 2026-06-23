"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { BlogPostForm } from "@/components/features/blog/blog-post-form";
import { Button } from "@/components/ui/button";

export default function NewBlogPostPage() {
  return (
    <div>
      <PageHeader
        title="New post"
        description="Draft an article — publish when you're ready"
        action={
          <Button render={<Link href="/blog" />} variant="outline" size="sm" className="gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            All posts
          </Button>
        }
      />
      <BlogPostForm mode="create" />
    </div>
  );
}
