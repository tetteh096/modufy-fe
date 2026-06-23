"use client";

import { useEffect, useState } from "react";
import { Sparkles, Loader2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { aiApi, getApiErrorMessage } from "@/lib/api";
import { useAiModule } from "@/hooks/use-ai-module";
import { AiMetaFooter } from "@/components/features/ai/ai-meta-footer";
import type { AIMeta } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type AiProductDescribeSheetProps = {
  name: string;
  onApply: (result: { description: string; category?: string }) => void;
};

function buildPrompt(name: string, instructions: string) {
  const parts = [`Product name: ${name.trim()}`];
  if (instructions.trim()) {
    parts.push(`Write a catalog description. Merchant notes: ${instructions.trim()}`);
  } else {
    parts.push("Write a short, customer-friendly catalog description for this product.");
  }
  return parts.join("\n");
}

export function AiProductDescribeSheet({ name, onApply }: AiProductDescribeSheetProps) {
  const { isAiEnabled } = useAiModule();
  const [open, setOpen] = useState(false);
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<{ description: string; category?: string } | null>(null);
  const [meta, setMeta] = useState<AIMeta | null>(null);

  useEffect(() => {
    if (open) {
      setInstructions("");
      setPreview(null);
      setMeta(null);
    }
  }, [open, name]);

  if (!isAiEnabled || !name.trim()) return null;

  const generate = async () => {
    setLoading(true);
    setPreview(null);
    setMeta(null);
    try {
      const res = await aiApi.generate({
        kind: "product_description",
        prompt: buildPrompt(name, instructions),
      });
      const data = res.data as { description?: string; category_suggestion?: string };
      if (!data.description?.trim()) {
        toast.error("No description returned — try a clearer prompt");
        return;
      }
      setPreview({
        description: data.description.trim(),
        category: data.category_suggestion?.trim() || undefined,
      });
      setMeta(res.meta);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const apply = () => {
    if (!preview) return;
    onApply(preview);
    toast.success("Description added — review before saving");
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button type="button" variant="outline" size="sm" className="gap-1.5 shrink-0">
            <Sparkles className="h-3.5 w-3.5" />
            Write with AI
          </Button>
        }
      />
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Write product description</SheetTitle>
          <SheetDescription>
            Describe what you want — AI drafts copy you can accept or retry.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4">
          <div className="rounded-lg border bg-muted/30 px-3 py-2">
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Product title
            </p>
            <p className="text-sm font-medium">{name.trim()}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ai-product-prompt">Your prompt</Label>
            <Textarea
              id="ai-product-prompt"
              rows={4}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Handmade shea butter soap, 150g, unscented, good for sensitive skin."
            />
            <p className="text-xs text-muted-foreground">
              Optional — add details the title alone doesn&apos;t cover.
            </p>
          </div>

          <Button type="button" onClick={generate} disabled={loading} className="gap-1.5">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Writing…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Generate
              </>
            )}
          </Button>

          {preview && (
            <div className="space-y-2 rounded-lg border p-3">
              <p className="text-xs font-medium text-muted-foreground">Preview</p>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{preview.description}</p>
              {preview.category && (
                <Badge variant="secondary" className="text-xs">
                  Suggested category: {preview.category}
                </Badge>
              )}
              <AiMetaFooter meta={meta} className="border-t pt-2" />
            </div>
          )}
        </div>

        <SheetFooter className="border-t flex-row flex-wrap gap-2 sm:justify-between">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <div className="flex gap-2">
            {preview && (
              <Button
                type="button"
                variant="secondary"
                onClick={generate}
                disabled={loading}
                className="gap-1.5"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Retry
              </Button>
            )}
            <Button type="button" onClick={apply} disabled={!preview || loading}>
              Use this
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
