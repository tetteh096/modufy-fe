"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Filter, RotateCcw } from "lucide-react";
import { appointmentsApi } from "@/lib/api";
import { AppointmentsListTable } from "@/components/features/appointments/appointments-list-table";
import type { AppointmentStatusFilter } from "@/components/features/appointments/appointments-calendar-types";
import { ListPagination } from "@/components/shared/list-pagination";
import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DEFAULT_PAGE_SIZE = 20;

type AppointmentsListProps = {
  statusFilter: AppointmentStatusFilter;
};

export function AppointmentsList({ statusFilter }: AppointmentsListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
  const pageSize = Number(searchParams.get("pageSize") ?? String(DEFAULT_PAGE_SIZE)) || DEFAULT_PAGE_SIZE;
  const fromDate = searchParams.get("from") ?? "";
  const toDate = searchParams.get("to") ?? "";

  const [draftFrom, setDraftFrom] = useState(fromDate);
  const [draftTo, setDraftTo] = useState(toDate);

  useEffect(() => {
    setDraftFrom(fromDate);
    setDraftTo(toDate);
  }, [fromDate, toDate]);

  const updateParams = (patch: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", "list");
    for (const [key, value] of Object.entries(patch)) {
      if (value === null || value === "") params.delete(key);
      else params.set(key, value);
    }
    router.replace(`/appointments?${params.toString()}`, { scroll: false });
  };

  const applyDateFilter = () => {
    updateParams({
      from: draftFrom || null,
      to: draftTo || null,
      page: "1",
    });
  };

  const clearDateFilter = () => {
    setDraftFrom("");
    setDraftTo("");
    updateParams({ from: null, to: null, page: "1" });
  };

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [
      "appointments",
      "list",
      statusFilter,
      fromDate,
      toDate,
      page,
      pageSize,
    ],
    queryFn: () =>
      appointmentsApi.list({
        from: fromDate || undefined,
        to: toDate || undefined,
        status: statusFilter === "all" ? undefined : statusFilter,
        limit: pageSize,
        offset: (page - 1) * pageSize,
      }),
  });

  const appointments = data?.appointments ?? [];
  const total = data?.total ?? 0;

  return (
    <div className="space-y-0">
      <div className="mb-4 flex flex-col gap-4 border-b pb-4 sm:flex-row sm:flex-wrap sm:items-end">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Filter className="h-4 w-4" />
          Date range
        </div>
        <div className="grid flex-1 gap-3 sm:grid-cols-2 md:max-w-md">
          <div className="space-y-1.5">
            <Label htmlFor="appt-from" className="text-xs">
              From
            </Label>
            <Input
              id="appt-from"
              type="date"
              value={draftFrom}
              onChange={(e) => setDraftFrom(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="appt-to" className="text-xs">
              To
            </Label>
            <Input
              id="appt-to"
              type="date"
              value={draftTo}
              onChange={(e) => setDraftTo(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" onClick={applyDateFilter}>
            Apply
          </Button>
          {(fromDate || toDate) && (
            <Button type="button" size="sm" variant="outline" onClick={clearDateFilter}>
              <RotateCcw className="h-3.5 w-3.5" />
              Clear dates
            </Button>
          )}
        </div>
      </div>

      <p className="mb-3 text-xs text-muted-foreground">
        Sorted earliest first
        {statusFilter !== "all" ? ` · Status: ${statusFilter.replace(/_/g, " ")}` : ""}
        {fromDate || toDate
          ? ` · ${fromDate || "…"} to ${toDate || "…"}`
          : " · All dates"}
      </p>

      {isLoading ? (
        <div className="flex min-h-[16rem] items-center justify-center">
          <Spinner className="h-6 w-6" />
        </div>
      ) : (
        <>
          <AppointmentsListTable appointments={appointments} />
          <ListPagination
            page={page}
            pageSize={pageSize}
            total={total}
            itemLabel="appointment"
            onPageChange={(p) => updateParams({ page: String(p) })}
            onPageSizeChange={(size) =>
              updateParams({ pageSize: String(size), page: "1" })
            }
          />
        </>
      )}

      {isFetching && !isLoading ? (
        <p className="px-4 py-2 text-center text-xs text-muted-foreground md:px-6">
          Updating…
        </p>
      ) : null}
    </div>
  );
}
