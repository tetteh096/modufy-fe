"use client";

import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Camera, ImagePlus } from "lucide-react";
import { accountApi, getApiErrorMessage } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { syncAuthToken } from "@/lib/auth-session";
import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { AccountProfile } from "@/types/api";

type AccountAvatarFieldProps = {
  profile: AccountProfile;
};

export function AccountAvatarField({ profile }: AccountAvatarFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const [preview, setPreview] = useState<string | null>(null);

  const uploadMutation = useMutation({
    mutationFn: accountApi.uploadAvatar,
    onSuccess: async (updated) => {
      queryClient.setQueryData(["account-profile"], updated);
      setPreview(null);
      if (updated.avatar_url) {
        await authClient.updateUser({ image: updated.avatar_url });
      }
      await syncAuthToken();
      toast.success("Profile photo updated");
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const displaySrc = preview ?? profile.avatar_url;
  const initial = (profile.name?.trim() || profile.email || "?").charAt(0).toUpperCase();

  function onPickFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Choose a JPEG, PNG, or WebP image");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be 2 MB or smaller");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    uploadMutation.mutate(file);
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative">
        <Avatar className="h-24 w-24 rounded-lg ring-2 ring-border/60">
          {displaySrc ? <AvatarImage src={displaySrc} alt="" className="object-cover" /> : null}
          <AvatarFallback className="rounded-lg bg-primary/10 text-2xl font-bold text-primary">
            {initial}
          </AvatarFallback>
        </Avatar>
        {uploadMutation.isPending ? (
          <span className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/70">
            <Spinner className="h-6 w-6" />
          </span>
        ) : null}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Profile photo</p>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
          Shown on your account menu and team member list. JPEG, PNG, or WebP up to 2 MB.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          hidden
          tabIndex={-1}
          onChange={(e) => {
            onPickFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploadMutation.isPending}
          onClick={() => inputRef.current?.click()}
        >
          {uploadMutation.isPending ? (
            <Spinner className="mr-2 h-4 w-4" />
          ) : (
            <ImagePlus className="mr-2 h-4 w-4" />
          )}
          Upload photo
        </Button>
        {displaySrc ? (
          <p className="text-xs text-muted-foreground inline-flex items-center gap-1">
            <Camera className="h-3 w-3" />
            Click upload to replace your current photo
          </p>
        ) : null}
      </div>
    </div>
  );
}
