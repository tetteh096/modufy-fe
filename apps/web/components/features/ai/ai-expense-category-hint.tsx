"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { aiApi, getApiErrorMessage } from "@/lib/api";
import { useAiModule } from "@/hooks/use-ai-module";
import {
  EXPENSE_CATEGORIES,
  type ExpenseCategory,
} from "@/lib/expense-constants";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AiExpenseCategoryHintProps = {
  note: string;
  onSuggest: (category: ExpenseCategory) => void;
};

export function AiExpenseCategoryHint({ note, onSuggest }: AiExpenseCategoryHintProps) {
  const { isAiEnabled } = useAiModule();
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<ExpenseCategory | null>(null);

  if (!isAiEnabled || note.trim().length < 3) return null;

  const label = EXPENSE_CATEGORIES.find((c) => c.value === suggestion)?.label;

  const suggest = async () => {
    setLoading(true);
    setSuggestion(null);
    try {
      const res = await aiApi.generate({ kind: "expense_category", prompt: note.trim() });
      const cat = (res.data as { category?: string }).category;
      const valid = EXPENSE_CATEGORIES.some((c) => c.value === cat);
      if (!valid || !cat) {
        toast.error("Could not suggest a category");
        return;
      }
      setSuggestion(cat as ExpenseCategory);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="xs"
        className="gap-1"
        onClick={suggest}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <Sparkles className="h-3 w-3" />
        )}
        Suggest category
      </Button>
      {suggestion && label && (
        <button
          type="button"
          onClick={() => {
            onSuggest(suggestion);
            toast.success(`Category set to ${label}`);
          }}
          className={cn(
            "inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/15"
          )}
        >
          <Sparkles className="h-3 w-3" />
          {label} — apply
        </button>
      )}
    </div>
  );
}
