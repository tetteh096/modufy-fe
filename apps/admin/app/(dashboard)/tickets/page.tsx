"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { LifeBuoy, Plus, ChevronRight, Mail, User, Search, Clock, CheckCircle2, MoreHorizontal, MessageSquare } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { getApiErrorMessage } from "@/lib/api";
import { SectionLoader } from "@/components/shared/page-loader";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const STATUS_CONFIG: Record<string, { label: string, color: string, bg: string, icon?: React.ElementType }> = {
  open: { label: "Open", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", icon: MessageSquare },
  in_progress: { label: "In Progress", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", icon: Clock },
  waiting_on_customer: { label: "Waiting on Customer", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20", icon: MoreHorizontal },
  resolved: { label: "Resolved", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20", icon: CheckCircle2 },
  closed: { label: "Closed", color: "text-muted-foreground", bg: "bg-muted/30 border-muted/20" },
};

export default function TicketsPage() {
  const qc = useQueryClient();
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    business_id: "none",
    assignee_user_id: "unassigned",
    requester_email: "",
    requester_name: "",
    subject: "",
    body: "",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["admin-tickets", status],
    queryFn: () => adminApi.tickets(status ? { status } : undefined),
  });

  const { data: bData } = useQuery({
    queryKey: ["admin-businesses-list"],
    queryFn: () => adminApi.businesses(),
  });

  const { data: teamData } = useQuery({
    queryKey: ["admin-team"],
    queryFn: () => adminApi.team(),
  });

  const allBusinesses = bData?.businesses ?? [];
  const team = teamData ?? [];

  const create = useMutation({
    mutationFn: () => adminApi.createTicket({
      ...form,
      business_id: form.business_id === "none" ? undefined : form.business_id,
      assignee_user_id: form.assignee_user_id === "unassigned" ? undefined : form.assignee_user_id,
    }),
    onSuccess: () => {
      toast.success("Ticket created");
      setOpen(false);
      setForm({ business_id: "none", assignee_user_id: "unassigned", requester_email: "", requester_name: "", subject: "", body: "" });
      qc.invalidateQueries({ queryKey: ["admin-tickets"] });
      qc.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const tickets = data?.tickets ?? [];
  const filteredTickets = tickets.filter(t => 
    search === "" || 
    t.subject?.toLowerCase().includes(search.toLowerCase()) || 
    t.requester_email?.toLowerCase().includes(search.toLowerCase()) ||
    t.number?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* ── HEADER SECTION ── */}
      <div className="relative rounded-2xl overflow-hidden p-8 border border-border/50 shadow-sm" style={{
        background: "linear-gradient(145deg, rgba(var(--background), 0.9), rgba(var(--background), 0.4))",
      }}>
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 rounded-full blur-[100px] opacity-20 pointer-events-none" 
          style={{ background: "var(--primary)" }} 
        />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 mb-2">
              <LifeBuoy className="h-3.5 w-3.5" />
              Support Center
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Customer Tickets
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Manage incoming support requests, track ongoing internal cases, and ensure every merchant gets the help they need.
            </p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={
              <Button size="lg" className="shrink-0 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all font-semibold">
                <Plus className="h-5 w-5 mr-2" />
                New Ticket
              </Button>
            } />
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create new support ticket</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4 max-h-[70vh] overflow-y-auto px-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Select value={form.business_id} onValueChange={(v) => setForm((f) => ({ ...f, business_id: v || "none" }))}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Company" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No company</SelectItem>
                        {allBusinesses.map((b) => (
                          <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Select value={form.assignee_user_id} onValueChange={(v) => setForm((f) => ({ ...f, assignee_user_id: v || "unassigned" }))}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Assign to" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {team.map((t) => (
                          <SelectItem key={t.user_id} value={t.user_id}>{t.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Input placeholder="Requester email" type="email" value={form.requester_email}
                    onChange={(e) => setForm((f) => ({ ...f, requester_email: e.target.value }))} 
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Input placeholder="Requester name (optional)" value={form.requester_name}
                    onChange={(e) => setForm((f) => ({ ...f, requester_name: e.target.value }))} 
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Input placeholder="Ticket subject" value={form.subject}
                    onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} 
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <textarea
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                    placeholder="Describe the issue in detail..."
                    value={form.body}
                    onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                  />
                </div>
                <Button className="w-full h-11 font-semibold" disabled={create.isPending}
                  onClick={() => create.mutate()}>
                  Create Ticket
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* ── FILTER & SEARCH BAR ── */}
      <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
        
        {/* Status Pills */}
        <div className="flex bg-muted/40 p-1 rounded-xl w-full sm:w-auto overflow-x-auto no-scrollbar border border-border/50 shadow-inner">
          {[{ id: "", label: "All Tickets" }, ...Object.entries(STATUS_CONFIG).map(([k, v]) => ({ id: k, label: v.label }))].map((s) => (
            <button
              key={s.id}
              onClick={() => setStatus(s.id)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all duration-200",
                status === s.id 
                  ? "bg-background text-foreground shadow-sm ring-1 ring-border" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search tickets by ID, subject, email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 bg-background border-border/60 rounded-xl shadow-sm focus-visible:ring-primary/30"
          />
        </div>
      </div>

      {/* ── TICKETS LIST ── */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="bg-card/30 border border-border/50 rounded-2xl h-64 flex items-center justify-center">
            <SectionLoader />
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="bg-card/30 border border-border/50 rounded-2xl py-20 shadow-sm">
            <EmptyState 
              icon={<LifeBuoy className="h-10 w-10 text-primary/60" />} 
              title={search ? "No tickets found" : "Inbox zero!"} 
              description={search ? `No tickets match your search for "${search}".` : "There are no tickets matching this status. Great job!"} 
            />
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredTickets.map((t) => {
              const config = STATUS_CONFIG[t.status] || STATUS_CONFIG.closed;
              return (
                <Link
                  key={t.id}
                  href={`/tickets/${t.id}`}
                  className="group relative flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-200"
                >
                  
                  {/* Left: ID & Status */}
                  <div className="flex flex-row sm:flex-col items-center sm:items-start gap-3 sm:w-40 shrink-0">
                    <span className="font-mono text-xs font-semibold text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                      {t.number}
                    </span>
                    <Badge variant="outline" className={cn("capitalize border px-2.5 py-0.5 shadow-none font-medium text-[11px]", config.bg, config.color)}>
                      {config.label}
                    </Badge>
                  </div>

                  {/* Middle: Subject & Meta */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="font-semibold text-foreground text-[15px] truncate group-hover:text-primary transition-colors">
                        {t.subject}
                      </h3>
                      {t.priority === "urgent" && (
                        <Badge variant="destructive" className="h-5 px-1.5 text-[10px] uppercase font-bold tracking-wider">Urgent</Badge>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 opacity-70" />
                        <span className="truncate max-w-[200px]">{t.requester_email}</span>
                      </div>
                      
                      {t.business_name && (
                        <div className="flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 opacity-70" />
                          <span className="truncate max-w-[150px]">{t.business_name}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Chevron */}
                  <div className="hidden sm:flex shrink-0 h-10 w-10 items-center justify-center rounded-full bg-muted/50 group-hover:bg-primary/10 group-hover:text-primary text-muted-foreground transition-colors ml-4">
                    <ChevronRight className="h-5 w-5" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
