"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowLeft,
  Briefcase,
  Check,
  Copy,
  ExternalLink,
  ImageIcon,
  ImagePlus,
  Link2,
  Plus,
  Share2,
  Star,
  Trash2,
  Upload,
} from "lucide-react";
import { marketplaceApi, getApiErrorMessage } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SITE_BASE } from "@/components/features/marketplace/marketplace-storefront-shared";
import type { WorkProject, WorkProjectStatus } from "@/types/api";
import { cn } from "@/lib/utils";

function publicWorkUrl(slug: string | undefined, projectId: string) {
  return slug ? `${SITE_BASE}/p/${slug}/work/${projectId}` : "";
}

function ShareActions({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy link");
    }
  }

  async function nativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* user cancelled */
      }
    } else {
      copyLink();
    }
  }

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" size="sm" onClick={copyLink}>
        {copied ? <Check className="mr-1.5 h-3.5 w-3.5 text-primary" /> : <Copy className="mr-1.5 h-3.5 w-3.5" />}
        {copied ? "Copied" : "Copy link"}
      </Button>
      <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
        <Button variant="outline" size="sm">
          <Share2 className="mr-1.5 h-3.5 w-3.5" />
          WhatsApp
        </Button>
      </a>
      <Button variant="outline" size="sm" onClick={nativeShare}>
        <Link2 className="mr-1.5 h-3.5 w-3.5" />
        Share…
      </Button>
      <a href={url} target="_blank" rel="noopener noreferrer">
        <Button variant="ghost" size="sm">
          <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
          View live
        </Button>
      </a>
    </div>
  );
}

function WorkProjectEditor({
  project,
  businessSlug,
  onClose,
}: {
  project: WorkProject;
  businessSlug?: string;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description);
  const [status, setStatus] = useState<WorkProjectStatus>(project.status);
  const [dragOver, setDragOver] = useState(false);

  const updateMutation = useMutation({
    mutationFn: () =>
      marketplaceApi.work.update(project.id, { title, description, status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketplace-work"] });
      toast.success("Project saved");
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const deleteMutation = useMutation({
    mutationFn: () => marketplaceApi.work.delete(project.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketplace-work"] });
      toast.success("Project deleted");
      onClose();
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const coverMutation = useMutation({
    mutationFn: (file: File) => {
      const fd = new FormData();
      fd.append("image", file);
      return marketplaceApi.work.uploadCover(project.id, fd);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketplace-work"] });
      toast.success("Cover image updated");
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const imageMutation = useMutation({
    mutationFn: (file: File) => {
      const fd = new FormData();
      fd.append("image", file);
      return marketplaceApi.work.uploadImage(project.id, fd);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketplace-work"] });
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const deleteImageMutation = useMutation({
    mutationFn: (imageId: string) => marketplaceApi.work.deleteImage(project.id, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketplace-work"] });
      toast.success("Image removed");
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const heroMutation = useMutation({
    mutationFn: ({ imageId, hero }: { imageId: string; hero: boolean }) =>
      marketplaceApi.work.updateImage(project.id, imageId, { hero }),
    onSuccess: (_, { hero }) => {
      queryClient.invalidateQueries({ queryKey: ["marketplace-work"] });
      toast.success(
        hero ? "Added to the portfolio slider" : "Removed from the portfolio slider",
      );
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  function addGalleryFiles(files: FileList | File[]) {
    const room = 20 - project.images.length;
    const list = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, room);
    if (list.length === 0) return;
    list.forEach((file) => imageMutation.mutate(file));
    toast.success(`Uploading ${list.length} photo${list.length > 1 ? "s" : ""}…`);
  }

  const saving =
    updateMutation.isPending ||
    coverMutation.isPending ||
    imageMutation.isPending ||
    deleteImageMutation.isPending;

  const isPublished = project.status === "published";
  const shareUrl = publicWorkUrl(businessSlug, project.id);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3.5">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Editing</p>
          <h3 className="font-semibold truncate">{project.title}</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="mr-1.5 h-3.5 w-3.5" />
            Delete
          </Button>
        </div>
      </div>

      {isPublished && shareUrl ? (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-primary/5 px-5 py-3">
          <p className="text-sm font-medium text-foreground flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            Live on your storefront. Share it with customers:
          </p>
          <ShareActions url={shareUrl} title={project.title} />
        </div>
      ) : null}

      <div className="grid gap-6 p-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor={`title-${project.id}`}>Title</Label>
            <Input
              id={`title-${project.id}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`desc-${project.id}`}>Description</Label>
            <Textarea
              id={`desc-${project.id}`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              maxLength={2000}
              placeholder="What was this project? Style, client, location, outcome…"
            />
          </div>
          <div className="space-y-1.5 max-w-xs">
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as WorkProjectStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft (hidden on storefront)</SelectItem>
                <SelectItem value="published">Published (live on Work page)</SelectItem>
              </SelectContent>
            </Select>
            {status === "published" && !project.cover_url ? (
              <p className="text-xs text-amber-600">Upload a cover image before publishing.</p>
            ) : null}
          </div>
          <Button onClick={() => updateMutation.mutate()} disabled={saving || !title.trim()}>
            {updateMutation.isPending ? "Saving…" : "Save project"}
          </Button>
        </div>

        <div className="space-y-2">
          <Label>Cover image</Label>
          <button
            type="button"
            onClick={() => coverInputRef.current?.click()}
            className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl border bg-muted text-left"
            disabled={coverMutation.isPending}
          >
            {project.cover_url ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={project.cover_url} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
                <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium">
                    <Upload className="h-3.5 w-3.5" />
                    {coverMutation.isPending ? "Uploading…" : "Change cover"}
                  </span>
                </span>
              </>
            ) : (
              <span className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground transition-colors group-hover:text-foreground">
                <ImagePlus className="h-8 w-8" />
                <span className="text-xs font-medium">
                  {coverMutation.isPending ? "Uploading…" : "Click to add a cover photo"}
                </span>
              </span>
            )}
          </button>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) coverMutation.mutate(file);
              e.target.value = "";
            }}
          />
        </div>
      </div>

      <div className="border-t px-5 py-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <Label>Gallery ({project.images.length}/20)</Label>
            <p className="text-xs text-muted-foreground mt-0.5">
              Star your best photos to feature them in the portfolio slider.
            </p>
          </div>
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) addGalleryFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (e.dataTransfer.files?.length) addGalleryFiles(e.dataTransfer.files);
          }}
          className={cn(
            "rounded-xl border-2 border-dashed p-4 transition-colors",
            dragOver ? "border-primary bg-primary/5" : "border-border"
          )}
        >
          {project.images.length > 0 ? (
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
              {project.images.map((img) => (
                <div key={img.id} className="group relative overflow-hidden rounded-lg border aspect-square">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]" />
                  <button
                    type="button"
                    className={cn(
                      "absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white transition-opacity hover:bg-black/80",
                      img.hero ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                    )}
                    onClick={() => heroMutation.mutate({ imageId: img.id, hero: !img.hero })}
                    disabled={heroMutation.isPending}
                    aria-label={img.hero ? "Remove from portfolio slider" : "Show in portfolio slider"}
                    title={img.hero ? "Shown in portfolio slider" : "Show in portfolio slider"}
                  >
                    <Star className={cn("h-3.5 w-3.5", img.hero && "fill-amber-400 text-amber-400")} />
                  </button>
                  <button
                    type="button"
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity hover:bg-destructive group-hover:opacity-100"
                    onClick={() => deleteImageMutation.mutate(img.id)}
                    disabled={deleteImageMutation.isPending}
                    aria-label="Remove image"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              {project.images.length < 20 && (
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  disabled={imageMutation.isPending}
                  className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                >
                  <ImagePlus className="h-6 w-6" />
                  <span className="text-xs font-medium">
                    {imageMutation.isPending ? "Uploading…" : "Add photos"}
                  </span>
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              disabled={imageMutation.isPending}
              className="flex w-full flex-col items-center justify-center gap-2 py-8 text-muted-foreground transition-colors hover:text-foreground"
            >
              <ImagePlus className="h-8 w-8" />
              <span className="text-sm font-medium">
                {imageMutation.isPending ? "Uploading…" : "Drag photos here, or click to browse"}
              </span>
              <span className="text-xs">Show the full story of this project, up to 20 photos</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function MarketplaceWorkManager() {
  const queryClient = useQueryClient();
  const coverPickRef = useRef<HTMLInputElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newCover, setNewCover] = useState<File | null>(null);
  const [newCoverPreview, setNewCoverPreview] = useState<string | null>(null);

  const { data: projects, isLoading } = useQuery({
    queryKey: ["marketplace-work"],
    queryFn: marketplaceApi.work.list,
  });

  const { data: profile } = useQuery({
    queryKey: ["marketplace-profile"],
    queryFn: marketplaceApi.profile.get,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const project = await marketplaceApi.work.create({
        title: newTitle.trim(),
        status: "draft",
      });
      if (newCover) {
        const fd = new FormData();
        fd.append("image", newCover);
        await marketplaceApi.work.uploadCover(project.id, fd);
      }
      return project;
    },
    onSuccess: (p) => {
      queryClient.invalidateQueries({ queryKey: ["marketplace-work"] });
      setSelectedId(p.id);
      setNewTitle("");
      setNewCover(null);
      if (newCoverPreview) URL.revokeObjectURL(newCoverPreview);
      setNewCoverPreview(null);
      toast.success("Project created. Add photos and publish when ready.");
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  function pickNewCover(file: File) {
    if (newCoverPreview) URL.revokeObjectURL(newCoverPreview);
    setNewCover(file);
    setNewCoverPreview(URL.createObjectURL(file));
  }

  const selected = projects?.find((p) => p.id === selectedId) ?? null;
  const businessSlug = profile?.business_slug;

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Portfolio"
        description="Showcase your best work on your storefront. Ideal for photographers, designers, and agencies."
        action={
          <Button variant="outline" size="sm" nativeButton={false} render={<Link href="/marketplace" />}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to storefront
          </Button>
        }
      />

      <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
          <input
            ref={coverPickRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) pickNewCover(file);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => coverPickRef.current?.click()}
            className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl border-2 border-dashed bg-muted/40 transition-colors hover:border-primary/50 sm:w-40"
            aria-label="Choose cover photo"
          >
            {newCoverPreview ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={newCoverPreview} alt="" className="h-full w-full object-cover" />
                <span className="absolute inset-x-0 bottom-0 bg-black/55 py-1 text-center text-[10px] font-medium text-white">
                  Change photo
                </span>
              </>
            ) : (
              <span className="flex h-full flex-col items-center justify-center gap-1 text-muted-foreground">
                <ImagePlus className="h-6 w-6" />
                <span className="text-xs font-medium">Cover photo</span>
              </span>
            )}
          </button>

          <div className="flex flex-1 flex-col justify-center gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="new-project-title">Start a new project</Label>
              <Input
                id="new-project-title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Accra wedding shoot"
                maxLength={120}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newTitle.trim() && !createMutation.isPending) {
                    createMutation.mutate();
                  }
                }}
              />
            </div>
            <div>
              <Button
                onClick={() => createMutation.mutate()}
                disabled={!newTitle.trim() || createMutation.isPending}
              >
                <Plus className="mr-1.5 h-4 w-4" />
                {createMutation.isPending ? "Creating…" : "Create project"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
          ))}
        </div>
      ) : !projects?.length ? (
        <EmptyState
          icon={<Briefcase className="h-8 w-8" />}
          title="No work projects yet"
          description="Add your best shoots, designs, or jobs so customers can see your craft before they book."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const liveUrl = publicWorkUrl(businessSlug, project.id);
            const isPublished = project.status === "published";
            return (
              <div
                key={project.id}
                className={cn(
                  "group overflow-hidden rounded-xl border border-border bg-card text-left shadow-xs transition-colors hover:border-border/80",
                  selectedId === project.id && "ring-2 ring-primary border-primary",
                )}
              >
                <button
                  type="button"
                  onClick={() => setSelectedId(project.id)}
                  className="block w-full text-left"
                >
                  <div className="relative aspect-[4/3] bg-muted">
                    {project.cover_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={project.cover_url}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground">
                        <ImageIcon className="h-8 w-8" />
                      </div>
                    )}
                    <Badge
                      className="absolute left-2.5 top-2.5 border-0 shadow-sm"
                      variant={isPublished ? "default" : "secondary"}
                    >
                      {isPublished ? "Published" : "Draft"}
                    </Badge>
                    {project.images.length > 0 && (
                      <span className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-medium text-white">
                        <ImageIcon className="h-3 w-3" />
                        {project.images.length}
                      </span>
                    )}
                  </div>
                  <div className="p-3.5">
                    <p className="font-medium line-clamp-1">{project.title}</p>
                    {project.description ? (
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {project.description}
                      </p>
                    ) : null}
                  </div>
                </button>

                {isPublished && liveUrl && (
                  <div className="flex items-center gap-1 border-t px-2 py-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 flex-1 text-xs"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(liveUrl);
                          toast.success("Link copied");
                        } catch {
                          toast.error("Could not copy link");
                        }
                      }}
                    >
                      <Copy className="mr-1 h-3 w-3" />
                      Copy link
                    </Button>
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(`${project.title} ${liveUrl}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button variant="ghost" size="sm" className="h-7 w-full text-xs">
                        <Share2 className="mr-1 h-3 w-3" />
                        WhatsApp
                      </Button>
                    </a>
                    <a href={liveUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm" className="h-7 px-2">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {selected ? (
        <WorkProjectEditor
          key={selected.id}
          project={selected}
          businessSlug={businessSlug}
          onClose={() => setSelectedId(null)}
        />
      ) : null}
    </div>
  );
}
