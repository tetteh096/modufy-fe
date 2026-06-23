export const TAX_TYPE_META = {
  vat: { label: "VAT (15%)", color: "hsl(132 42% 48%)" },
  nhil: { label: "NHIL (2.5%)", color: "hsl(38 80% 52%)" },
  getfund: { label: "GETFund (2.5%)", color: "hsl(262 45% 55%)" },
} as const;

export function taxPeriodOptions(count = 12): string[] {
  const opts: string[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - i);
    opts.push(d.toISOString().slice(0, 7));
  }
  return opts;
}

export function formatTaxPeriod(period: string): string {
  return new Date(period + "-01T12:00:00").toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
}

export function taxBreakdownEntries(
  vat: number,
  nhil: number,
  getfund: number
): { key: keyof typeof TAX_TYPE_META; amount: number; pct: number }[] {
  const total = vat + nhil + getfund;
  return [
    { key: "vat", amount: vat, pct: total > 0 ? (vat / total) * 100 : 0 },
    { key: "nhil", amount: nhil, pct: total > 0 ? (nhil / total) * 100 : 0 },
    { key: "getfund", amount: getfund, pct: total > 0 ? (getfund / total) * 100 : 0 },
  ];
}

export function totalTaxFromReturn(vat: number, nhil: number, getfund: number): number {
  return vat + nhil + getfund;
}
