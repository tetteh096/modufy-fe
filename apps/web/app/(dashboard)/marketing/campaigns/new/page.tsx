"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { CampaignForm } from "@/components/features/marketing/campaign-form";

export default function NewCampaignPage() {
  const searchParams = useSearchParams();
  const channel = searchParams.get("channel");

  const isSms = channel === "sms";

  return (
    <div className="p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <PageHeader
          title={isSms ? "New SMS campaign" : "New email campaign"}
          description={
            isSms
              ? "Write a text blast, pick your audience, and save as a draft before sending."
              : "Pick a newsletter template, customise the design, and preview how it looks in the inbox."
          }
          action={
            <Button
              nativeButton={false}
              render={<Link href="/marketing" />}
              variant="outline"
              size="sm"
            >
              Cancel
            </Button>
          }
        />
        <CampaignForm />
      </div>
    </div>
  );
}
