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
import { CouponForm } from "@/components/features/marketplace/coupon-form";
import { Button } from "@/components/ui/button";

export default function EditCouponPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: coupon, isLoading } = useQuery({
    queryKey: ["marketplace-coupon", id],
    queryFn: () => marketplaceApi.coupons.get(id),
  });

  const updateMutation = useMutation({
    mutationFn: (body: Parameters<typeof marketplaceApi.coupons.update>[1]) =>
      marketplaceApi.coupons.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketplace-coupons"] });
      queryClient.invalidateQueries({ queryKey: ["marketplace-coupon", id] });
      toast.success("Coupon saved");
      router.push("/marketplace/coupons");
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  if (isLoading) return <PageLoader />;
  if (!coupon) return null;

  return (
    <div className="space-y-6 p-6">
      <Button variant="ghost" size="sm" className="-ml-2 w-fit" nativeButton={false} render={<Link href="/marketplace/coupons" />}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Coupons
      </Button>

      <PageHeader
        title={`Edit ${coupon.code}`}
        description="Update discount, limits, eligible customers, and schedule"
      />

      <CouponForm
        key={coupon.id}
        initial={coupon}
        busy={updateMutation.isPending}
        submitLabel={updateMutation.isPending ? "Saving…" : "Save changes"}
        cancelHref="/marketplace/coupons"
        onSubmit={(body) => updateMutation.mutate(body)}
      />
    </div>
  );
}
