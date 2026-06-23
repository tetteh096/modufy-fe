"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Settings } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { getApiErrorMessage } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { SectionLoader } from "@/components/shared/page-loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const qc = useQueryClient();
  const { data: currencies, isLoading } = useQuery({
    queryKey: ["admin-currencies"],
    queryFn: () => adminApi.currencies(),
  });

  const toggle = useMutation({
    mutationFn: ({ code, enabled }: { code: string; enabled: boolean }) =>
      adminApi.updateCurrency(code, { enabled }),
    onSuccess: () => {
      toast.success("Currency updated");
      qc.invalidateQueries({ queryKey: ["admin-currencies"] });
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  return (
    <div>
      <PageHeader title="Settings" description="Platform configuration." />

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Supported currencies
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <SectionLoader className="py-8" />
          ) : (
            <div className="divide-y">
              {(currencies ?? []).map((c) => (
                <div key={c.code} className="flex items-center gap-4 px-5 py-3">
                  <span className="font-mono font-semibold w-12">{c.code}</span>
                  <span className="text-lg w-8">{c.symbol}</span>
                  <span className="flex-1 text-sm">{c.name}</span>
                  <Badge variant={c.enabled ? "default" : "secondary"}>
                    {c.enabled ? "enabled" : "disabled"}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                    disabled={toggle.isPending}
                    onClick={() => toggle.mutate({ code: c.code, enabled: !c.enabled })}
                  >
                    {c.enabled ? "Disable" : "Enable"}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
