"use client";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "./marketplace-storefront-shared";

export function CurrentBlock({
  items,
}: {
  items: { label: string; value: string; highlight?: string }[];
}) {
  return (
    <div className="rounded-xl border border-dashed border-primary/25 bg-primary/[0.03] p-4">
      <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-3">
        Live on your storefront now
      </p>
      <dl className="grid gap-2 sm:grid-cols-2">
        {items.map(({ label, value, highlight }) => (
          <div key={label} className="min-w-0">
            <dt className="text-[11px] text-muted-foreground">{label}</dt>
            <dd className="text-sm font-medium truncate flex items-center gap-2">
              {highlight ? (
                <span
                  className="inline-block h-3.5 w-3.5 shrink-0 rounded-full border"
                  style={{ background: highlight }}
                />
              ) : null}
              <span className="truncate">{value || "—"}</span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function EditField({
  label,
  value,
  onChange,
  placeholder,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold">{label}</Label>
      {multiline ? (
        <Textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="text-sm"
        />
      ) : (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="text-sm"
        />
      )}
    </div>
  );
}

export function EditToggle({
  label,
  sub,
  checked,
  onChange,
}: {
  label: string;
  sub?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border bg-muted/30 px-3 py-2.5">
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        {sub ? <p className="text-[11px] text-muted-foreground">{sub}</p> : null}
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

export type EditorSection = {
  id: string;
  label: string;
  short: string;
};

export function SectionNav({
  sections,
  active,
  onSelect,
}: {
  sections: EditorSection[];
  active: string;
  onSelect: (id: string) => void;
}) {
  return (
    <>
      <nav className="hidden lg:flex flex-col gap-1 sticky top-4">
        {sections.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelect(s.id)}
            className={cn(
              "rounded-lg px-3 py-2.5 text-left transition-colors",
              active === s.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "hover:bg-muted text-foreground/80",
            )}
          >
            <p className="text-sm font-semibold leading-tight">{s.label}</p>
            <p
              className={cn(
                "text-[11px] mt-0.5 leading-snug",
                active === s.id ? "text-primary-foreground/80" : "text-muted-foreground",
              )}
            >
              {s.short}
            </p>
          </button>
        ))}
      </nav>
      <select
        className="lg:hidden w-full rounded-lg border bg-background px-3 py-2.5 text-sm font-medium"
        value={active}
        onChange={(e) => onSelect(e.target.value)}
      >
        {sections.map((s) => (
          <option key={s.id} value={s.id}>
            {s.label}
          </option>
        ))}
      </select>
    </>
  );
}
