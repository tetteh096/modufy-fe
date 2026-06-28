"use client";

import { CalendarCheck, Clock, MapPin, Scissors } from "lucide-react";
import type { PublicBusinessInfo } from "@/lib/public-api";

const highlights = [
  { icon: Scissors, label: "Pick a service" },
  { icon: Clock, label: "Choose a time" },
  { icon: CalendarCheck, label: "Confirm in seconds" },
];

export function BookingOrbitHero({ business }: { business: PublicBusinessInfo }) {
  return (
    <aside className="booking-panel-dark relative hidden min-h-full flex-col justify-between overflow-hidden p-10 lg:flex">
      <div className="relative z-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300/80">
          Book online
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">{business.name}</h2>
        {business.tagline ? (
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-400">{business.tagline}</p>
        ) : null}
      </div>

      <div className="relative z-10 mx-auto w-full max-w-sm space-y-3 py-6">
        {highlights.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/25">
              <Icon className="h-4 w-4" />
            </span>
            <p className="text-sm font-medium text-white">{label}</p>
          </div>
        ))}
      </div>

      <div className="relative z-10 space-y-3">
        <p className="text-sm leading-relaxed text-slate-400">
          Pick a service, choose your time, and confirm in under a minute.
        </p>
        {business.city ? (
          <p className="inline-flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin className="h-3.5 w-3.5 text-emerald-400" />
            {business.city}
          </p>
        ) : null}
      </div>
    </aside>
  );
}
