"use client";

import { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Sparkles, Square, Copy, Loader2 } from "lucide-react";
import { aiApi } from "@/lib/api";
import type { AIDraftMeta } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const KINDS = [
  { value: "product description", label: "Product description" },
  { value: "marketing email", label: "Marketing email" },
  { value: "social post", label: "Social media post" },
  { value: "customer message", label: "Customer message" },
  { value: "invoice note", label: "Invoice / quote note" },
  { value: "", label: "General copy" },
];

const schema = z.object({
  prompt: z.string().min(3, "Tell the assistant what to write").max(4000),
  kind: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export function AIAssistant() {
  const [output, setOutput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [meta, setMeta] = useState<AIDraftMeta | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const { register, handleSubmit, control, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { prompt: "", kind: "product description" },
  });

  const onSubmit = async (values: FormValues) => {
    if (streaming) return;
    setOutput("");
    setMeta(null);
    setStreaming(true);
    const controller = new AbortController();
    abortRef.current = controller;

    await aiApi.draftStream(
      { prompt: values.prompt, kind: values.kind || undefined },
      {
        onDelta: (t) => setOutput((prev) => prev + t),
        onDone: (m) => {
          setMeta(m);
          setStreaming(false);
        },
        onError: (msg) => {
          toast.error(msg);
          setStreaming(false);
        },
      },
      controller.signal
    );
  };

  const stop = () => {
    abortRef.current?.abort();
    setStreaming(false);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    toast.success("Copied");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Controller
            control={control}
            name="kind"
            render={({ field }) => (
              <Select value={field.value} onValueChange={(v) => field.onChange(v as string)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="What are you writing?" />
                </SelectTrigger>
                <SelectContent>
                  {KINDS.map((k) => (
                    <SelectItem key={k.label} value={k.value}>
                      {k.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-1">
          <Textarea
            rows={8}
            placeholder="Describe what you want, e.g. 'A friendly product description for handmade shea butter soap, 150g, unscented.'"
            {...register("prompt")}
          />
          {formState.errors.prompt && (
            <p className="text-xs text-destructive">{formState.errors.prompt.message}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button type="submit" disabled={streaming}>
            {streaming ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Writing…
              </>
            ) : (
              <>
                <Sparkles className="size-4" /> Generate
              </>
            )}
          </Button>
          {streaming && (
            <Button type="button" variant="outline" onClick={stop}>
              <Square className="size-4" /> Stop
            </Button>
          )}
        </div>
      </form>

      <Card className="min-h-[18rem]">
        <CardContent className="flex h-full flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Draft</span>
            {output && !streaming && (
              <Button type="button" variant="ghost" size="sm" onClick={copy}>
                <Copy className="size-3.5" /> Copy
              </Button>
            )}
          </div>

          {output ? (
            <p className="flex-1 whitespace-pre-wrap text-sm leading-relaxed">{output}</p>
          ) : (
            <p className="flex-1 text-sm text-muted-foreground">
              Your generated copy will appear here.
            </p>
          )}

          {meta && (
            <div className="flex items-center gap-2 border-t pt-3 text-xs text-muted-foreground">
              <span>
                {meta.provider} · {meta.model}
              </span>
              {meta.degraded && <Badge variant="secondary">economy</Badge>}
              <span className="ml-auto tabular-nums">${meta.cost_usd.toFixed(4)}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
