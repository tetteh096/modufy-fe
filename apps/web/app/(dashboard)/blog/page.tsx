"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, PenLine, Search } from "lucide-react";
import { blogApi, businessApi, getApiErrorMessage } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ListPagination } from "@/components/shared/list-pagination";
import { BlogPostsListTable } from "@/components/features/blog/blog-posts-list-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";

const DEFAULT_PAGE_SIZE = 20;

export default function BlogPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [businessSlug, setBusinessSlug] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const queryClient = useQueryClient();

  useEffect(() => {
    businessApi.get().then((biz) => setBusinessSlug(biz.slug)).catch(() => {});
  }, []);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status, pageSize]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["blog", "posts", debouncedSearch, status, page, pageSize],
    queryFn: () =>
      blogApi.list({
        search: debouncedSearch || undefined,
        status: status === "all" ? undefined : status,
        page,
        limit: pageSize,
      }),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["blog"] });

  const deleteMutation = useMutation({
    mutationFn: blogApi.delete,
    onSuccess: () => {
      toast.success("Post deleted");
      invalidate();
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const publishMutation = useMutation({
    mutationFn: blogApi.publish,
    onSuccess: () => {
      toast.success("Post published");
      invalidate();
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const unpublishMutation = useMutation({
    mutationFn: blogApi.unpublish,
    onSuccess: () => {
      toast.success("Post unpublished");
      invalidate();
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const posts = data?.posts ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    if (page > totalPages && total > 0) setPage(totalPages);
  }, [page, totalPages, total]);

  return (
    <div>
      <PageHeader
        title="Blog"
        description="Publish articles to boost SEO and share updates with customers"
        action={
          <Button render={<Link href="/blog/new" />} size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            New post
          </Button>
        }
      />

      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={status} onValueChange={(v) => setStatus(v ?? "all")}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="draft">Drafts</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!isLoading && posts.length === 0 ? (
            <EmptyState
              icon={<PenLine className="h-8 w-8" />}
              title={search || status !== "all" ? "No posts found" : "No posts yet"}
              description={
                search || status !== "all"
                  ? "Try different filters."
                  : "Write your first article to improve search visibility."
              }
              action={
                !search && status === "all" ? (
                  <Button render={<Link href="/blog/new" />} size="sm" className="gap-1.5">
                    <Plus className="h-4 w-4" />
                    Write first post
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <>
              <BlogPostsListTable
                posts={posts}
                businessSlug={businessSlug}
                onDelete={(id) => deleteMutation.mutate(id)}
                onPublish={(id) => publishMutation.mutate(id)}
                onUnpublish={(id) => unpublishMutation.mutate(id)}
                loading={isLoading || isFetching}
              />
              <ListPagination
                page={page}
                pageSize={pageSize}
                total={total}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
                itemLabel="post"
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
