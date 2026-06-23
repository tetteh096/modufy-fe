"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Globe, Save, EyeOff, Loader2, ImageIcon, ExternalLink } from "lucide-react";
import { blogApi, businessApi, getApiErrorMessage } from "@/lib/api";
import { BlogRichTextEditor } from "@/components/features/blog/blog-rich-text-editor";
import { BlogCoverField } from "@/components/features/blog/blog-cover-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { BlogPost } from "@/types/api";

const schema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  slug: z
    .string()
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$|^$/, "Use lowercase letters, numbers, and hyphens")
    .optional()
    .or(z.literal("")),
  excerpt: z.string().max(500).optional(),
  body_html: z.string().optional(),
  seo_title: z.string().max(255).optional(),
  meta_description: z.string().max(320).optional(),
  featured_image_url: z.string().optional(),
  category: z.string().max(100).optional(),
  tags: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

function slugifyTitle(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

type BlogPostFormProps = {
  post?: BlogPost;
  mode: "create" | "edit";
};

export function BlogPostForm({ post, mode }: BlogPostFormProps) {
  const router = useRouter();
  const [slugTouched, setSlugTouched] = useState(Boolean(post?.slug));
  const [businessSlug, setBusinessSlug] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [pendingCover, setPendingCover] = useState<File | null>(null);

  useEffect(() => {
    businessApi
      .get()
      .then((biz) => {
        setBusinessSlug(biz.slug);
        setBusinessName(biz.name);
      })
      .catch(() => {});
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: post?.title ?? "",
      slug: post?.slug ?? "",
      excerpt: post?.excerpt ?? "",
      body_html: post?.body_html ?? "",
      seo_title: post?.seo_title ?? "",
      meta_description: post?.meta_description ?? "",
      featured_image_url: post?.featured_image_url ?? "",
      category: post?.category ?? "",
      tags: post?.tags?.join(", ") ?? "",
    },
  });

  const title = form.watch("title");
  const featuredImage = form.watch("featured_image_url");
  const metaDescription = form.watch("meta_description") ?? "";
  const slugPreview = form.watch("slug");

  useEffect(() => {
    if (!slugTouched && mode === "create" && title) {
      form.setValue("slug", slugifyTitle(title));
    }
  }, [title, slugTouched, mode, form]);

  const saveMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload = {
        title: values.title,
        slug: values.slug || undefined,
        excerpt: values.excerpt,
        body_html: values.body_html,
        seo_title: values.seo_title,
        meta_description: values.meta_description,
        featured_image_url: values.featured_image_url || undefined,
        category: values.category?.trim() || undefined,
        tags: values.tags
          ? values.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : undefined,
      };
      if (mode === "create") {
        const saved = await blogApi.create(payload);
        if (pendingCover) {
          return blogApi.uploadCover(saved.id, pendingCover);
        }
        return saved;
      }
      return blogApi.update(post!.id, payload);
    },
    onSuccess: (saved) => {
      toast.success(mode === "create" ? "Draft saved" : "Post updated");
      setPendingCover(null);
      if (mode === "create") {
        router.push(`/blog/${saved.id}/edit`);
      } else if (saved.featured_image_url) {
        form.setValue("featured_image_url", saved.featured_image_url);
      }
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const coverUploadMutation = useMutation({
    mutationFn: (file: File) => blogApi.uploadCover(post!.id, file),
    onSuccess: (updated) => {
      form.setValue("featured_image_url", updated.featured_image_url ?? "");
      toast.success("Cover image uploaded");
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const publishMutation = useMutation({
    mutationFn: () => blogApi.publish(post!.id),
    onSuccess: () => {
      toast.success("Post published");
      router.refresh();
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const unpublishMutation = useMutation({
    mutationFn: () => blogApi.unpublish(post!.id),
    onSuccess: () => {
      toast.success("Post moved to drafts");
      router.refresh();
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const onSubmit = form.handleSubmit((values) => saveMutation.mutate(values));
  const publicUrl =
    businessSlug && slugPreview ? `/p/${businessSlug}/blog/${slugPreview}` : null;

  return (
    <form onSubmit={onSubmit} className="space-y-5 pb-8">
      <div className="sticky top-0 z-10 -mx-1 flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-background/95 px-3 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <p className="text-sm text-muted-foreground hidden sm:block">
          {mode === "create" ? "Draft — not visible on your storefront yet" : `Status: ${post?.status ?? "draft"}`}
        </p>
        <div className="flex flex-wrap items-center gap-2 ml-auto">
          {mode === "edit" && post?.status === "published" ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={unpublishMutation.isPending}
              onClick={() => unpublishMutation.mutate()}
            >
              {unpublishMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
              Unpublish
            </Button>
          ) : null}
          {mode === "edit" && post?.status === "draft" ? (
            <Button
              type="button"
              size="sm"
              className="gap-1.5"
              disabled={publishMutation.isPending || saveMutation.isPending}
              onClick={form.handleSubmit(async (values) => {
                await saveMutation.mutateAsync(values);
                await publishMutation.mutateAsync();
              })}
            >
              {publishMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Globe className="h-4 w-4" />
              )}
              Publish
            </Button>
          ) : null}
          <Button type="submit" size="sm" className="gap-1.5" disabled={saveMutation.isPending}>
            {saveMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save draft
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Article</CardTitle>
              <CardDescription>Title, summary, and main content.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  {...form.register("title")}
                  placeholder="How we grew our business in 2026"
                  className="text-base"
                />
                {form.formState.errors.title ? (
                  <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Short summary</Label>
                <Textarea
                  id="excerpt"
                  rows={2}
                  {...form.register("excerpt")}
                  placeholder="Shown on your home page and blog listing."
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    {...form.register("category")}
                    placeholder="Wellness Tips"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    {...form.register("tags")}
                    placeholder="Wellness, Lifestyle, Tips"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Body</Label>
                <Controller
                  name="body_html"
                  control={form.control}
                  render={({ field }) => (
                    <BlogRichTextEditor value={field.value ?? ""} onChange={field.onChange} />
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Cover image
              </CardTitle>
              <CardDescription>
                Upload a photo — shown on your home page, blog list, and article page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BlogCoverField
                title={title}
                imageUrl={featuredImage}
                onImageUrlChange={(url) => form.setValue("featured_image_url", url)}
                pendingFile={mode === "create" ? pendingCover : null}
                onPendingFileChange={mode === "create" ? setPendingCover : undefined}
                onUpload={mode === "edit" && post ? (file) => coverUploadMutation.mutate(file) : undefined}
                isUploading={coverUploadMutation.isPending}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">URL &amp; SEO</CardTitle>
              <CardDescription>How this post appears in search and on your storefront.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="slug">URL slug</Label>
                <Input
                  id="slug"
                  {...form.register("slug")}
                  onChange={(e) => {
                    setSlugTouched(true);
                    form.register("slug").onChange(e);
                  }}
                  placeholder="how-we-grew-our-business"
                />
                {form.formState.errors.slug ? (
                  <p className="text-sm text-destructive">{form.formState.errors.slug.message}</p>
                ) : null}
              </div>

              {publicUrl ? (
                <Link
                  href={publicUrl}
                  target="_blank"
                  className="flex items-center gap-2 text-xs text-primary hover:underline break-all"
                >
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                  {publicUrl}
                </Link>
              ) : null}

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="seo_title">SEO title</Label>
                <Input
                  id="seo_title"
                  {...form.register("seo_title")}
                  placeholder={title || "Defaults to post title"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta_description">Meta description</Label>
                <Textarea
                  id="meta_description"
                  rows={3}
                  maxLength={320}
                  {...form.register("meta_description")}
                  placeholder="Brief description for Google search results."
                />
                <p
                  className={`text-xs ${
                    metaDescription.length >= 120 && metaDescription.length <= 160
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {metaDescription.length}/320 · aim for 120–160 characters
                </p>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </form>
  );
}
