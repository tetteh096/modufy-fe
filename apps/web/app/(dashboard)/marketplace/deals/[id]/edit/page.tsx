"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { marketplaceApi, getApiErrorMessage } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { PageLoader } from "@/components/shared/page-loader";
import { PromotionForm } from "@/components/features/marketplace/promotion-form";
import { Button } from "@/components/ui/button";

export default function EditDealPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: deal, isLoading } = useQuery({
    queryKey: ["marketplace-promotion", id],
    queryFn: () => marketplaceApi.promotions.get(id),
  });

  const updateMutation = useMutation({
    mutationFn: (body: Parameters<typeof marketplaceApi.promotions.update>[1]) =>
      marketplaceApi.promotions.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketplace-promotions"] });
      queryClient.invalidateQueries({ queryKey: ["marketplace-promotion", id] });
      toast.success("Deal saved");
      router.push("/marketplace/deals");
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  if (isLoading) return <PageLoader />;
  if (!deal) return null;

  return (
    <div className="space-y-6 p-6">
      <Button variant="ghost" size="sm" className="-ml-2 w-fit" nativeButton={false} render={<Link href="/marketplace/deals" />}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Deals & promotions
      </Button>

      <PageHeader title={`Edit ${deal.name}`} description="Update discount, schedule, products, and visibility" />

      <PromotionForm
        key={deal.id}
        initial={deal}
        busy={updateMutation.isPending}
        submitLabel={updateMutation.isPending ? "Saving…" : "Save changes"}
        cancelHref="/marketplace/deals"
        onSubmit={(body) => updateMutation.mutate(body)}
      />
    </div>
  );
}
