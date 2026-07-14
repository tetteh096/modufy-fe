export interface DashboardTrendDay {
  date: string;
  value: number;
}

export interface DashboardStats {
  total_businesses: number;
  businesses_with_modules: number;
  open_tickets: number;
  new_demo_requests: number;
  new_signups_7d: number;
  new_signups_30d: number;
  suspended_businesses: number;
  active_businesses: number;
  platform_gmv_30d: number;
  platform_gmv_7d: number;
  platform_gmv_prev_7d: number;
  sales_count_30d: number;
  total_customers: number;
  platform_mrr: number;
  gmv_trend: DashboardTrendDay[];
  signups_trend: DashboardTrendDay[];
}

export interface BusinessListItem {
  id: string;
  name: string;
  slug: string;
  country: string;
  category: string;
  owner_email: string;
  modules_enabled: string[];
  verified: boolean;
  suspended: boolean;
  created_at: string;
}

export interface BusinessDetail {
  id: string;
  name: string;
  slug: string;
  country: string;
  city: string;
  category: string;
  owner_email: string;
  owner_name: string;
  modules_enabled: string[];
  modules: { module: string; enabled: boolean; enabled_at?: string }[];
  verified: boolean;
  suspended: boolean;
  users: { id: string; name: string; email: string; role: string; active: boolean; created_at: string }[];
  notes: { id: string; author_id: string; author_name: string; body: string; created_at: string }[];
  stats: {
    sales_count_30d: number;
    sales_total_30d: number;
    invoice_count: number;
    customer_count: number;
    open_ticket_count: number;
  };
  ai_cost_limit?: number;
  ai_soft_pct?: number;
  created_at: string;
}

export interface DemoRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  business_name: string;
  category: string;
  city: string;
  message: string;
  status: string;
  assigned_to?: string;
  business_id?: string;
  created_at: string;
  updated_at: string;
}

export interface SupportTicket {
  id: string;
  number: string;
  business_id?: string;
  business_name?: string;
  requester_email: string;
  requester_phone: string;
  requester_name: string;
  subject: string;
  body: string;
  source: string;
  priority: string;
  status: string;
  assignee_user_id?: string;
  assignee_name?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
}

export interface TicketDetail {
  ticket: SupportTicket;
  messages: {
    id: string;
    author_type: string;
    author_id?: string;
    author_name?: string;
    body: string;
    created_at: string;
  }[];
}

export interface AuditLogEntry {
  id: string;
  actor_user_id: string;
  actor_name: string;
  action: string;
  target_type: string;
  target_id: string;
  metadata?: Record<string, unknown>;
  ip_address: string;
  created_at: string;
}

export interface PlatformTeamMember {
  user_id: string;
  name: string;
  email: string;
  platform_role: string;
  active: boolean;
  created_at: string;
}

export interface SupportGrant {
  id: string;
  business_id: string;
  ticket_id?: string;
  status: string;
  scope: string;
  reason: string;
  has_code: boolean;
  expires_at: string;
  created_at: string;
}

export interface SupportSession {
  id: string;
  business_id: string;
  scope: string;
  admin_name: string;
  started_at: string;
}

export interface CurrencyItem {
  code: string;
  symbol: string;
  name: string;
  decimal_places: number;
  enabled: boolean;
}

export interface PlatformIntegrations {
  sms_provider: "arkesel" | "hubtel";
  arkesel_configured: boolean;
  arkesel_sender_id: string;
  arkesel_api_key_hint?: string;
  sms_sandbox: boolean;
  sms_balance?: string;
  sms_inbound_url?: string;
  hubtel_configured: boolean;
  hubtel_sender_id?: string;
  hubtel_client_id_hint?: string;
  resend_configured: boolean;
  resend_from?: string;
  resend_webhook_url?: string;
}

export type UpdateIntegrationsBody = {
  sms_provider?: "arkesel" | "hubtel";
  arkesel_api_key?: string;
  arkesel_sender_id?: string;
  sms_sandbox?: boolean;
  hubtel_client_id?: string;
  hubtel_client_secret?: string;
  hubtel_sender_id?: string;
};

export interface BusinessSMSWallet {
  balance_credits: number;
  low_balance_threshold: number;
  sent_30d: number;
  credits_used_30d: number;
}

export interface SMSUsageItem {
  id: string;
  event_type: string;
  recipient: string;
  segments: number;
  credits_charged: number;
  status: string;
  sandbox: boolean;
  created_at: string;
}

export interface BusinessEmailWallet {
  balance_credits: number;
  low_balance_threshold: number;
  sent_30d: number;
  credits_used_30d: number;
}

export interface EmailUsageItem {
  id: string;
  event_type: string;
  recipient: string;
  credits_charged: number;
  status: string;
  created_at: string;
}

export interface NotificationLogItem {
  id: string;
  business_id?: string;
  business_name?: string;
  channel: "email" | "sms";
  event_type: string;
  action: string;
  recipient: string;
  status: string;
  subject?: string;
  provider?: string;
  provider_msg_id?: string;
  error_message?: string;
  sandbox: boolean;
  created_at: string;
}

export interface BusinessEmailWallet {
  balance_credits: number;
  low_balance_threshold: number;
  sent_30d: number;
  credits_used_30d: number;
}

export interface EmailUsageItem {
  id: string;
  event_type: string;
  recipient: string;
  subject?: string;
  credits_charged: number;
  status: string;
  sandbox: boolean;
  created_at: string;
}
