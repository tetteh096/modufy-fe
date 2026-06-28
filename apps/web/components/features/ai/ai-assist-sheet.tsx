"use client";

import { useRef, useState } from "react";
import { Sparkles, Loader2, Square, Send } from "lucide-react";
import { toast } from "sonner";
import { aiApi } from "@/lib/api";
import { useAiModule } from "@/hooks/use-ai-module";
import { AiMetaFooter } from "@/components/features/ai/ai-meta-footer";
import type { AIChatMessage, AIMeta } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function AiAssistSheet() {
  const { isAiEnabled } = useAiModule();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [meta, setMeta] = useState<AIMeta | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  if (!isAiEnabled) return null;

  const send = async () => {
    const text = input.trim();
    if (!text || streaming) return;

    const nextMessages: AIChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setStreaming(true);
    setMeta(null);

    let assistant = "";
    setMessages([...nextMessages, { role: "assistant", content: "" }]);

    const controller = new AbortController();
    abortRef.current = controller;

    await aiApi.chatStream(
      { messages: nextMessages },
      {
        onDelta: (chunk) => {
          assistant += chunk;
          setMessages([...nextMessages, { role: "assistant", content: assistant }]);
        },
        onDone: (m) => {
          setMeta(m);
          setStreaming(false);
        },
        onError: (msg) => {
          toast.error(msg);
          setStreaming(false);
          setMessages(nextMessages);
        },
      },
      controller.signal
    );
  };

  const stop = () => {
    abortRef.current?.abort();
    setStreaming(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="topbar-action-btn hidden h-8 gap-1.5 sm:inline-flex"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Assist
          </Button>
        }
      />
      <SheetContent side="right" className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetHeader className="border-b px-4 py-4">
          <SheetTitle>Modufy Assist</SheetTitle>
          <SheetDescription>
            Ask about today&apos;s sales, alerts, and what to do next.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
          {messages.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Try: &quot;What should I focus on today?&quot; or &quot;Summarise overdue invoices.&quot;
            </p>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={
                m.role === "user"
                  ? "ml-8 rounded-lg bg-primary/10 px-3 py-2 text-sm"
                  : "mr-4 rounded-lg border bg-card px-3 py-2 text-sm whitespace-pre-wrap"
              }
            >
              {m.content || (streaming && m.role === "assistant" ? "…" : "")}
            </div>
          ))}
          {meta && <AiMetaFooter meta={meta} className="border-t pt-2" />}
        </div>

        <div className="border-t p-4 space-y-2">
          <Textarea
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Assist…"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
          />
          <div className="flex gap-2">
            <Button type="button" onClick={send} disabled={streaming || !input.trim()} className="gap-1.5">
              {streaming ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Send
            </Button>
            {streaming && (
              <Button type="button" variant="outline" onClick={stop} className="gap-1.5">
                <Square className="h-4 w-4" />
                Stop
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
