"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Bell, Check, Clock } from "lucide-react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

const BOOKINGS = [
  { day: 0, start: 1, span: 2, name: "Amara · Colour", tone: "green" },
  { day: 1, start: 0, span: 1, name: "Kojo · Cut", tone: "cream" },
  { day: 2, start: 2, span: 2, name: "Nana · Facial", tone: "green" },
  { day: 3, start: 1, span: 1, name: "Consult", tone: "ink" },
  { day: 4, start: 0, span: 2, name: "Ama · Blowout", tone: "cream" },
  { day: 5, start: 2, span: 1, name: "Open", tone: "open" },
] as const;

const SLOTS = ["9:00", "11:00", "1:00", "3:00", "5:00"] as const;

const toneClass: Record<(typeof BOOKINGS)[number]["tone"], string> = {
  green: "bg-brand-leaf-green text-white",
  cream: "bg-[#e8f0a8] text-[#1a2744]",
  ink: "bg-[#1a2744] text-white",
  open: "border border-dashed border-[#1a2744]/25 bg-white/60 text-[#1a2744]/45",
};

export function AppointmentsMockup() {
  const reduceMotion = useReducedMotion();
  const [highlight, setHighlight] = useState(0);
  const [toast, setToast] = useState<"deposit" | "reminder" | "invoice" | null>("deposit");

  useEffect(() => {
    if (reduceMotion) {
      setHighlight(2);
      setToast("reminder");
      return;
    }
    const id = window.setInterval(() => {
      setHighlight((i) => {
        const next = (i + 1) % BOOKINGS.length;
        const stages = ["deposit", "reminder", "invoice"] as const;
        setToast(stages[next % 3]);
        return next;
      });
    }, 2200);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  return (
    <div className="relative mx-auto w-full max-w-[540px]">
      <motion.div
        className="relative overflow-hidden rounded-[1.75rem] border border-[#1a2744]/10 bg-white shadow-[0_30px_80px_rgba(26,39,68,0.14)]"
        animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex items-center justify-between border-b border-[#1a2744]/08 px-5 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#1a2744]/40">
              This week
            </p>
            <p className="font-display text-lg font-bold text-[#1a2744]">Studio calendar</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-leaf-green/15 px-3 py-1 text-xs font-bold text-brand-leaf-green">
            <span className="relative flex h-1.5 w-1.5">
              <span className="pulse-dot-ring absolute inline-flex h-full w-full rounded-full bg-brand-leaf-green opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-leaf-green" />
            </span>
            12 booked
          </span>
        </div>

        <div className="grid grid-cols-[auto_1fr] gap-2 px-3 pb-3 pt-2 sm:px-4">
          <div className="flex flex-col gap-[18px] pt-9 text-[11px] font-semibold text-[#1a2744]/35">
            {SLOTS.map((slot) => (
              <span key={slot} className="h-8 leading-8">
                {slot}
              </span>
            ))}
          </div>

          <div className="min-w-0">
            <div className="mb-2 grid grid-cols-6 gap-1">
              {DAYS.map((day, i) => (
                <div
                  key={day}
                  className={`rounded-lg py-1.5 text-center text-xs font-bold ${
                    i === highlight % 6 ? "bg-[#e8f0a8] text-[#1a2744]" : "text-[#1a2744]/45"
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="relative grid h-[180px] grid-cols-6 gap-1 rounded-xl bg-[#f6f6f4] p-1 sm:h-[200px]">
              {BOOKINGS.map((booking, index) => {
                const active = index === highlight;
                return (
                  <motion.div
                    key={booking.name}
                    className={`absolute overflow-hidden rounded-lg px-1.5 py-1 text-[10px] font-semibold leading-tight sm:text-[11px] ${toneClass[booking.tone]}`}
                    style={{
                      left: `calc(${(booking.day / 6) * 100}% + 2px)`,
                      width: `calc(${100 / 6}% - 4px)`,
                      top: `${booking.start * 36 + 4}px`,
                      height: `${booking.span * 34}px`,
                    }}
                    animate={
                      reduceMotion
                        ? undefined
                        : active
                          ? { scale: 1.04, zIndex: 5 }
                          : { scale: 1, zIndex: 1 }
                    }
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  >
                    {booking.name}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-[#1a2744]/08 px-4 py-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={toast}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
              className="flex items-center gap-2.5 rounded-xl bg-[#f6f6f4] px-3 py-2.5 text-sm text-[#1a2744]"
            >
              {toast === "deposit" ? (
                <>
                  <Check className="h-4 w-4 text-brand-leaf-green" />
                  Deposit collected · slot confirmed
                </>
              ) : null}
              {toast === "reminder" ? (
                <>
                  <Bell className="h-4 w-4 text-brand-tangerine" />
                  SMS reminder sent · 2h before
                </>
              ) : null}
              {toast === "invoice" ? (
                <>
                  <Clock className="h-4 w-4 text-brand-leaf-green" />
                  Completed · invoice auto-created
                </>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
