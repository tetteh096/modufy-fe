"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { LifeBuoy, Plus, ChevronRight } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { getApiErrorMessage } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { SectionLoader } from "@/components/shared/page-loader";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";

const STATUS_COLORS: Record<string, string> = {
  open: "bg-blue-500/10 text-blue-600",
  in_progress: "bg-amber-500/10 text-amber-600",
  waiting_on_customer: "bg-purple-500/10 text-purple-600",
  resolved: "bg-green-500/10 text-green-600",
  closed: "bg-muted text-muted-foreground",
};

export default function TicketsPage() {
  const qc = useQueryClient();
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    requester_email: "",
    requester_name: "",
    subject: "",
    body: "",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["admin-tickets", status],
    queryFn: () => adminApi.tickets(status ? { status } : undefined),
  });

  const create = useMutation({
    mutationFn: () => adminApi.createTicket(form),
    onSuccess: () => {
      toast.success("Ticket created");
      setOpen(false);
      setForm({ requester_email: "", requester_name: "", subject: "", body: "" });
      qc.invalidateQueries({ queryKey: ["admin-tickets"] });
      qc.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const tickets = data?.tickets ?? [];

  return (
    <div>
      <PageHeader
        title="Support tickets"
        description="Customer issues and internal support cases."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button size="sm"><Plus className="h-4 w-4 mr-1" />New ticket</Button>} />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create ticket</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 pt-2">
                <Input placeholder="Requester email" value={form.requester_email}
                  onChange={(e) => setForm((f) => ({ ...f, requester_email: e.target.value }))} />
                <Input placeholder="Requester name (optional)" value={form.requester_name}
                  onChange={(e) => setForm((f) => ({ ...f, requester_name: e.target.value }))} />
                <Input placeholder="Subject" value={form.subject}
                  onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} />
                <textarea
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  placeholder="Description"
                  value={form.body}
                  onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                />
                <Button className="w-full" disabled={create.isPending}
                  onClick={() => create.mutate()}>
                  Create
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="flex gap-2 mb-4 flex-wrap">
        {["", "open", "in_progress", "waiting_on_customer", "resolved", "closed"].map((s) => (
          <Button
            key={s || "all"}
            size="sm"
            variant={status === s ? "default" : "outline"}
            onClick={() => setStatus(s)}
          >
            {s === "" ? "All" : s.replace(/_/g, " ")}
          </Button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <SectionLoader className="py-12" />
          ) : tickets.length === 0 ? (
            <EmptyState icon={<LifeBuoy className="h-8 w-8" />} title="No tickets" description="Create one when a merchant needs help." />
          ) : (
            <div className="divide-y">
              {tickets.map((t) => (
                <Link
                  key={t.id}
                  href={`/tickets/${t.id}`}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs text-muted-foreground">{t.number}</span>
                      <Badge className={STATUS_COLORS[t.status] ?? ""}>{t.status.replace(/_/g, " ")}</Badge>
                      {t.priority === "urgent" && <Badge variant="destructive">urgent</Badge>}
                    </div>
                    <p className="font-medium text-sm mt-0.5 truncate">{t.subject}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {t.requester_email}{t.business_name ? ` · ${t.business_name}` : ""}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
