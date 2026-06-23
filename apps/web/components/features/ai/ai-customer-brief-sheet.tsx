"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { aiApi, getApiErrorMessage } from "@/lib/api";
import { useAiModule } from "@/hooks/use-ai-module";
import { AiMetaFooter } from "@/components/features/ai/ai-meta-footer";
import type { AIMeta } from "@/types/api";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type AiCustomerBriefSheetProps = {
  customerId: string;
  customerName: string;
};

export function AiCustomerBriefSheet({ customerId, customerName }: AiCustomerBriefSheetProps) {
  const { isAiEnabled } = useAiModule();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [meta, setMeta] = useState<AIMeta | null>(null);

  if (!isAiEnabled) return null;

  const load = async () => {
    setLoading(true);
    setText("");
    setMeta(null);
    try {
      const res = await aiApi.customerBrief(customerId);
      setText(res.text);
      setMeta(res.meta);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) void load();
      }}
    >
      <SheetTrigger
        render={
          <Button type="button" variant="outline" size="sm" className="gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            Call brief
          </Button>
        }
      />
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Call brief</SheetTitle>
          <SheetDescription>AI summary for {customerName}</SheetDescription>
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-6">
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Preparing brief…
            </div>
          ) : text ? (
            <>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{text}</p>
              <AiMetaFooter meta={meta} className="border-t pt-3" />
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Could not load a brief.</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
