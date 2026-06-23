import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  FileText,
  ShieldCheck,
  TrendingUp,
  Wallet,
} from "lucide-react";

const badges = ["GHS-first", "VAT-ready", "MoMo payments"];

export function AuthBrandPanel() {
  return (
    <aside className="auth-panel-dark relative hidden lg:flex lg:w-1/2 shrink-0 flex-col justify-between overflow-hidden p-10 xl:p-12">
      <div className="relative z-10">
        <Link href="/login" className="inline-flex items-center gap-2.5 group">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 ring-1 ring-emerald-400/30 shadow-[0_0_24px_-4px_rgba(34,197,94,0.5)] transition-shadow group-hover:shadow-[0_0_32px_-4px_rgba(34,197,94,0.7)]">
            <Building2 className="h-5 w-5 text-emerald-300" />
          </span>
          <span className="text-xl font-bold tracking-tight text-white">BizOS</span>
        </Link>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-sm py-8">
        <div className="auth-mock-card relative overflow-hidden rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">Today&apos;s sales</p>
              <p className="mt-1 text-2xl font-bold tracking-tight text-white">
                GHS 4,280<span className="text-slate-400 text-base font-semibold">.50</span>
              </p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-400/25">
              <TrendingUp className="h-3 w-3" />
              +18%
            </span>
          </div>

          <div className="mt-4 flex items-end gap-1.5 h-16" aria-hidden>
            {[34, 52, 40, 64, 48, 78, 58, 92, 70, 100, 84, 96].map((h, i) => (
              <span
                key={i}
                className="auth-mock-bar flex-1 rounded-t-md"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/[0.04] ring-1 ring-white/10 p-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300">
                <FileText className="h-3.5 w-3.5" />
              </span>
              <p className="mt-2 text-sm font-semibold text-white">INV-0241 paid</p>
              <p className="text-xs text-slate-400">GHS 1,150.00 via MoMo</p>
            </div>
            <div className="rounded-xl bg-white/[0.04] ring-1 ring-white/10 p-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300">
                <Wallet className="h-3.5 w-3.5" />
              </span>
              <p className="mt-2 text-sm font-semibold text-white">Cash flow</p>
              <p className="text-xs text-slate-400 inline-flex items-center gap-1">
                Healthy <ArrowUpRight className="h-3 w-3 text-emerald-400" />
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 space-y-5">
        <h1 className="text-3xl xl:text-4xl font-bold leading-[1.15] tracking-tight text-white">
          Your business,
          <br />
          <span className="text-emerald-300">running on clarity.</span>
        </h1>
        <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
          Sales, invoices, and accounts in one place. Built for Ghana.
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          </span>
          {badges.map((badge) => (
            <span
              key={badge}
              className="rounded-full bg-white/[0.06] px-2.5 py-1 text-xs font-medium text-slate-300 ring-1 ring-white/10"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}

export function AuthMobileStrip() {
  return (
    <div className="auth-mobile-strip lg:hidden px-5 py-6">
      <Link href="/login" className="inline-flex items-center gap-2 mb-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15 ring-1 ring-emerald-400/30">
          <Building2 className="h-4 w-4 text-emerald-300" />
        </span>
        <span className="text-lg font-bold text-white">BizOS</span>
      </Link>
      <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
        Sales, invoices, and accounts in one place. Built for Ghana.
      </p>
    </div>
  );
}
