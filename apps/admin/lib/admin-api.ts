import { apiClient } from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type {
  AuditLogEntry,
  BusinessDetail,
  BusinessListItem,
  CurrencyItem,
  DashboardStats,
  SupportGrant,
  SupportSession,
  DemoRequest,
  PlatformTeamMember,
  PlatformIntegrations,
  UpdateIntegrationsBody,
  BusinessSMSWallet,
  BusinessEmailWallet,
  SMSUsageItem,
  EmailUsageItem,
  NotificationLogItem,
  SupportTicket,
  TicketDetail,
} from "@/types/admin";

export const adminApi = {
  dashboard: () =>
    apiClient.get<ApiResponse<DashboardStats>>("/admin/dashboard").then((r) => r.data.data),

  businesses: (params?: { search?: string; page?: number }) =>
    apiClient
      .get<ApiResponse<{ businesses: BusinessListItem[]; total: number }>>("/admin/businesses", { params })
      .then((r) => r.data.data),

  business: (id: string) =>
    apiClient.get<ApiResponse<BusinessDetail>>(`/admin/businesses/${id}`).then((r) => r.data.data),

  updateBusiness: (
    id: string,
    body: {
      verified?: boolean;
      suspended?: boolean;
      ai_cost_limit?: number;
      ai_soft_pct?: number;
    }
  ) => apiClient.patch(`/admin/businesses/${id}`, body),

  addBusinessNote: (id: string, body: string) =>
    apiClient.post(`/admin/businesses/${id}/notes`, { body }),

  toggleModule: (businessId: string, module: string, enabled: boolean) =>
    apiClient.patch(`/admin/businesses/${businessId}/modules/${module}`, { enabled }),

  demos: (params?: { status?: string }) =>
    apiClient
      .get<ApiResponse<{ requests: DemoRequest[]; total: number }>>("/admin/demo-requests", { params })
      .then((r) => r.data.data),

  updateDemo: (id: string, body: { status?: string }) =>
    apiClient.patch<ApiResponse<DemoRequest>>(`/admin/demo-requests/${id}`, body).then((r) => r.data.data),

  tickets: (params?: { status?: string }) =>
    apiClient
      .get<ApiResponse<{ tickets: SupportTicket[]; total: number }>>("/admin/tickets", { params })
      .then((r) => r.data.data),

  ticket: (id: string) =>
    apiClient.get<ApiResponse<TicketDetail>>(`/admin/tickets/${id}`).then((r) => r.data.data),

  createTicket: (body: {
    business_id?: string;
    requester_email: string;
    requester_name?: string;
    requester_phone?: string;
    subject: string;
    body: string;
    priority?: string;
    assignee_user_id?: string;
  }) => apiClient.post<ApiResponse<SupportTicket>>("/admin/tickets", body).then((r) => r.data.data),

  updateTicket: (id: string, body: { status?: string; priority?: string }) =>
    apiClient.patch<ApiResponse<SupportTicket>>(`/admin/tickets/${id}`, body).then((r) => r.data.data),

  addTicketMessage: (id: string, body: string) =>
    apiClient.post(`/admin/tickets/${id}/messages`, { body }),

  audit: (params?: { action?: string; page?: number }) =>
    apiClient
      .get<ApiResponse<{ logs: AuditLogEntry[]; total: number }>>("/admin/audit", { params })
      .then((r) => r.data.data),

  notifications: (params?: {
    channel?: string;
    status?: string;
    business_id?: string;
    event_type?: string;
    page?: number;
    limit?: number;
  }) =>
    apiClient
      .get<ApiResponse<{ items: NotificationLogItem[]; total: number }>>("/admin/notifications", {
        params,
      })
      .then((r) => r.data.data),

  team: () =>
    apiClient.get<ApiResponse<PlatformTeamMember[]>>("/admin/team").then((r) => r.data.data),

  currencies: () =>
    apiClient.get<ApiResponse<CurrencyItem[]>>("/admin/currencies").then((r) => r.data.data),

  updateCurrency: (code: string, body: Partial<Pick<CurrencyItem, "enabled" | "symbol" | "name">>) =>
    apiClient.patch<ApiResponse<CurrencyItem>>(`/admin/currencies/${code}`, body).then((r) => r.data.data),

  supportGrants: (status?: string) =>
    apiClient
      .get<ApiResponse<SupportGrant[]>>(`/admin/support/grants`, { params: status ? { status } : {} })
      .then((r) => r.data.data),

  requestSupportGrant: (body: { business_id: string; ticket_id?: string; scope?: string; reason?: string }) =>
    apiClient.post<ApiResponse<SupportGrant>>(`/admin/support/grants`, body).then((r) => r.data.data),

  startSupportSession: (body: { grant_id?: string; code?: string; business_id?: string }) =>
    apiClient
      .post<
        ApiResponse<{
          session_id: string;
          exchange_code: string;
          enter_url: string;
          scope: string;
        }>
      >(`/admin/support/sessions`, body)
      .then((r) => r.data.data),

  endSupportSession: (id: string) =>
    apiClient.delete(`/admin/support/sessions/${id}`),

  activeSupportSessions: () =>
    apiClient
      .get<ApiResponse<SupportSession[]>>("/admin/support/sessions/active")
      .then((r) => r.data.data),

  integrations: () =>
    apiClient.get<ApiResponse<PlatformIntegrations>>("/admin/integrations").then((r) => r.data.data),

  updateIntegrations: (body: UpdateIntegrationsBody) =>
    apiClient.patch<ApiResponse<PlatformIntegrations>>("/admin/integrations", body).then((r) => r.data.data),

  testSMS: (body: { phone: string; message?: string }) =>
    apiClient
      .post<ApiResponse<{ status: string; message: string }>>("/admin/integrations/test-sms", body)
      .then((r) => r.data.data),

  testEmail: (body: { email: string; subject?: string }) =>
    apiClient
      .post<ApiResponse<{ status: string; message: string; email_id?: string }>>(
        "/admin/integrations/test-email",
        body,
      )
      .then((r) => r.data.data),

  businessSMSWallet: (id: string) =>
    apiClient
      .get<ApiResponse<BusinessSMSWallet>>(`/admin/businesses/${id}/sms-wallet`)
      .then((r) => r.data.data),

  grantBusinessSMSCredits: (id: string, body: { credits: number; note?: string }) =>
    apiClient
      .post<ApiResponse<BusinessSMSWallet>>(`/admin/businesses/${id}/sms-credits`, body)
      .then((r) => r.data.data),

  businessSMSUsage: (id: string, limit?: number) =>
    apiClient
      .get<ApiResponse<{ items: SMSUsageItem[] }>>(`/admin/businesses/${id}/sms-usage`, {
        params: limit ? { limit } : undefined,
      })
      .then((r) => r.data.data),

  businessEmailWallet: (id: string) =>
    apiClient
      .get<ApiResponse<BusinessEmailWallet>>(`/admin/businesses/${id}/email-wallet`)
      .then((r) => r.data.data),

  grantBusinessEmailCredits: (id: string, body: { credits: number; note?: string }) =>
    apiClient
      .post<ApiResponse<BusinessEmailWallet>>(`/admin/businesses/${id}/email-credits`, body)
      .then((r) => r.data.data),

  businessEmailUsage: (id: string, limit?: number) =>
    apiClient
      .get<ApiResponse<{ items: EmailUsageItem[] }>>(`/admin/businesses/${id}/email-usage`, {
        params: limit ? { limit } : undefined,
      })
      .then((r) => r.data.data),
};
