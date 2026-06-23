"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { getApiErrorMessage } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { SectionLoader } from "@/components/shared/page-loader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SupportSessionPanel } from "@/components/features/admin/support-session-panel";

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();
  const [reply, setReply] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-ticket", id],
    queryFn: () => adminApi.ticket(id),
  });

  const updateStatus = useMutation({
    mutationFn: (status: string) => adminApi.updateTicket(id, { status }),
    onSuccess: () => {
      toast.success("Ticket updated");
      qc.invalidateQueries({ queryKey: ["admin-ticket", id] });
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const sendReply = useMutation({
    mutationFn: () => adminApi.addTicketMessage(id, reply),
    onSuccess: () => {
      toast.success("Reply added");
      setReply("");
      qc.invalidateQueries({ queryKey: ["admin-ticket", id] });
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  if (isLoading || !data) return <SectionLoader className="py-16" />;

  const { ticket, messages } = data;

  return (
    <div>
      <Button variant="ghost" size="sm" className="mb-4" render={<Link href="/tickets" />}>
        <ArrowLeft className="h-4 w-4 mr-1" />
        Tickets
      </Button>

      <PageHeader
        title={ticket.subject}
        description={`${ticket.number} · ${ticket.requester_email}${ticket.business_name ? ` · ${ticket.business_name}` : ""}`}
        action={
          <div className="flex gap-2">
            {ticket.status !== "in_progress" && (
              <Button size="sm" variant="outline" onClick={() => updateStatus.mutate("in_progress")}>
                Start work
              </Button>
            )}
            {ticket.status !== "resolved" && (
              <Button size="sm" onClick={() => updateStatus.mutate("resolved")}>
                Resolve
              </Button>
            )}
          </div>
        }
      />

      <div className="flex gap-2 mb-6">
        <Badge>{ticket.status.replace(/_/g, " ")}</Badge>
        <Badge variant="outline">{ticket.priority}</Badge>
        {ticket.business_id && (
          <Button size="sm" variant="link" className="h-auto p-0" render={<Link href={`/businesses/${ticket.business_id}`} />}>
            View business
          </Button>
        )}
      </div>

      {ticket.business_id && (
        <div className="mb-6">
          <SupportSessionPanel businessId={ticket.business_id} ticketId={ticket.id} />
        </div>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-sm">Thread</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {messages.map((m) => (
            <div key={m.id} className="text-sm border-l-2 border-muted pl-3">
              <p className="text-xs text-muted-foreground">
                {m.author_name || m.author_type} · {new Date(m.created_at).toLocaleString()}
              </p>
              <p className="mt-1 whitespace-pre-wrap">{m.body}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4 space-y-3">
          <textarea
            className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
            placeholder="Internal reply or note…"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />
          <Button disabled={!reply.trim() || sendReply.isPending} onClick={() => sendReply.mutate()}>
            Add reply
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
