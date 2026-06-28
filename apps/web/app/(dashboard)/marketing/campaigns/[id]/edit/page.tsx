"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { marketingApi } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { SectionLoader } from "@/components/shared/page-loader";
import { Button } from "@/components/ui/button";
import { CampaignForm } from "@/components/features/marketing/campaign-form";

export default function EditCampaignPage() {
  const { id } = useParams<{ id: string }>();

  const { data: campaign, isLoading } = useQuery({
    queryKey: ["marketing-campaign", id],
    queryFn: () => marketingApi.campaigns.get(id),
    enabled: !!id,
  });

  if (isLoading || !campaign) {
    return (
      <div className="p-6">
        <SectionLoader />
      </div>
    );
  }

  const editable = campaign.status === "draft" || campaign.status === "scheduled";

  if (!editable) {
    return (
      <div className="p-6">
        <div className="mx-auto max-w-lg space-y-4">
          <p className="text-sm text-muted-foreground">
            Only draft or scheduled campaigns can be edited. This one is{" "}
            <strong>{campaign.status}</strong>.
          </p>
          <Button
            nativeButton={false}
            render={<Link href="/marketing" />}
            variant="outline"
            size="sm"
          >
            Back to campaigns
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <PageHeader
          title={`Edit ${campaign.name}`}
          description={
            campaign.channel === "email"
              ? "Update your newsletter content and preview before sending."
              : "Update your SMS message and audience before sending."
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
        <CampaignForm campaign={campaign} />
      </div>
    </div>
  );
}
