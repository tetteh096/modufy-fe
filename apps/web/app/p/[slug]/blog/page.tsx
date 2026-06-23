"use client";

import { Suspense } from "react";
import { PublicBlogList } from "@/components/features/blog/public-blog-list";
import { Spinner } from "@/components/shared/spinner";

export default function StorefrontBlogPage() {
  return (
    <Suspense
      fallback={
        <div className="sf-blog-loading" style={{ minHeight: "50vh" }}>
          <Spinner className="h-8 w-8" />
        </div>
      }
    >
      <PublicBlogList />
    </Suspense>
  );
}
