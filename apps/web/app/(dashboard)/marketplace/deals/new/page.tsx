"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { marketplaceApi, getApiErrorMessage } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { PromotionForm } from "@/components/features/marketplace/promotion-form";
import { Button } from "@/components/ui/button";

export default function NewDealPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: marketplaceApi.promotions.create,
    onSuccess: (deal) => {
      queryClient.invalidateQueries({ queryKey: ["marketplace-promotions"] });
      toast.success("Deal created");
      router.push(`/marketplace/deals/${deal.id}/edit`);
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  return (
    <div className="space-y-6 p-6">
      <Button variant="ghost" size="sm" className="-ml-2 w-fit" nativeButton={false} render={<Link href="/marketplace/deals" />}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Deals & promotions
      </Button>

      <PageHeader
        title="New deal"
        description="Name your promo, set the discount, and choose which products are included"
      />

      <PromotionForm
        busy={createMutation.isPending}
        submitLabel={createMutation.isPending ? "Creating…" : "Create deal"}
        cancelHref="/marketplace/deals"
        onSubmit={(body) => createMutation.mutate(body)}
      />
    </div>
  );
}
