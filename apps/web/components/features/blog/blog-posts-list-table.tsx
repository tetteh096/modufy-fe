"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/format";
import {
  MoreHorizontal,
  Trash2,
  Pencil,
  Globe,
  EyeOff,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { BlogPost } from "@/types/api";
import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
  published: { label: "Published", className: "bg-primary/10 text-primary" },
};

type BlogPostsListTableProps = {
  posts: BlogPost[];
  businessSlug?: string;
  onDelete: (id: string) => void;
  onPublish: (id: string) => void;
  onUnpublish: (id: string) => void;
  loading?: boolean;
};

function BlogPostRow({
  post,
  businessSlug,
  onDelete,
  onPublish,
  onUnpublish,
}: {
  post: BlogPost;
  businessSlug?: string;
  onDelete: (id: string) => void;
  onPublish: (id: string) => void;
  onUnpublish: (id: string) => void;
}) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const status = statusConfig[post.status] ?? statusConfig.draft;
  const publicUrl =
    businessSlug && post.status === "published"
      ? `/p/${businessSlug}/blog/${post.slug}`
      : null;

  return (
    <>
      <TableRow className="group">
        <TableCell>
          <Link href={`/blog/${post.id}/edit`} className="block min-w-0">
            <span className="font-medium text-sm hover:text-primary truncate block">{post.title}</span>
            {post.excerpt ? (
              <span className="text-xs text-muted-foreground line-clamp-1">{post.excerpt}</span>
            ) : null}
          </Link>
        </TableCell>
        <TableCell>
          <Badge variant="secondary" className={cn("font-normal", status.className)}>
            {status.label}
          </Badge>
        </TableCell>
        <TableCell className="text-sm text-muted-foreground hidden md:table-cell">
          {post.published_at ? formatDate(post.published_at) : formatDate(post.updated_at)}
        </TableCell>
        <TableCell className="w-[52px]">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuItem render={<Link href={`/blog/${post.id}/edit`} />}>
                <Pencil className="h-4 w-4" />
                Edit
              </DropdownMenuItem>
              {publicUrl ? (
                <DropdownMenuItem render={<Link href={publicUrl} target="_blank" />}>
                  <ExternalLink className="h-4 w-4" />
                  View live
                </DropdownMenuItem>
              ) : null}
              <DropdownMenuSeparator />
              {post.status === "draft" ? (
                <DropdownMenuItem onClick={() => onPublish(post.id)}>
                  <Globe className="h-4 w-4" />
                  Publish
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => onUnpublish(post.id)}>
                  <EyeOff className="h-4 w-4" />
                  Unpublish
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => setDeleteOpen(true)}>
                <Trash2 className="h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{post.title}&rdquo; will be removed permanently.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDelete(post.id)}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function BlogPostsListTable({
  posts,
  businessSlug,
  onDelete,
  onPublish,
  onUnpublish,
  loading,
}: BlogPostsListTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Post</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="hidden md:table-cell">Updated</TableHead>
          <TableHead className="w-[52px]" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={4}>
                  <div className="h-10 rounded bg-muted/50 animate-pulse" />
                </TableCell>
              </TableRow>
            ))
          : posts.map((post) => (
              <BlogPostRow
                key={post.id}
                post={post}
                businessSlug={businessSlug}
                onDelete={onDelete}
                onPublish={onPublish}
                onUnpublish={onUnpublish}
              />
            ))}
      </TableBody>
    </Table>
  );
}
