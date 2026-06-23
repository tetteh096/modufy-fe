/** Chart of accounts for manual journal entries */
export const JOURNAL_ACCOUNTS = [
  { code: "1000", name: "Cash in Hand" },
  { code: "1010", name: "MTN MoMo" },
  { code: "1011", name: "Vodacash" },
  { code: "1012", name: "Airtel Money" },
  { code: "1020", name: "Bank Account" },
  { code: "1100", name: "Accounts Receivable" },
  { code: "1200", name: "Inventory" },
  { code: "2000", name: "Accounts Payable" },
  { code: "2100", name: "VAT Payable" },
  { code: "2110", name: "NHIL Payable" },
  { code: "2120", name: "GETFund Payable" },
  { code: "3000", name: "Owner's Equity" },
  { code: "4000", name: "Product Sales" },
  { code: "4100", name: "Service Revenue" },
  { code: "4900", name: "Other Income" },
  { code: "5000", name: "Cost of Goods Sold" },
  { code: "5100", name: "Rent" },
  { code: "5110", name: "Transport / Delivery" },
  { code: "5120", name: "Staff Wages" },
  { code: "5130", name: "Marketing" },
  { code: "5140", name: "Supplies" },
  { code: "5150", name: "Utilities" },
  { code: "5160", name: "Phone / Data" },
  { code: "5900", name: "Other Expenses" },
] as const;

export type JournalSourceFilter = "all" | "sales" | "invoices" | "expenses" | "inventory" | "appointments" | "manual";

export const JOURNAL_SOURCE_OPTIONS: { value: JournalSourceFilter; label: string }[] = [
  { value: "all", label: "All sources" },
  { value: "sales", label: "Sales" },
  { value: "invoices", label: "Invoices" },
  { value: "expenses", label: "Expenses" },
  { value: "inventory", label: "Inventory" },
  { value: "appointments", label: "Appointments" },
  { value: "manual", label: "Manual" },
];

export const JOURNAL_SOURCE_META: Record<
  string,
  { label: string; className: string }
> = {
  sales: {
    label: "Sales",
    className: "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20",
  },
  invoices: {
    label: "Invoices",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  expenses: {
    label: "Expenses",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  inventory: {
    label: "Inventory",
    className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  },
  appointments: {
    label: "Appointments",
    className: "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20",
  },
  manual: {
    label: "Manual",
    className: "bg-muted text-muted-foreground border-border",
  },
};

export const JOURNAL_AUTO_POST_HINTS = [
  {
    title: "Direct sales & POS",
    description: "Manual sales and register checkouts post Dr Cash/MoMo · Cr Product Sales.",
  },
  {
    title: "Paid invoices",
    description: "Sent invoices post Dr Accounts Receivable · Cr Revenue and tax. Payments post Dr Cash · Cr AR.",
  },
  {
    title: "Logged expenses",
    description: "Each expense posts Dr expense account · Cr Cash or bank.",
  },
  {
    title: "Stock movements",
    description: "Inventory restocks and write-offs update stock and COGS accounts.",
  },
] as const;
