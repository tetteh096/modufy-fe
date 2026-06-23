"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { marketplaceApi, getApiErrorMessage } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { CouponForm } from "@/components/features/marketplace/coupon-form";
import { Button } from "@/components/ui/button";

export default function NewCouponPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: marketplaceApi.coupons.create,
    onSuccess: (coupon) => {
      queryClient.invalidateQueries({ queryKey: ["marketplace-coupons"] });
      toast.success("Coupon created");
      router.push(`/marketplace/coupons/${coupon.id}/edit`);
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  return (
    <div className="space-y-6 p-6">
      <Button variant="ghost" size="sm" className="-ml-2 w-fit" nativeButton={false} render={<Link href="/marketplace/coupons" />}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Coupons
      </Button>

      <PageHeader
        title="New coupon"
        description="Create a checkout code like SAVE10 — customers enter it for a discount on their order"
      />

      <CouponForm
        busy={createMutation.isPending}
        submitLabel={createMutation.isPending ? "Creating…" : "Create coupon"}
        cancelHref="/marketplace/coupons"
        onSubmit={(body) => createMutation.mutate(body)}
      />
    </div>
  );
}
