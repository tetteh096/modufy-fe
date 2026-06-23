// ─── Generic ──────────────────────────────────────────────────────────────────

export type ApiResponse<T> = {
  data: T;
  error?: string;
};

// ─── Business ─────────────────────────────────────────────────────────────────

export type BusinessHoursDay = {
  day_of_week: number;
  is_closed: boolean;
  open_time: string;
  close_time: string;
};

export type BusinessCurrencySetting = {
  code: string;
  symbol: string;
  name: string;
  enabled: boolean;
};

export type Business = {
  id: string;
  name: string;
  slug: string;
  logo: string;
  logo_url: string;
  brand_color: string;
  tagline: string;
  category: string;
  country: string;
  city: string;
  area: string;
  latitude?: number | null;
  longitude?: number | null;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  default_currency: string;
  display_currency_mode: string;
  exchange_rate_mode: string;
  vat_registered: boolean;
  tax_id: string;
  vsdc_configured: boolean;
  hours_enabled: boolean;
  show_hours: boolean;
  hours: BusinessHoursDay[];
  currencies: BusinessCurrencySetting[];
};

export type UpdateBusinessHoursRequest = {
  hours_enabled?: boolean;
  show_hours?: boolean;
  hours?: BusinessHoursDay[];
};

export type UpdateBusinessRequest = {
  name?: string;
  slug?: string;
  tagline?: string;
  category?: string;
  country?: string;
  city?: string;
  area?: string;
  location_set?: boolean;
  latitude?: number;
  longitude?: number;
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  default_currency?: string;
  brand_color?: string;
  display_currency_mode?: string;
  exchange_rate_mode?: string;
  vat_registered?: boolean;
  tax_id?: string;
};

export type UpdateCurrencySettingsRequest = {
  default_currency?: string;
  display_currency_mode?: string;
  exchange_rate_mode?: string;
  currencies: { code: string; enabled: boolean }[];
};

export type BusinessModule = {
  module: string;
  enabled: boolean;
  enabled_at: string | null;
};

// ─── Customers ────────────────────────────────────────────────────────────────

export type Customer = {
  id: string;
  customer_type: string;
  name: string;
  contact_name: string;
  tax_id: string;
  display_name: string;
  phone: string;
  email: string;
  address: string;
  tags: string[];
  preferred_currency: string;
  notes: string;
  source?: CustomerSource;
  total_owed: number;
  last_transaction_at: string | null;
};

export type CustomerSource = "website" | "manual";

export type CustomerTimelineEvent = {
  id: string;
  type: string;
  title: string;
  amount: number;
  currency: string;
  status: string;
  reference: string;
  occurred_at: string;
};

export type CustomerDetail = Customer & {
  timeline: CustomerTimelineEvent[];
};

export type CustomerListData = {
  customers: Customer[];
  total: number;
};

export type CreateCustomerRequest = {
  customer_type?: string;
  name: string;
  contact_name?: string;
  tax_id?: string;
  phone?: string;
  email?: string;
  address?: string;
  tags?: string[];
  preferred_currency?: string;
  notes?: string;
};

export type CustomerType = "individual" | "company";

export type UpdateCustomerRequest = {
  customer_type?: string;
  name?: string;
  contact_name?: string;
  tax_id?: string;
  phone?: string;
  email?: string;
  address?: string;
  tags?: string[];
  preferred_currency?: string;
  notes?: string;
};

// ─── Team ─────────────────────────────────────────────────────────────────────

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  phone: string;
  active: boolean;
  roles: string[];
  last_seen_at: string | null;
};

export type TeamInvite = {
  id: string;
  email: string;
  phone: string;
  role: string;
  expires_at: string;
  created_at: string;
};

export type TeamListData = {
  members: TeamMember[];
  pending_invites: TeamInvite[];
};

export type TeamInviteCreated = {
  invite_id?: string;
  token?: string;
  join_path?: string;
  expires_at?: string;
  role: string;
  provisioned: boolean;
  user_id?: string;
  temp_password?: string;
  login_path?: string;
  delivery_note?: string;
};

export type TeamPermission = {
  key: string;
  module: string;
  resource: string;
  action: string;
  description: string;
};

export type TeamRoleWithPermissions = {
  id: string;
  name: string;
  display_name: string;
  description: string;
  is_system: boolean;
  editable: boolean;
  deletable: boolean;
  permissions: string[];
  uses_override: boolean;
  member_count: number;
};

export type TeamRolesData = {
  roles: TeamRoleWithPermissions[];
  permissions: TeamPermission[];
  enabled_modules?: string[] | null;
};

export type TeamActivityEvent = {
  event: string;
  description: string;
  at: string;
  actor_name?: string;
  resource_label?: string;
};

export type AuditEvent = {
  id: string;
  action: string;
  description: string;
  actor_user_id: string | null;
  actor_name: string;
  resource_type: string;
  resource_id: string;
  resource_label: string;
  metadata?: Record<string, unknown>;
  created_at: string;
};

export type AuditListData = {
  events: AuditEvent[];
  total: number;
};

export type TeamMemberDetail = TeamMember & {
  permissions: string[];
  role_permissions: string[];
  permission_overrides: UserPermissionOverride[];
  uses_permission_overrides: boolean;
  can_manage_permissions: boolean;
  created_at: string;
  activity: TeamActivityEvent[];
  can_reset_password: boolean;
};

export type UserPermissionOverride = {
  key: string;
  allowed: boolean;
};

export type ResetMemberPasswordResult = {
  temp_password: string;
  delivery_note: string;
};

export type AccountProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar_url: string;
  role: string;
  has_login: boolean;
  last_seen_at?: string;
  created_at: string;
};

export type UpdateAccountProfileRequest = {
  name: string;
  phone?: string;
};

export type InvitePreview = {
  business_name: string;
  role: string;
  email: string;
  phone: string;
  expires_at: string;
};

// ─── Notifications ────────────────────────────────────────────────────────────

export type Notification = {
  id: string;
  event: string;
  title: string;
  body: string;
  read: boolean;
  read_at: string | null;
  created_at: string;
};

export type NotificationListData = {
  notifications: Notification[];
  unread_count: number;
};

// ─── Attention ────────────────────────────────────────────────────────────────

export type AttentionItem = {
  id: string;
  category: string;
  type: string;
  severity: string;
  title: string;
  body: string;
  amount?: number;
  currency?: string;
  href: string;
  at: string;
};

export type AttentionListData = {
  items: AttentionItem[];
  count: number;
  summary: { critical: number; warning: number; info: number };
  by_category: Record<string, number>;
};

// ─── Alert Rules ──────────────────────────────────────────────────────────────

export type AlertRule = {
  event_type: string;
  category: string;
  label: string;
  description: string;
  enabled: boolean;
  days_before: number;
  hours_before: number;
  day_of_month: number;
  in_app: boolean;
};

export type AlertRuleListData = {
  rules: AlertRule[];
};

// ─── Sales ────────────────────────────────────────────────────────────────────

export type SaleLine = {
  id: string;
  description: string;
  product_id: string | null;
  quantity: number;
  unit_price: number;
  total: number;
};

export type Sale = {
  id: string;
  customer_id: string | null;
  customer_name: string;
  currency: string;
  exchange_rate: number;
  total: number;
  payment_method: string;
  note: string;
  status?: "pending" | "completed" | "cancelled";
  source_type?: string;
  source_id?: string | null;
  receipt_number?: string;
  pos_session_id?: string | null;
  sale_date: string;
  lines: SaleLine[];
  amount_paid?: number;
  amount_due?: number;
  linked_appointment_id?: string;
  linked_invoice_id?: string;
};

export type SaleListData = {
  sales: Sale[];
  total: number;
};

export type RecordSaleRequest = {
  customer_id?: string | null;
  currency: string;
  exchange_rate?: number;
  payment_method: string;
  note?: string;
  sale_date: string;
  lines: { description: string; product_id?: string | null; quantity: number; unit_price: number }[];
};

export type TopItem = {
  description: string;
  quantity: number;
  revenue: number;
};

export type SaleTopItem = TopItem;

export type SaleSummary = {
  date: string;
  total_revenue: number;
  total_expenses: number;
  net_position: number;
  transaction_count: number;
  by_payment_method: Record<string, number>;
  top_items: TopItem[];
};

export type SalesTrendDay = {
  date: string;
  total: number;
  count: number;
};

export type SalesTrends = {
  days: number;
  data: SalesTrendDay[];
  currency?: string;
};

// ─── Expenses ─────────────────────────────────────────────────────────────────

export type Expense = {
  id: string;
  category: string;
  amount: number;
  currency: string;
  exchange_rate: number;
  note: string;
  receipt: string;
  payment_method: string;
  expense_date: string;
};

export type ExpenseListData = {
  expenses: Expense[];
  total: number;
};

export type ExpenseSummary = {
  date: string;
  total_expenses: number;
  transaction_count: number;
  by_category: Record<string, number>;
};

export type ExpenseTrendDay = {
  date: string;
  total: number;
  count: number;
};

export type ExpenseTrends = {
  days: number;
  data: ExpenseTrendDay[];
};

export type LogExpenseRequest = {
  category: string;
  amount: number;
  currency: string;
  exchange_rate?: number;
  note?: string;
  payment_method?: string;
  expense_date: string;
};

// ─── Invoices ─────────────────────────────────────────────────────────────────

export type InvoiceDocType = "invoice" | "quote" | "proforma";

export type InvoiceTemplate = "modern" | "classic" | "minimal";

export type InvoiceLine = {
  id: string;
  description: string;
  product_id: string | null;
  service_id: string | null;
  quantity: number;
  unit_price: number;
  discount: number;
  total: number;
};

export type InvoicePayment = {
  id: string;
  amount: number;
  currency: string;
  method: string;
  reference: string;
  paid_at: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  number: string;
  status: "draft" | "sent" | "viewed" | "partial" | "overdue" | "paid" | "cancelled" | "pending_vsdc";
  type: InvoiceDocType;
  linked_quote_id?: string | null;
  currency: string;
  exchange_rate: number;
  subtotal: number;
  vat_amount: number;
  nhil_amount: number;
  getfund_amount: number;
  discount_amount: number;
  total: number;
  amount_paid: number;
  amount_due: number;
  due_date: string | null;
  notes: string;
  terms: string;
  sent_via: string;
  sent_at: string | null;
  vsdc_code?: string;
  vsdc_verified_at?: string | null;
  lines: InvoiceLine[];
  payments: InvoicePayment[];
  whatsapp_link?: string;
  created_at: string;
};

export type InvoiceListData = {
  invoices: Invoice[];
  total: number;
};

export type CreateInvoiceRequest = {
  customer_id: string;
  type?: InvoiceDocType;
  currency: string;
  exchange_rate?: number;
  lines: {
    description: string;
    product_id?: string | null;
    service_id?: string | null;
    quantity: number;
    unit_price: number;
    discount?: number;
  }[];
  due_date?: string;
  notes?: string;
  terms?: string;
  apply_vat?: boolean;
  discount?: number;
};

export type UpdateInvoiceRequest = {
  currency?: string;
  exchange_rate?: number;
  lines?: {
    description: string;
    product_id?: string | null;
    service_id?: string | null;
    quantity: number;
    unit_price: number;
    discount?: number;
  }[];
  due_date?: string;
  notes?: string;
  terms?: string;
  apply_vat?: boolean;
  discount?: number;
};

export type InvoiceSettings = {
  template: InvoiceTemplate;
  number_prefix: string;
  default_terms: string;
  default_footer: string;
  default_payment_days: number;
  brand_color: string;
  logo_url: string;
  business_name: string;
};

export type UpdateInvoiceSettingsRequest = {
  template: InvoiceTemplate;
  number_prefix: string;
  default_terms?: string;
  default_footer?: string;
  default_payment_days: number;
};

export type RecordPaymentRequest = {
  amount: number;
  currency: string;
  method: string;
  reference?: string;
  paid_at?: string;
};

export type SendInvoiceResponse = {
  via: string;
  whatsapp_link?: string;
  message: string;
};

// ─── Accounts ─────────────────────────────────────────────────────────────────

export type AccountsSummary = {
  period: string;
  from: string;
  to: string;
  revenue: number;
  expenses: number;
  net_profit: number;
  gross_margin_pct: number;
  tax_liability: number;
  currency: string;
};

export type MonthlyTrend = {
  month: string;
  year_month: string;
  revenue: number;
  expenses: number;
  net: number;
};

export type TrendData = {
  months: MonthlyTrend[];
  currency: string;
};

export type PnLLineItem = {
  category: string;
  amount: number;
  pct: number;
};

export type PnLReport = {
  from: string;
  to: string;
  revenue: number;
  revenue_by_source: PnLLineItem[];
  discounts_given: number;
  discounts_by_source: PnLLineItem[];
  cogs: number;
  gross_profit: number;
  gross_margin_pct: number;
  expenses: number;
  expenses_by_category: PnLLineItem[];
  ebitda: number;
  tax_owed: number;
  net_profit: number;
  net_margin_pct: number;
  currency: string;
};

export type CashFlowLine = {
  date: string;
  in: number;
  out: number;
  net: number;
  running: number;
};

export type CashFlowReport = {
  from: string;
  to: string;
  opening_balance: number;
  total_in: number;
  total_out: number;
  closing_balance: number;
  by_payment_method: Record<string, number>;
  daily: CashFlowLine[];
  currency: string;
};

export type VATSummary = {
  period: string;
  vat_collected: number;
  nhil_collected: number;
  getfund_collected: number;
  total_output_tax: number;
  input_tax_paid: number;
  net_vat_payable: number;
  filed_at: string | null;
  currency: string;
};

export type VATReturnLine = {
  invoice_number: string;
  customer_name: string;
  date: string;
  taxable: number;
  vat: number;
  nhil: number;
  getfund: number;
  total: number;
};

export type VATReturn = {
  period: string;
  taxable_total: number;
  vat_total: number;
  nhil_total: number;
  getfund_total: number;
  lines: VATReturnLine[];
  currency: string;
};

export type JournalLine = {
  id: string;
  account_code: string;
  account_name: string;
  debit: number;
  credit: number;
  currency: string;
  base_amount: number;
};

export type JournalEntry = {
  id: string;
  date: string;
  description: string;
  source_module?: string;
  source_id?: string | null;
  currency: string;
  exchange_rate: number;
  lines: JournalLine[];
  created_at: string;
};

export type JournalListData = {
  entries: JournalEntry[];
  total: number;
};

export type JournalSyncData = {
  entries_created: number;
};

export type JournalContextData = {
  outstanding_receivable: number;
  currency: string;
};

export type ExchangeRate = {
  id: string;
  from_currency: string;
  to_currency: string;
  rate: number;
  source: string;
  date: string;
};

// ─── Inventory ────────────────────────────────────────────────────────────────

export type ProductVariant = {
  id: string;
  color: string;
  size: string;
  sku?: string;
  image_url?: string;
  price?: number | null;
  stock_qty: number;
  is_active: boolean;
  sort_order: number;
};

export type ColorPhotoResponse = {
  color: string;
  image_url: string;
  variants_updated: number;
};

export type InventoryCategory = {
  id: string;
  type: string;
  name: string;
  sort_order: number;
};

export type InventoryCategoryListData = {
  categories: InventoryCategory[];
};

export type InventoryItem = {
  id: string;
  type: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  photo_url?: string;
  images: string[];
  status: string;
  currency: string;
  sell_price: number;
  cost_price: number;
  discount_type: string;
  discount_value: number;
  discount_ends_at?: string;
  discounted_price: number;
  margin_pct: number;
  unit?: string;
  sku?: string;
  barcode?: string;
  stock_qty: number;
  low_stock_threshold: number;
  is_low_stock: boolean;
  has_variants: boolean;
  variants?: ProductVariant[];
  supplier_id?: string | null;
  supplier_name?: string;
  costing_method?: string;
  duration_mins?: number;
  pricing_type?: string;
  is_bookable: boolean;
  deposit_type: string;
  deposit_value: number;
  storefront_visible: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type InventoryItemListData = {
  items: InventoryItem[];
  total: number;
};

export type ServiceStatsResponse = {
  period_label: string;
  from?: string;
  to?: string;
  catalog: {
    total: number;
    active: number;
    public: number;
    bookable: number;
    avg_price: number;
    categories: number;
  };
  bookings: {
    total: number;
    upcoming: number;
    completed: number;
    cancelled: number;
    revenue: number;
  };
  top_by_bookings: {
    service_id: string;
    service_name: string;
    bookings: number;
    completed: number;
    revenue: number;
  }[];
  by_category: {
    category: string;
    count: number;
    avg_price: number;
  }[];
};

export type StockMovement = {
  id: string;
  type: string;
  qty_change: number;
  qty_after: number;
  cost_price?: number;
  note?: string;
  source_type?: string;
  source_id?: string | null;
  created_at: string;
};

export type StockMovementListData = {
  movements: StockMovement[];
  total: number;
};

export type ValuationByCategory = {
  category: string;
  item_count: number;
  total_cost: number;
};

export type StockValuation = {
  total_cost_value: number;
  total_items: number;
  by_category: ValuationByCategory[];
};

export type CreateInventoryItemRequest = {
  type: string;
  name: string;
  description?: string;
  category?: string;
  tags?: string[];
  currency: string;
  sell_price?: number;
  cost_price?: number;
  discount_type?: string;
  discount_value?: number;
  discount_ends_at?: string;
  unit?: string;
  sku?: string;
  barcode?: string;
  stock_qty?: number;
  low_stock_threshold?: number;
  supplier_id?: string | null;
  costing_method?: string;
  duration_mins?: number;
  pricing_type?: string;
  is_bookable?: boolean;
  deposit_type?: string;
  deposit_value?: number;
  storefront_visible?: boolean;
  is_featured?: boolean;
};

export type UpdateInventoryItemRequest = {
  name?: string;
  description?: string;
  category?: string;
  tags?: string[];
  status?: string;
  sell_price?: number;
  cost_price?: number;
  discount_type?: string;
  discount_value?: number;
  discount_ends_at?: string;
  unit?: string;
  sku?: string;
  barcode?: string;
  low_stock_threshold?: number;
  supplier_id?: string | null;
  costing_method?: string;
  duration_mins?: number;
  pricing_type?: string;
  is_bookable?: boolean;
  deposit_type?: string;
  deposit_value?: number;
  storefront_visible?: boolean;
  is_featured?: boolean;
  sort_order?: number;
};

export type RestockRequest = {
  qty: number;
  cost_price?: number;
  note?: string;
  batch_number?: string;
  expires_at?: string;
};

export type AdjustStockRequest = {
  new_qty: number;
  note: string;
};

export type WriteOffRequest = {
  type: "spoilage" | "loss";
  qty: number;
  note?: string;
};

export type CreateVariantRequest = {
  color?: string;
  size?: string;
  sku?: string;
  image_url?: string;
  price?: number | null;
  stock_qty?: number;
  sort_order?: number;
};

export type UpdateVariantRequest = {
  color?: string;
  size?: string;
  sku?: string;
  image_url?: string;
  price?: number | null;
  stock_qty?: number;
  is_active?: boolean;
  sort_order?: number;
};

export type Supplier = {
  id: string;
  name: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  notes?: string;
  created_at: string;
};

export type SupplierListData = {
  suppliers: Supplier[];
};

export type CreateSupplierRequest = {
  name: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  notes?: string;
};

export type UpdateSupplierRequest = {
  name?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  notes?: string;
};

export type POLine = {
  id: string;
  product_id: string;
  product_name: string;
  qty_ordered: number;
  qty_received: number;
  unit_cost: number;
  total: number;
};

export type PurchaseOrder = {
  id: string;
  supplier_id: string;
  supplier_name: string;
  number: string;
  status: POStatus;
  currency: string;
  exchange_rate: number;
  total: number;
  expected_at?: string | null;
  received_at?: string | null;
  notes?: string;
  lines: POLine[];
  created_at: string;
};

export type POListData = {
  purchase_orders: PurchaseOrder[];
  total: number;
};

export type POStatus = "draft" | "sent" | "partial" | "received" | "cancelled";

export type CreatePORequest = {
  supplier_id: string;
  currency: string;
  expected_at?: string;
  notes?: string;
  lines: { product_id: string; qty_ordered: number; unit_cost?: number }[];
};

export type ReceivePORequest = {
  lines: { line_id: string; qty_received: number; cost_price?: number }[];
};

// ─── Appointments ─────────────────────────────────────────────────────────────

export type Appointment = {
  id: string;
  service_id: string;
  service_name: string;
  customer_id?: string | null;
  customer_name: string;
  guest_name: string;
  guest_phone: string;
  status: AppointmentStatus;
  start_time: string;
  end_time: string;
  service_price: number;
  currency: string;
  deposit_required: number;
  deposit_paid: number;
  deposit_method?: string;
  notes: string;
  internal_notes: string;
  cancelled_at?: string | null;
  cancel_reason: string;
  deposit_forfeited: number;
  late_cancellation: boolean;
  completed_at?: string | null;
  invoice_id?: string | null;
  sale_id?: string | null;
  customer_email?: string;
  customer_phone?: string;
  reminder_sent_at?: string | null;
  receipt_whatsapp_link?: string;
  created_at: string;
  updated_at: string;
};

export type AppointmentListData = {
  appointments: Appointment[];
  total: number;
};

export type AppointmentAvailability = {
  date: string;
  slots: string[];
};

export type BlockedTime = {
  id: string;
  start_time: string;
  end_time: string;
  reason: string;
};

export type BlockedTimeListData = {
  blocked: BlockedTime[];
};

export type CreateAppointmentRequest = {
  service_id: string;
  customer_id?: string;
  guest_name?: string;
  guest_phone?: string;
  start_time: string;
  notes?: string;
  internal_notes?: string;
  deposit_required?: number;
  deposit_paid?: number;
  deposit_method?: string;
  deposit_ref?: string;
  confirm_immediately?: boolean;
};

export type CompleteAppointmentRequest = {
  balance_amount?: number;
  payment_method?: string;
  reference?: string;
  send_receipt?: boolean;
};

export type UpdateAppointmentRequest = {
  notes?: string;
  internal_notes?: string;
};

export type RescheduleAppointmentRequest = {
  start_time: string;
};

export type CancelAppointmentRequest = {
  reason?: string;
  by_customer?: boolean;
  force?: boolean;
};

export type CreateBlockedTimeRequest = {
  start_time: string;
  end_time: string;
  reason?: string;
  staff_id?: string | null;
};

export type CancellationPolicySettings = {
  window_hours: number;
  late_action: string;
  fee_amount: number;
  summary: string;
  enabled: boolean;
};

export type AppointmentSettings = {
  buffer_mins: number;
  pending_timeout_mins: number;
  reminder_customer: boolean;
  reminder_customer_email: boolean;
  reminder_owner: boolean;
  storefront_path: string;
  cancellation_policy: CancellationPolicySettings;
};

export type AppointmentSettingsUpdate = {
  buffer_mins?: number;
  pending_timeout_mins?: number;
  reminder_customer?: boolean;
  reminder_customer_email?: boolean;
  reminder_owner?: boolean;
  cancel_window_hours?: number;
  cancel_late_action?: string;
  cancel_fee_amount?: number;
};

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "cancelled_by_customer"
  | "cancelled_by_business"
  | "no_show"
  | "rescheduled";

// ─── Storefront delivery ──────────────────────────────────────────────────────

export type StorefrontDeliveryFeeType = "free" | "fixed" | "customer_pays" | "quote";

export type StorefrontDeliveryRule = {
  id: string;
  label: string;
  description: string;
  fee_type: StorefrontDeliveryFeeType;
  fee_amount?: number;
  fee_note?: string;
  sort_order: number;
};

export type StorefrontDeliverySettings = {
  enabled: boolean;
  instructions: string;
  require_map_pin: boolean;
  allow_pay_on_delivery: boolean;
  allow_pay_online: boolean;
  booking_instructions: string;
  rules: StorefrontDeliveryRule[];
};

// ─── Marketplace (owner) ──────────────────────────────────────────────────────

export type StorefrontProfile = {
  business_slug: string;
  bio: string;
  is_public: boolean;
  accent_color: string;
  header_text: string;
  footer_text: string;
  show_products: boolean;
  show_services: boolean;
  show_phone: boolean;
  show_email: boolean;
  show_whatsapp: boolean;
  whatsapp: string;
  show_hours: boolean;
  promo_banner: string;
  hero_headline: string;
  hero_subheadline: string;
  nav_home_label: string;
  nav_shop_label: string;
  nav_services_label: string;
  nav_cart_label: string;
  nav_contact_label: string;
  social_instagram: string;
  social_facebook: string;
  social_twitter: string;
  social_tiktok: string;
  in_directory: boolean;
  show_deals_section: boolean;
  show_work: boolean;
  nav_work_label: string;
  work_intro: string;
  delivery_settings: StorefrontDeliverySettings;
  avg_rating: number;
  review_count: number;
  view_count: number;
  updated_at: string;
};

export type UpdateStorefrontProfileRequest = {
  bio?: string;
  accent_color?: string;
  header_text?: string;
  footer_text?: string;
  show_products?: boolean;
  show_services?: boolean;
  show_phone?: boolean;
  show_email?: boolean;
  show_whatsapp?: boolean;
  whatsapp?: string;
  show_hours?: boolean;
  promo_banner?: string;
  hero_headline?: string;
  hero_subheadline?: string;
  nav_home_label?: string;
  nav_shop_label?: string;
  nav_services_label?: string;
  nav_cart_label?: string;
  nav_contact_label?: string;
  social_instagram?: string;
  social_facebook?: string;
  social_twitter?: string;
  social_tiktok?: string;
  in_directory?: boolean;
  show_deals_section?: boolean;
  show_work?: boolean;
  nav_work_label?: string;
  work_intro?: string;
  delivery_settings?: StorefrontDeliverySettings;
};

export type WorkProjectStatus = "draft" | "published";

export type WorkProjectImage = {
  id: string;
  url: string;
  caption: string;
  hero: boolean;
  sort_order: number;
  created_at: string;
};

export type WorkProject = {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_url: string;
  status: WorkProjectStatus;
  sort_order: number;
  images: WorkProjectImage[];
  created_at: string;
  updated_at: string;
};

export type CreateWorkProjectRequest = {
  title: string;
  description?: string;
  status?: WorkProjectStatus;
};

export type UpdateWorkProjectRequest = {
  title?: string;
  description?: string;
  status?: WorkProjectStatus;
};

export type UpdateWorkProjectImageRequest = {
  hero?: boolean;
};

export type PublicWorkProjectSummary = {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  cover_url: string;
  hero_urls?: string[];
};

export type PublicWorkProjectDetail = {
  id: string;
  title: string;
  slug?: string;
  description: string;
  cover_url: string;
  images: WorkProjectImage[];
};

export type StorefrontPromotion = {
  id: string;
  name: string;
  description: string;
  flyer_url?: string;
  scope_type: "all_products" | "selected_products";
  discount_type: "percent" | "fixed";
  discount_value: number;
  starts_at?: string | null;
  ends_at?: string | null;
  is_active: boolean;
  show_on_homepage: boolean;
  sort_order: number;
  product_ids: string[];
  is_currently_active: boolean;
  created_at: string;
  updated_at: string;
};

export type CreatePromotionRequest = {
  name: string;
  description?: string;
  scope_type: "all_products" | "selected_products";
  discount_type: "percent" | "fixed";
  discount_value: number;
  product_ids?: string[];
  starts_at?: string | null;
  ends_at?: string | null;
  is_active?: boolean;
  show_on_homepage?: boolean;
  sort_order?: number;
};

export type UpdatePromotionRequest = Partial<CreatePromotionRequest>;

export type PublicPromotion = {
  id: string;
  name: string;
  description?: string;
  flyer_url?: string;
  scope_type: "all_products" | "selected_products";
  discount_type: "percent" | "fixed";
  discount_value: number;
  starts_at?: string | null;
  ends_at?: string | null;
  show_on_homepage: boolean;
  products: PublicProduct[];
};

export type PublicPromotionsData = {
  show_deals_section: boolean;
  promotions: PublicPromotion[];
};

export type StorefrontCoupon = {
  id: string;
  code: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
  min_order_amount: number;
  max_uses: number;
  uses_count: number;
  max_uses_per_customer: number;
  audience: "public" | "restricted";
  starts_at?: string | null;
  ends_at?: string | null;
  is_active: boolean;
  customer_ids: string[];
  is_currently_active: boolean;
  created_at: string;
  updated_at: string;
};

export type CreateCouponRequest = {
  code: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
  min_order_amount?: number;
  max_uses?: number;
  max_uses_per_customer?: number;
  audience: "public" | "restricted";
  customer_ids?: string[];
  starts_at?: string | null;
  ends_at?: string | null;
  is_active?: boolean;
};

export type UpdateCouponRequest = Partial<CreateCouponRequest>;

export type ValidateCouponRequest = {
  code: string;
  guest_phone?: string;
  lines: PlaceOrderLine[];
};

export type ValidateCouponResponse = {
  code: string;
  discount_type: string;
  discount_value: number;
  subtotal: number;
  discount_amount: number;
  total: number;
};

export type SendCouponRequest = {
  via: "sms" | "whatsapp";
  customer_ids?: string[];
};

export type CouponShareLink = {
  customer_id: string;
  customer_name: string;
  phone: string;
  share_url: string;
  whatsapp_url: string;
};

export type SendCouponResponse = {
  sent: number;
  failed: number;
  share_url: string;
  message: string;
  links: CouponShareLink[];
};

export type CouponRedemptionStat = {
  coupon_id: string;
  code: string;
  redemptions: number;
  total_discount: number;
};

export type DiscountAnalytics = {
  deals_page_views: number;
  coupon_redemptions_total: number;
  active_promotions: number;
  active_coupons: number;
  redemptions_by_coupon: CouponRedemptionStat[];
};

export type PortfolioImage = {
  id: string;
  url: string;
  caption: string;
  use_hero: boolean;
  use_editorial: boolean;
  sort_order: number;
  created_at: string;
};

export type UpdatePortfolioImageRequest = {
  caption?: string;
  use_hero?: boolean;
  use_editorial?: boolean;
};

export type MarketplaceReview = {
  id: string;
  reviewer_name: string;
  reviewer_phone?: string;
  rating: number;
  comment: string;
  business_reply: string;
  replied_at?: string | null;
  flagged: boolean;
  verified: boolean;
  created_at: string;
};

export type OrderLine = {
  id: string;
  product_id: string;
  variant_id?: string | null;
  product_name: string;
  variant_desc?: string;
  qty: number;
  unit_price: number;
  total: number;
};

export type OrderStatus = "received" | "confirmed" | "dispatched" | "delivered" | "cancelled";

export type MarketplaceOrder = {
  id: string;
  customer_id?: string | null;
  guest_name: string;
  guest_phone: string;
  guest_email?: string;
  status: OrderStatus;
  currency: string;
  subtotal: number;
  discount_amount: number;
  coupon_code?: string;
  total: number;
  payment_method: string;
  notes?: string;
  shipping_addr?: string;
  delivery_address?: string;
  delivery_lat?: number | null;
  delivery_lng?: number | null;
  delivery_option_id?: string;
  delivery_option_label?: string;
  delivery_fee?: number;
  delivery_fee_note?: string;
  sale_id?: string | null;
  lines: OrderLine[];
  created_at: string;
  updated_at: string;
};

export type OrderListData = {
  orders: MarketplaceOrder[];
  total: number;
};

export type UpdateOrderStatusRequest = {
  status: OrderStatus;
};

export type MarketplaceEnquiry = {
  id: string;
  name: string;
  email?: string;
  phone: string;
  subject?: string;
  message: string;
  status: "new" | "read";
  read_at?: string | null;
  created_at: string;
};

export type EnquiryListData = {
  enquiries: MarketplaceEnquiry[];
  total: number;
};

export type SubmitEnquiryRequest = {
  name: string;
  email?: string;
  phone: string;
  subject?: string;
  message: string;
  company_url?: string;
  form_loaded_at: number;
};

export type SubmitEnquiryResponse = {
  message: string;
};

// ─── Public Storefront ────────────────────────────────────────────────────────

export type PublicVariant = {
  id: string;
  color: string;
  size: string;
  sku?: string;
  image_url?: string;
  price?: number | null;
  stock_qty: number;
  is_active: boolean;
};

export type PublicProduct = {
  id: string;
  name: string;
  description?: string;
  photo_url?: string;
  images: string[];
  currency: string;
  sell_price: number;
  discount_type: string;
  discount_value: number;
  discount_ends_at?: string;
  discounted_price: number;
  stock_qty: number;
  has_variants: boolean;
  variants?: PublicVariant[];
  tags: string[];
  category?: string;
  is_featured?: boolean;
  sort_order?: number;
  created_at?: string;
};

export type PublicService = {
  id: string;
  name: string;
  description?: string;
  photo_url?: string;
  images?: string[];
  category?: string;
  tags?: string[];
  duration_mins: number;
  price: number;
  currency: string;
  pricing_type: string;
  is_bookable: boolean;
};

export type PublicReview = {
  id: string;
  reviewer_name: string;
  rating: number;
  comment?: string;
  business_reply?: string;
  created_at: string;
};

export type PublicStorefront = {
  business_name: string;
  business_slug: string;
  city: string;
  area: string;
  country: string;
  latitude?: number | null;
  longitude?: number | null;
  phone?: string;
  whatsapp?: string;
  email?: string;
  logo_url?: string;
  website?: string;
  bio?: string;
  tagline?: string;
  category?: string;
  accent_color: string;
  header_text?: string;
  footer_text?: string;
  promo_banner?: string;
  hero_headline?: string;
  hero_subheadline?: string;
  nav_home_label?: string;
  nav_shop_label?: string;
  nav_services_label?: string;
  nav_cart_label?: string;
  nav_contact_label?: string;
  social_instagram?: string;
  social_facebook?: string;
  social_twitter?: string;
  social_tiktok?: string;
  show_products: boolean;
  show_services: boolean;
  show_phone: boolean;
  show_email: boolean;
  show_whatsapp: boolean;
  show_hours: boolean;
  hours_enabled: boolean;
  hours: BusinessHoursDay[];
  is_open_now: boolean;
  avg_rating: number;
  review_count: number;
  view_count: number;
  products: PublicProduct[];
  services: PublicService[];
  portfolio: PortfolioImage[];
  reviews: PublicReview[];
  show_deals_section?: boolean;
  show_work?: boolean;
  nav_work_label?: string;
  work_intro?: string;
  work_projects?: PublicWorkProjectSummary[];
  promotions?: PublicPromotion[];
  delivery_settings?: StorefrontDeliverySettings;
};

export type PlaceOrderLine = {
  product_id: string;
  variant_id?: string;
  qty: number;
};

export type PlaceOrderRequest = {
  guest_name: string;
  guest_phone: string;
  guest_email?: string;
  payment_method?: "cod" | "paystack";
  notes?: string;
  shipping_addr?: string;
  delivery_address?: string;
  delivery_lat?: number;
  delivery_lng?: number;
  delivery_option_id?: string;
  coupon_code?: string;
  lines: PlaceOrderLine[];
};

// ─── Blog ─────────────────────────────────────────────────────────────────────

export type BlogPostStatus = "draft" | "published";

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body_html: string;
  status: BlogPostStatus;
  seo_title: string;
  meta_description: string;
  featured_image_url?: string;
  category?: string;
  tags?: string[];
  published_at?: string;
  created_at: string;
  updated_at: string;
};

export type BlogPostListData = {
  posts: BlogPost[];
  total: number;
};

export type CreateBlogPostRequest = {
  title: string;
  slug?: string;
  excerpt?: string;
  body_html?: string;
  seo_title?: string;
  meta_description?: string;
  featured_image_url?: string;
  category?: string;
  tags?: string[];
};

export type UpdateBlogPostRequest = {
  title?: string;
  slug?: string;
  excerpt?: string;
  body_html?: string;
  seo_title?: string;
  meta_description?: string;
  featured_image_url?: string;
  category?: string;
  tags?: string[];
};

export type PublicBlogCategoryCount = {
  name: string;
  count: number;
};

export type PublicBlogPostSummary = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image_url?: string;
  seo_title: string;
  meta_description: string;
  published_at?: string;
  category?: string;
  tags?: string[];
  author_name: string;
};

export type PublicBlogListData = {
  business_name: string;
  business_slug: string;
  posts: PublicBlogPostSummary[];
  categories: PublicBlogCategoryCount[];
  tags: string[];
  total: number;
};

// ─── POS ──────────────────────────────────────────────────────────────────────

export type PosSettings = {
  receipt_prefix: string;
  receipt_footer: string;
  default_payment_method: string;
  show_out_of_stock: boolean;
  max_cashier_discount_pct: number;
  idle_lock_minutes: number;
};

export type PosSession = {
  id: string;
  register_id: string;
  register_name: string;
  status: string;
  opening_float: number;
  expected_cash: number;
  counted_cash?: number | null;
  cash_variance?: number | null;
  opened_at: string;
  closed_at?: string | null;
  close_note?: string;
  sales_count?: number;
  sales_total?: number;
};

export type PosSessionCloseReport = PosSession & {
  opened_by_name: string;
  closed_by_name?: string;
  currency: string;
  cash_sales_total: number;
  non_cash_sales_total: number;
  expected_cash_in_drawer: number;
  by_payment: {
    payment_method: string;
    sale_count: number;
    total: number;
  }[];
  receipts: PosSaleSummary[];
  posted_to_accounts: boolean;
  accounts_note: string;
};

export type PosCatalogVariant = {
  id: string;
  color: string;
  size: string;
  sku: string;
  price?: number | null;
  discounted_price?: number;
  stock_qty: number;
  image_url?: string;
};

export type PosCatalogItem = {
  id: string;
  type: string;
  name: string;
  category: string;
  photo_url?: string;
  currency: string;
  sell_price: number;
  discounted_price: number;
  unit?: string;
  sku?: string;
  barcode?: string;
  stock_qty: number;
  is_low_stock: boolean;
  has_variants: boolean;
  variants?: PosCatalogVariant[];
  out_of_stock: boolean;
};

export type PosCatalogData = {
  items: PosCatalogItem[];
  categories: string[];
  total: number;
};

export type PosCartLine = {
  product_id: string;
  variant_id?: string | null;
  quantity: number;
  unit_price?: number;
  discount_pct?: number;
};

export type PosCheckoutRequest = {
  session_id: string;
  customer_id?: string | null;
  currency: string;
  payment_method: string;
  note?: string;
  lines: PosCartLine[];
  order_discount_pct?: number;
  amount_tendered?: number;
};

export type PosCheckoutResult = {
  sale_id: string;
  receipt_number: string;
  total: number;
  change_due: number;
  payment_method: string;
  currency: string;
};

export type PosHeldCart = {
  id: string;
  label: string;
  cart: {
    lines: PosCartLine[];
    customer_id?: string | null;
    note?: string;
  };
  held_at: string;
  total: number;
};

export type PosSaleSummary = {
  id: string;
  receipt_number: string;
  total: number;
  currency: string;
  payment_method: string;
  customer_name?: string;
  cashier_name?: string;
  register_name?: string;
  sale_date: string;
  line_count: number;
  status: string;
};

export type PosSalesReport = {
  summary: {
    period_label: string;
    currency: string;
    total_revenue: number;
    sale_count: number;
    avg_ticket: number;
    session_count: number;
  };
  by_cashier: {
    user_id: string;
    name: string;
    sale_count: number;
    total: number;
  }[];
  by_payment: {
    payment_method: string;
    sale_count: number;
    total: number;
  }[];
  top_products: {
    description: string;
    quantity: number;
    revenue: number;
  }[];
  sessions: {
    id: string;
    register_name: string;
    status: string;
    opened_by_name: string;
    closed_by_name?: string;
    opened_at: string;
    closed_at?: string;
    opening_float: number;
    sales_count: number;
    sales_total: number;
    cash_variance?: number;
  }[];
  sales: PosSaleSummary[];
  total: number;
};

export type PosReceipt = {
  receipt_number: string;
  business_name: string;
  sale_date: string;
  currency: string;
  payment_method: string;
  customer_name?: string;
  lines: { description: string; quantity: number; unit_price: number; total: number }[];
  subtotal: number;
  total: number;
  footer?: string;
  cashier_name?: string;
};

// ─── AI ───────────────────────────────────────────────────────────────────────

export type AISettings = {
  enabled: boolean;
  key_mode: "managed" | "byo";
  byo_provider?: "anthropic" | "openai";
  has_key: boolean;
  cost_limit_usd: number;
  soft_pct: number;
};

export type UpdateAISettingsRequest = {
  enabled?: boolean;
  key_mode?: "managed" | "byo";
  byo_provider?: "anthropic" | "openai";
  api_key?: string;
  cost_limit_usd?: number;
  soft_pct?: number;
};

export type AILedgerItem = {
  created_at: string;
  feature: string;
  provider: string;
  model: string;
  tier: string;
  input_tokens: number;
  output_tokens: number;
  cost_usd: number;
  degraded: boolean;
};

export type AIUsage = {
  period: string;
  cost_limit_usd: number;
  cost_used: number;
  remaining: number;
  soft_pct: number;
  in_economy: boolean;
  recent: AILedgerItem[] | null;
};

export type AIDraftRequest = {
  prompt: string;
  kind?: string;
};

export type AIDraftMeta = {
  provider: string;
  model: string;
  tier: string;
  degraded: boolean;
  cost_usd: number;
};

export type AIMeta = AIDraftMeta;

export type AIGenerateKind =
  | "invoice_lines"
  | "expense_category"
  | "product_description"
  | "seo_copy";

export type AIGenerateRequest = {
  kind: AIGenerateKind;
  prompt: string;
};

export type AIGenerateResponse = {
  kind: string;
  data: Record<string, unknown>;
  meta: AIMeta;
};

export type AIBriefingResponse = {
  text: string;
  meta: AIMeta;
};

export type AIChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type AIChatRequest = {
  messages: AIChatMessage[];
};

export type AIInvoiceLineSuggestion = {
  description: string;
  quantity: number;
  unit_price: number;
};

export type AIInvoiceLinesData = {
  lines: AIInvoiceLineSuggestion[];
};

export type AIExpenseCategoryData = {
  category: string;
  confidence?: number;
};

export type AIProductDescriptionData = {
  description: string;
  category_suggestion?: string;
};
