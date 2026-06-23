"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { aiApi, getApiErrorMessage } from "@/lib/api";
import { useAiModule } from "@/hooks/use-ai-module";
import { AiMetaFooter } from "@/components/features/ai/ai-meta-footer";
import type { AIInvoiceLineSuggestion, AIMeta } from "@/types/api";
import { formatMoney } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type AiInvoiceLinesSheetProps = {
  currency: string;
  onApply: (lines: AIInvoiceLineSuggestion[]) => void;
};

export function AiInvoiceLinesSheet({ currency, onApply }: AiInvoiceLinesSheetProps) {
  const { isAiEnabled } = useAiModule();
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [lines, setLines] = useState<AIInvoiceLineSuggestion[] | null>(null);
  const [meta, setMeta] = useState<AIMeta | null>(null);

  if (!isAiEnabled) return null;

  const generate = async () => {
    if (prompt.trim().length < 3) {
      toast.error("Describe the sale in a few words");
      return;
    }
    setLoading(true);
    setLines(null);
    setMeta(null);
    try {
      const res = await aiApi.generate({ kind: "invoice_lines", prompt: prompt.trim() });
      const raw = res.data as { lines?: AIInvoiceLineSuggestion[] };
      const next = raw.lines ?? [];
      if (next.length === 0) {
        toast.error("No lines returned — try a clearer description");
        return;
      }
      setLines(next);
      setMeta(res.meta);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const apply = () => {
    if (!lines?.length) return;
    onApply(lines);
    toast.success(`Added ${lines.length} line${lines.length !== 1 ? "s" : ""}`);
    setOpen(false);
    setPrompt("");
    setLines(null);
    setMeta(null);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button type="button" variant="outline" size="sm" className="gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            AI lines
          </Button>
        }
      />
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Describe the sale</SheetTitle>
          <SheetDescription>
            Example: &quot;2 bags of cement at 45 each and delivery fee 20&quot;
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4">
          <Textarea
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type what you're invoicing…"
          />
          <Button type="button" onClick={generate} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Generating…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Preview lines
              </>
            )}
          </Button>

          {lines && (
            <div className="space-y-2 rounded-lg border p-3">
              <p className="text-xs font-medium text-muted-foreground">Preview</p>
              <ul className="space-y-2 text-sm">
                {lines.map((line, i) => (
                  <li key={i} className="flex justify-between gap-2 border-b pb-2 last:border-0 last:pb-0">
                    <span>
                      {line.quantity}× {line.description}
                    </span>
                    <span className="tabular-nums shrink-0">
                      {formatMoney(line.quantity * line.unit_price, currency)}
                    </span>
                  </li>
                ))}
              </ul>
              <AiMetaFooter meta={meta} className="border-t pt-2" />
            </div>
          )}
        </div>

        <SheetFooter className="border-t">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={apply} disabled={!lines?.length}>
            Add to invoice
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
