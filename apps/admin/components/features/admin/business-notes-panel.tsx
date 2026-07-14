"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApi } from "@/lib/admin-api";
import { getApiErrorMessage } from "@/lib/api";
import { useBusinessWorkspace } from "@/components/features/admin/business-workspace-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function BusinessNotesPanel() {
  const { businessId, business } = useBusinessWorkspace();
  const qc = useQueryClient();
  const [note, setNote] = useState("");

  const addNote = useMutation({
    mutationFn: () => adminApi.addBusinessNote(businessId, note),
    onSuccess: () => {
      toast.success("Note added");
      setNote("");
      qc.invalidateQueries({ queryKey: ["admin-business", businessId] });
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  if (!business) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Internal notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <textarea
          className={cn(
            "flex min-h-[100px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs",
            "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
          placeholder="Add a note for the platform team…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={4}
        />
        <Button
          size="sm"
          className="w-full sm:w-auto"
          disabled={!note.trim() || addNote.isPending}
          onClick={() => addNote.mutate()}
        >
          Save note
        </Button>
        <Separator />
        <div className="max-h-96 space-y-4 overflow-y-auto">
          {business.notes.length === 0 ? (
            <p className="text-sm text-muted-foreground">No notes yet.</p>
          ) : (
            business.notes.map((n) => (
              <div key={n.id} className="rounded-lg border bg-muted/20 p-3 text-sm">
                <p className="text-xs text-muted-foreground">
                  {n.author_name} · {new Date(n.created_at).toLocaleString()}
                </p>
                <p className="mt-1.5 whitespace-pre-wrap">{n.body}</p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
