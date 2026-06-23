"use client";

import { PageHeader } from "@/components/shared/page-header";
import { AIAssistant } from "@/components/features/ai/ai-assistant";

export default function AIAssistantPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Assistant"
        description="Draft product descriptions, messages, and marketing copy. Spend is metered against your budget."
      />
      <AIAssistant />
    </div>
  );
}
