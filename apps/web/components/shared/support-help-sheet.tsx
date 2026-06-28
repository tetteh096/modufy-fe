"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Calendar,
  Headphones,
  Mail,
  MessageCircle,
  Percent,
  Sparkles,
} from "lucide-react";
import { useAiModule } from "@/hooks/use-ai-module";
import { supportLinks } from "@/lib/support-links";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

function SupportHelpContent() {
  const { isAiEnabled } = useAiModule();

  const items = [
    {
      icon: MessageCircle,
      title: "Messages",
      description: "SMS and email to your customers",
      href: "/communications",
      external: false,
    },
    ...(isAiEnabled
      ? [
          {
            icon: Sparkles,
            title: "AI Assist",
            description: "Use the Assist button in the top bar for quick answers",
            href: "/dashboard",
            external: false,
          },
        ]
      : []),
    {
      icon: BookOpen,
      title: "Documentation",
      description: "Guides for modules, sales, and inventory",
      href: supportLinks.docs,
      external: true,
    },
    {
      icon: Calendar,
      title: "Book a demo",
      description: "Walkthrough with our team",
      href: supportLinks.demo,
      external: true,
    },
    {
      icon: Mail,
      title: "Email support",
      description: supportLinks.email,
      href: `mailto:${supportLinks.email}`,
      external: true,
    },
  ] as const;

  return (
    <>
      <SheetHeader>
        <SheetTitle className="flex items-center gap-2">
          <Headphones className="h-5 w-5 text-primary" />
          How can we help?
        </SheetTitle>
        <SheetDescription>
          Quick links to messages, docs, and our team — without leaving Modufy.
        </SheetDescription>
      </SheetHeader>

      <div className="space-y-2 px-4 pb-6">
        {items.map((item) => {
          const Icon = item.icon;
          const inner = (
            <div className="flex items-start gap-3 rounded-xl border bg-card p-3 transition hover:border-primary/30 hover:bg-muted/20">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-sm">{item.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{item.description}</p>
              </div>
            </div>
          );

          if (item.external) {
            return (
              <a key={item.title} href={item.href} target="_blank" rel="noopener noreferrer">
                {inner}
              </a>
            );
          }

          return (
            <Link key={item.title} href={item.href}>
              {inner}
            </Link>
          );
        })}
      </div>
    </>
  );
}

type SupportHelpSheetProps = {
  trigger?: React.ReactElement;
  triggerClassName?: string;
  side?: "top" | "right" | "bottom" | "left";
};

export function SupportHelpSheet({
  trigger,
  triggerClassName,
  side = "right",
}: SupportHelpSheetProps) {
  const defaultTrigger = (
    <Button variant="outline" size="sm" className={cn("gap-1.5 h-8", triggerClassName)}>
      <Headphones className="h-4 w-4" />
      <span className="hidden sm:inline">Help</span>
    </Button>
  );

  return (
    <Sheet>
      <SheetTrigger render={trigger ?? defaultTrigger} />
      <SheetContent side={side} className="w-full sm:max-w-md">
        <SupportHelpContent />
      </SheetContent>
    </Sheet>
  );
}

export function SupportFloatingButton() {
  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-40 md:bottom-6 md:right-6">
      <SupportHelpSheet
        trigger={
          <button
            type="button"
            className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 ring-4 ring-background transition hover:scale-105 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Open help and support"
          >
            <MessageCircle className="h-5 w-5" />
          </button>
        }
      />
    </div>
  );
}

export function SupportHelpInlineCard({ className }: { className?: string }) {
  return (
    <SupportHelpSheet
      trigger={
        <button
          type="button"
          className={cn(
            "group flex h-full min-h-[180px] flex-col justify-between rounded-2xl border border-border/60 bg-secondary p-5 text-left text-secondary-foreground transition hover:brightness-110",
            className,
          )}
        >
          <span className="ml-auto flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-background/10">
            <ArrowUpRight className="h-4 w-4" />
          </span>
          <div>
            <p className="text-lg font-semibold leading-snug">Need a hand?</p>
            <p className="mt-1 text-sm opacity-70">Chat, docs, or email — we&apos;re here.</p>
          </div>
        </button>
      }
    />
  );
}

// Re-export icon for spotlight promo card
export { Percent };
