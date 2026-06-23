import axios, { AxiosError } from "axios";
import { useAuthStore } from "@/store/auth";
import type {
  ApiResponse,
  Business,
  Customer,
  CustomerDetail,
  CustomerListData,
  TeamListData,
  TeamInviteCreated,
  TeamRolesData,
  TeamRoleWithPermissions,
  TeamMemberDetail,
  ResetMemberPasswordResult,
  AuditListData,
  AccountProfile,
  UpdateAccountProfileRequest,
  InvitePreview,
  NotificationListData,
  AttentionListData,
  AlertRule,
  AlertRuleListData,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  UpdateBusinessRequest,
  UpdateCurrencySettingsRequest,
  UpdateBusinessHoursRequest,
  BusinessHoursDay,
  BusinessModule,
  Sale,
  SaleListData,
  RecordSaleRequest,
  SaleSummary,
  SalesTrends,
  Expense,
  ExpenseListData,
  ExpenseSummary,
  ExpenseTrends,
  LogExpenseRequest,
  Invoice,
  InvoiceListData,
  CreateInvoiceRequest,
  UpdateInvoiceRequest,
  UpdateInvoiceSettingsRequest,
  InvoiceSettings,
  InvoiceDocType,
  RecordPaymentRequest,
  SendInvoiceResponse,
  AccountsSummary,
  TrendData,
  PnLReport,
  CashFlowReport,
  VATSummary,
  VATReturn,
  JournalListData,
  JournalContextData,
  JournalSyncData,
  JournalEntry,
  ExchangeRate,
  InventoryItem,
  InventoryItemListData,
  InventoryCategory,
  InventoryCategoryListData,
  OrderStatus,
  ServiceStatsResponse,
  StockMovementListData,
  SupplierListData,
  Supplier,
  POListData,
  PurchaseOrder,
  StockValuation,
  CreateInventoryItemRequest,
  UpdateInventoryItemRequest,
  RestockRequest,
  AdjustStockRequest,
  WriteOffRequest,
  CreateSupplierRequest,
  UpdateSupplierRequest,
  CreatePORequest,
  ReceivePORequest,
  Appointment,
  AppointmentListData,
  AppointmentAvailability,
  BlockedTimeListData,
  CreateAppointmentRequest,
  CompleteAppointmentRequest,
  UpdateAppointmentRequest,
  RescheduleAppointmentRequest,
  CancelAppointmentRequest,
  CreateBlockedTimeRequest,
  AppointmentSettings,
  AppointmentSettingsUpdate,
  ProductVariant,
  ColorPhotoResponse,
  CreateVariantRequest,
  UpdateVariantRequest,
  StorefrontProfile,
  UpdateStorefrontProfileRequest,
  PortfolioImage,
  UpdatePortfolioImageRequest,
  WorkProject,
  WorkProjectImage,
  CreateWorkProjectRequest,
  UpdateWorkProjectRequest,
  UpdateWorkProjectImageRequest,
  PublicWorkProjectSummary,
  PublicWorkProjectDetail,
  MarketplaceReview,
  MarketplaceOrder,
  OrderListData,
  UpdateOrderStatusRequest,
  MarketplaceEnquiry,
  EnquiryListData,
  SubmitEnquiryRequest,
  SubmitEnquiryResponse,
  PublicStorefront,
  PublicPromotionsData,
  PublicService,
  PlaceOrderRequest,
  StorefrontPromotion,
  CreatePromotionRequest,
  UpdatePromotionRequest,
  StorefrontCoupon,
  CreateCouponRequest,
  UpdateCouponRequest,
  ValidateCouponRequest,
  ValidateCouponResponse,
  SendCouponRequest,
  SendCouponResponse,
  DiscountAnalytics,
  BlogPost,
  BlogPostListData,
  CreateBlogPostRequest,
  UpdateBlogPostRequest,
  PublicBlogListData,
  PosSettings,
  PosSession,
  PosSessionCloseReport,
  PosCatalogData,
  PosCatalogItem,
  PosCheckoutRequest,
  PosCheckoutResult,
  PosHeldCart,
  PosSaleSummary,
  PosSalesReport,
  PosReceipt,
  AISettings,
  UpdateAISettingsRequest,
  AIUsage,
  AIDraftRequest,
  AIDraftMeta,
  AIGenerateRequest,
  AIGenerateResponse,
  AIBriefingResponse,
  AIChatRequest,
} from "@/types/api";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1",
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth();
      if (typeof window !== "undefined") window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

function data<T>(res: { data: ApiResponse<T> }) {
  return res.data.data;
}

function normalizeTeamMemberDetail(raw: TeamMemberDetail): TeamMemberDetail {
  const permissions = raw.permissions ?? [];
  return {
    ...raw,
    name: raw.name?.trim() || raw.email || "Team member",
    permissions,
    role_permissions: raw.role_permissions ?? permissions,
    permission_overrides: raw.permission_overrides ?? [],
    uses_permission_overrides: raw.uses_permission_overrides ?? false,
    can_manage_permissions: raw.can_manage_permissions ?? false,
    can_reset_password: raw.can_reset_password ?? false,
    activity: raw.activity ?? [],
    roles: raw.roles ?? [],
  };
}

// ─── Business ─────────────────────────────────────────────────────────────────

export const accountApi = {
  getProfile: () => apiClient.get<ApiResponse<AccountProfile>>("/account/me").then(data),
  updateProfile: (body: UpdateAccountProfileRequest) =>
    apiClient.patch<ApiResponse<AccountProfile>>("/account/profile", body).then(data),
  uploadAvatar: (file: File) => {
    const form = new FormData();
    form.append("avatar", file);
    return apiClient
      .post<ApiResponse<AccountProfile>>("/account/avatar", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(data);
  },
  deactivate: () => apiClient.post("/account/deactivate"),
};

export const businessApi = {
  get: () => apiClient.get<ApiResponse<Business>>("/business").then(data),
  update: (body: UpdateBusinessRequest) =>
    apiClient.patch<ApiResponse<Business>>("/business", body).then(data),
  uploadLogo: (file: File) => {
    const form = new FormData();
    form.append("logo", file);
    return apiClient
      .post<ApiResponse<Business>>("/business/logo", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(data);
  },
  updateHours: (body: UpdateBusinessHoursRequest) =>
    apiClient
      .put<ApiResponse<Business>>("/business/hours", body)
      .then(data),
  updateCurrencies: (body: UpdateCurrencySettingsRequest) =>
    apiClient.put<ApiResponse<Business>>("/business/currencies", body).then(data),
  updateVsdc: (body: { client_id: string; client_secret?: string }) =>
    apiClient
      .patch<ApiResponse<{ vsdc_configured: boolean }>>("/business/vsdc", body)
      .then(data),
  clearVsdc: () =>
    apiClient
      .delete<ApiResponse<{ vsdc_configured: boolean }>>("/business/vsdc")
      .then(data),
  team: {
    previewInvite: async (token: string) => {
      const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";
      const res = await fetch(
        `${base}/team/invite/preview?token=${encodeURIComponent(token)}`
      );
      const json = (await res.json()) as ApiResponse<InvitePreview>;
      if (!res.ok) throw { response: { data: json } };
      return json.data;
    },
    list: () => apiClient.get<ApiResponse<TeamListData>>("/team").then(data),
    getMember: (id: string) =>
      apiClient
        .get<ApiResponse<TeamMemberDetail>>(`/team/members/${id}`)
        .then((res) => normalizeTeamMemberDetail(data(res))),
    listRoles: () => apiClient.get<ApiResponse<TeamRolesData>>("/team/roles").then(data),
    updateRolePermissions: (role: string, permissions: string[]) =>
      apiClient.put(`/team/roles/${role}/permissions`, { permissions }),
    resetRolePermissions: (role: string) =>
      apiClient.delete(`/team/roles/${role}/permissions`),
    createCustomRole: (body: { name: string; description?: string; permissions: string[] }) =>
      apiClient.post<ApiResponse<TeamRoleWithPermissions>>("/team/custom-roles", body).then(data),
    updateCustomRole: (
      id: string,
      body: { name?: string; description?: string; permissions: string[] },
    ) => apiClient.patch<ApiResponse<TeamRoleWithPermissions>>(`/team/custom-roles/${id}`, body).then(data),
    deleteCustomRole: (id: string) => apiClient.delete(`/team/custom-roles/${id}`),
    invite: (body: {
      email?: string;
      phone?: string;
      name?: string;
      role?: string;
      role_id?: string;
      provision_account?: boolean;
    }) => apiClient.post<ApiResponse<TeamInviteCreated>>("/team/invite", body).then(data),
    updateRole: (id: string, body: { role?: string; role_id?: string }) =>
      apiClient.patch(`/team/${id}/role`, body),
    deactivate: (id: string) => apiClient.delete(`/team/${id}`),
    resetPassword: (id: string) =>
      apiClient
        .post<ApiResponse<ResetMemberPasswordResult>>(`/team/members/${id}/reset-password`)
        .then(data),
    updateMemberPermissions: (id: string, permissions: string[]) =>
      apiClient.put(`/team/members/${id}/permissions`, { permissions }),
    listAuditEvents: (params?: { limit?: number; offset?: number; actor_id?: string; action?: string }) =>
      apiClient.get<ApiResponse<AuditListData>>("/audit/events", { params }).then(data),
    accept: (token: string) => {
      const user = useAuthStore.getState().user;
      return apiClient
        .post<ApiResponse<{ business_id: string; user_id: string }>>(
          "/team/accept",
          { token },
          {
            headers: {
              "X-User-Email": user?.email ?? "",
              "X-User-Name": user?.name ?? "",
            },
          }
        )
        .then(data);
    },
  },
  notifications: {
    list: (limit?: number) =>
      apiClient
        .get<ApiResponse<NotificationListData>>("/notifications", {
          params: { limit },
        })
        .then(data),
    markRead: (id: string) => apiClient.patch(`/notifications/${id}/read`),
  },
  attention: {
    list: (category?: string) =>
      apiClient
        .get<ApiResponse<AttentionListData>>("/attention", {
          params: category ? { category } : undefined,
        })
        .then(data),
  },
  alertRules: {
    list: () =>
      apiClient.get<ApiResponse<AlertRuleListData>>("/alert-rules").then(data),
    update: (
      eventType: string,
      body: Partial<Pick<AlertRule, "enabled" | "days_before" | "hours_before" | "day_of_month" | "in_app">>
    ) => apiClient.patch<ApiResponse<AlertRule>>(`/alert-rules/${eventType}`, body).then(data),
  },
  modules: () =>
    apiClient
      .get<ApiResponse<{ modules: BusinessModule[] }>>("/business/modules")
      .then(data),
};

// ─── Customers ────────────────────────────────────────────────────────────────

export const customersApi = {
  list: (params?: {
    search?: string;
    page?: number;
    limit?: number;
    owes_only?: boolean;
  }) => {
    const limit = params?.limit ?? 20;
    const offset = params?.page ? (params.page - 1) * limit : 0;
    return apiClient
      .get<ApiResponse<CustomerListData>>("/customers", {
        params: {
          search: params?.search,
          limit,
          offset,
          owes_only: params?.owes_only ? "true" : undefined,
        },
      })
      .then(data);
  },
  get: (id: string) =>
    apiClient.get<ApiResponse<CustomerDetail>>(`/customers/${id}`).then(data),
  create: (body: CreateCustomerRequest) =>
    apiClient.post<ApiResponse<Customer>>("/customers", body).then(data),
  update: (id: string, body: UpdateCustomerRequest) =>
    apiClient.patch<ApiResponse<Customer>>(`/customers/${id}`, body).then(data),
  delete: (id: string) => apiClient.delete(`/customers/${id}`),
};

// ─── Sales ────────────────────────────────────────────────────────────────────

export const salesApi = {
  list: (params?: {
    page?: number;
    limit?: number;
    from?: string;
    to?: string;
    payment_method?: string;
    source_type?: string;
    search?: string;
  }) => {
    const limit = params?.limit ?? 50;
    const offset = params?.page ? (params.page - 1) * limit : 0;
    return apiClient
      .get<ApiResponse<SaleListData>>("/sales", {
        params: {
          limit,
          offset,
          from: params?.from,
          to: params?.to,
          payment_method: params?.payment_method,
          source_type: params?.source_type,
          search: params?.search,
        },
      })
      .then(data);
  },
  get: (id: string) =>
    apiClient.get<ApiResponse<Sale>>(`/sales/${id}`).then(data),
  record: (body: RecordSaleRequest) =>
    apiClient.post<ApiResponse<Sale>>("/sales", body).then(data),
  update: (id: string, body: RecordSaleRequest) =>
    apiClient.patch<ApiResponse<Sale>>(`/sales/${id}`, body).then(data),
  delete: (id: string) => apiClient.delete(`/sales/${id}`),
  summary: (params?: { date?: string; from?: string; to?: string; period?: string }) =>
    apiClient
      .get<ApiResponse<SaleSummary>>("/sales/summary", { params })
      .then(data),
  trends: (params?: { days?: number; from?: string; to?: string }) =>
    apiClient
      .get<ApiResponse<SalesTrends>>("/sales/trends", { params })
      .then(data),
};

// ─── Expenses ─────────────────────────────────────────────────────────────────

export const expensesApi = {
  list: (params?: {
    page?: number;
    limit?: number;
    from?: string;
    to?: string;
    category?: string;
    search?: string;
  }) => {
    const limit = params?.limit ?? 20;
    const offset = params?.page ? (params.page - 1) * limit : 0;
    return apiClient
      .get<ApiResponse<ExpenseListData>>("/expenses", {
        params: {
          limit,
          offset,
          from: params?.from,
          to: params?.to,
          category: params?.category,
          search: params?.search,
        },
      })
      .then(data);
  },
  summary: (params?: { date?: string; from?: string; to?: string; period?: string }) =>
    apiClient
      .get<ApiResponse<ExpenseSummary>>("/expenses/summary", { params })
      .then(data),
  trends: (params?: { from?: string; to?: string; days?: number }) =>
    apiClient
      .get<ApiResponse<ExpenseTrends>>("/expenses/trends", { params })
      .then(data),
  log: (body: LogExpenseRequest) =>
    apiClient.post<ApiResponse<Expense>>("/expenses", body).then(data),
  get: (id: string) =>
    apiClient.get<ApiResponse<Expense>>(`/expenses/${id}`).then(data),
  update: (id: string, body: LogExpenseRequest) =>
    apiClient.patch<ApiResponse<Expense>>(`/expenses/${id}`, body).then(data),
  delete: (id: string) => apiClient.delete(`/expenses/${id}`),
};

// ─── Invoices ─────────────────────────────────────────────────────────────────

export const invoicesApi = {
  settings: {
    get: () =>
      apiClient.get<ApiResponse<InvoiceSettings>>("/invoices/settings").then(data),
    update: (body: UpdateInvoiceSettingsRequest) =>
      apiClient.patch<ApiResponse<InvoiceSettings>>("/invoices/settings", body).then(data),
    previewPdf: async (template?: string) => {
      const res = await apiClient.get("/invoices/settings/preview", {
        responseType: "blob",
        params: template ? { template } : undefined,
      });
      return res.data as Blob;
    },
  },
  list: (params?: {
    page?: number;
    limit?: number;
    status?: Invoice["status"];
    type?: InvoiceDocType;
    customer_id?: string;
    from?: string;
    to?: string;
  }) =>
    apiClient
      .get<ApiResponse<InvoiceListData>>("/invoices", {
        params: {
          limit: params?.limit,
          offset: params?.page ? (params.page - 1) * (params?.limit ?? 50) : undefined,
          status: params?.status,
          type: params?.type,
          customer_id: params?.customer_id,
          from: params?.from,
          to: params?.to,
        },
      })
      .then(data),
  get: (id: string) =>
    apiClient.get<ApiResponse<Invoice>>(`/invoices/${id}`).then(data),
  create: (body: CreateInvoiceRequest) =>
    apiClient.post<ApiResponse<Invoice>>("/invoices", body).then(data),
  update: (id: string, body: UpdateInvoiceRequest) =>
    apiClient.patch<ApiResponse<Invoice>>(`/invoices/${id}`, body).then(data),
  convertToInvoice: (id: string) =>
    apiClient
      .post<ApiResponse<Invoice>>(`/invoices/${id}/convert-to-invoice`)
      .then(data),
  send: (id: string, body?: { via?: string; phone_number?: string }) =>
    apiClient
      .post<ApiResponse<SendInvoiceResponse>>(`/invoices/${id}/send`, {
        via: body?.via ?? "whatsapp",
        phone_number: body?.phone_number,
      })
      .then(data),
  recordPayment: (id: string, body: RecordPaymentRequest) =>
    apiClient.post<ApiResponse<Invoice>>(`/invoices/${id}/pay`, body).then(data),
  cancel: (id: string) => apiClient.delete(`/invoices/${id}`),
  delete: (id: string) => apiClient.delete(`/invoices/${id}`),
  downloadPdf: async (id: string) => {
    const res = await apiClient.get(`/invoices/${id}/pdf`, {
      responseType: "blob",
    });
    return res.data as Blob;
  },
};

// ─── Accounts ────────────────────────────────────────────────────────────────

export const accountsApi = {
  summary: (params?: { period?: "30d" | "90d" | "365d"; from?: string; to?: string }) =>
    apiClient
      .get<ApiResponse<AccountsSummary>>("/accounts/summary", { params })
      .then(data),
  trend: (months?: number) =>
    apiClient.get<ApiResponse<TrendData>>("/accounts/trend", { params: { months } }).then(data),
  pnl: (params?: { from?: string; to?: string }) =>
    apiClient.get<ApiResponse<PnLReport>>("/accounts/pnl", { params }).then(data),
  cashflow: (params?: { from?: string; to?: string }) =>
    apiClient.get<ApiResponse<CashFlowReport>>("/accounts/cashflow", { params }).then(data),
  tax: {
    vatSummary: (period?: string) =>
      apiClient.get<ApiResponse<VATSummary>>("/accounts/tax/vat-summary", { params: { period } }).then(data),
    vatReturn: (period?: string) =>
      apiClient.get<ApiResponse<VATReturn>>("/accounts/tax/vat-return", { params: { period } }).then(data),
    markFiled: (period: string, tax_type: string) =>
      apiClient.post("/accounts/tax/mark-filed", { period, tax_type }),
  },
  journal: {
    list: (params?: { from?: string; to?: string; module?: string; limit?: number; page?: number }) => {
      const limit = params?.limit ?? 50;
      const offset = params?.page ? (params.page - 1) * limit : 0;
      return apiClient.get<ApiResponse<JournalListData>>("/accounts/journal", { params: { ...params, limit, offset } }).then(data);
    },
    context: () =>
      apiClient.get<ApiResponse<JournalContextData>>("/accounts/journal/context").then(data),
    sync: () =>
      apiClient.post<ApiResponse<JournalSyncData>>("/accounts/journal/sync").then(data),
    create: (body: { date: string; description: string; currency: string; lines: { account_code: string; account_name: string; debit: number; credit: number }[] }) =>
      apiClient.post<ApiResponse<JournalEntry>>("/accounts/journal", body).then(data),
  },
  exchangeRates: {
    list: () => apiClient.get<ApiResponse<{ rates: ExchangeRate[] }>>("/accounts/exchange-rates").then(data),
    set: (body: { from_currency: string; to_currency: string; rate: number }) =>
      apiClient.post("/accounts/exchange-rates", body),
  },
};

// ─── Inventory ────────────────────────────────────────────────────────────────

export const inventoryApi = {
  listCategories: (type?: "product" | "service") =>
    apiClient
      .get<ApiResponse<InventoryCategoryListData>>("/inventory/categories", { params: type ? { type } : {} })
      .then(data),
  createCategory: (body: { type: "product" | "service"; name: string }) =>
    apiClient.post<ApiResponse<InventoryCategory>>("/inventory/categories", body).then(data),
  list: (params?: {
    type?: string;
    category?: string;
    status?: string;
    search?: string;
    storefront_visible?: boolean;
    is_bookable?: boolean;
    limit?: number;
    page?: number;
  }) => {
    const limit = params?.limit ?? 50;
    const offset = params?.page ? (params.page - 1) * limit : 0;
    const { page: _page, ...rest } = params ?? {};
    return apiClient
      .get<ApiResponse<InventoryItemListData>>("/inventory", { params: { ...rest, limit, offset } })
      .then(data);
  },
  serviceStats: (params?: { from?: string; to?: string }) =>
    apiClient.get<ApiResponse<ServiceStatsResponse>>("/inventory/services/stats", { params }).then(data),
  get: (id: string) =>
    apiClient.get<ApiResponse<InventoryItem>>(`/inventory/${id}`).then(data),
  create: (body: CreateInventoryItemRequest) =>
    apiClient.post<ApiResponse<InventoryItem>>("/inventory", body).then(data),
  update: (id: string, body: UpdateInventoryItemRequest) =>
    apiClient.patch<ApiResponse<InventoryItem>>(`/inventory/${id}`, body).then(data),
  duplicate: (id: string) =>
    apiClient.post<ApiResponse<InventoryItem>>(`/inventory/${id}/duplicate`).then(data),
  delete: (id: string) => apiClient.delete(`/inventory/${id}`),
  uploadPhoto: (id: string, file: File) => {
    const form = new FormData();
    form.append("photo", file);
    return apiClient.post<ApiResponse<InventoryItem>>(`/inventory/${id}/photo`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then(data);
  },
  uploadGalleryPhoto: (id: string, file: File) => {
    const form = new FormData();
    form.append("photo", file);
    return apiClient.post<ApiResponse<InventoryItem>>(`/inventory/${id}/gallery`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then(data);
  },
  removeGalleryPhoto: (id: string, url: string) =>
    apiClient.delete<ApiResponse<InventoryItem>>(`/inventory/${id}/gallery`, { data: { url } }).then(data),
  uploadColorPhoto: (productId: string, color: string, file: File) => {
    const form = new FormData();
    form.append("photo", file);
    form.append("color", color);
    return apiClient
      .post<ApiResponse<ColorPhotoResponse>>(`/inventory/${productId}/color-photo`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(data);
  },
  clearColorPhoto: (productId: string, color: string) =>
    apiClient
      .delete<ApiResponse<ColorPhotoResponse>>(`/inventory/${productId}/color-photo`, {
        data: { color },
      })
      .then(data),
  movements: (id: string, params?: { limit?: number; offset?: number }) =>
    apiClient.get<ApiResponse<StockMovementListData>>(`/inventory/${id}/movements`, { params }).then(data),
  restock: (id: string, body: RestockRequest) =>
    apiClient.post<ApiResponse<InventoryItem>>(`/inventory/${id}/restock`, body).then(data),
  adjust: (id: string, body: AdjustStockRequest) =>
    apiClient.post<ApiResponse<InventoryItem>>(`/inventory/${id}/adjust`, body).then(data),
  writeOff: (id: string, body: WriteOffRequest) =>
    apiClient.post<ApiResponse<InventoryItem>>(`/inventory/${id}/write-off`, body).then(data),
  lowStock: () =>
    apiClient.get<ApiResponse<InventoryItemListData>>("/inventory/low-stock").then(data),
  valuation: () =>
    apiClient.get<ApiResponse<StockValuation>>("/inventory/valuation").then(data),

  suppliers: {
    list: () => apiClient.get<ApiResponse<SupplierListData>>("/suppliers").then(data),
    get: (id: string) => apiClient.get<ApiResponse<Supplier>>(`/suppliers/${id}`).then(data),
    create: (body: CreateSupplierRequest) => apiClient.post<ApiResponse<Supplier>>("/suppliers", body).then(data),
    update: (id: string, body: UpdateSupplierRequest) => apiClient.patch<ApiResponse<Supplier>>(`/suppliers/${id}`, body).then(data),
    delete: (id: string) => apiClient.delete(`/suppliers/${id}`),
  },

  purchaseOrders: {
    list: (params?: { status?: string; limit?: number; page?: number }) => {
      const limit = params?.limit ?? 50;
      const offset = params?.page ? (params.page - 1) * limit : 0;
      return apiClient.get<ApiResponse<POListData>>("/inventory/purchase-orders", { params: { ...params, limit, offset } }).then(data);
    },
    get: (id: string) => apiClient.get<ApiResponse<PurchaseOrder>>(`/inventory/purchase-orders/${id}`).then(data),
    create: (body: CreatePORequest) => apiClient.post<ApiResponse<PurchaseOrder>>("/inventory/purchase-orders", body).then(data),
    update: (id: string, body: { status?: string; notes?: string; expected_at?: string }) =>
      apiClient.patch<ApiResponse<PurchaseOrder>>(`/inventory/purchase-orders/${id}`, body).then(data),
    receive: (id: string, body: ReceivePORequest) =>
      apiClient.post<ApiResponse<PurchaseOrder>>(`/inventory/purchase-orders/${id}/receive`, body).then(data),
  },
};

// ─── Appointments ─────────────────────────────────────────────────────────────

export const appointmentsApi = {
  list: (params?: {
    from?: string;
    to?: string;
    status?: string;
    service_id?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) =>
    apiClient
      .get<ApiResponse<AppointmentListData>>("/appointments", { params })
      .then(data),
  calendar: (params: { from: string; to: string; status?: string; service_id?: string }) =>
    apiClient
      .get<ApiResponse<AppointmentListData>>("/appointments/calendar", { params })
      .then(data),
  availability: (date: string, serviceId: string) =>
    apiClient
      .get<ApiResponse<AppointmentAvailability>>("/appointments/availability", {
        params: { date, service: serviceId },
      })
      .then(data),
  get: (id: string) =>
    apiClient.get<ApiResponse<Appointment>>(`/appointments/${id}`).then(data),
  create: (body: CreateAppointmentRequest) =>
    apiClient.post<ApiResponse<Appointment>>("/appointments", body).then(data),
  update: (id: string, body: UpdateAppointmentRequest) =>
    apiClient.patch<ApiResponse<Appointment>>(`/appointments/${id}`, body).then(data),
  confirm: (id: string) =>
    apiClient.post<ApiResponse<Appointment>>(`/appointments/${id}/confirm`).then(data),
  complete: (id: string, body?: CompleteAppointmentRequest) =>
    apiClient
      .post<ApiResponse<Appointment>>(`/appointments/${id}/complete`, body ?? {})
      .then(data),
  cancel: (id: string, body?: CancelAppointmentRequest) =>
    apiClient.post<ApiResponse<Appointment>>(`/appointments/${id}/cancel`, body ?? {}).then(data),
  noShow: (id: string) =>
    apiClient.post<ApiResponse<Appointment>>(`/appointments/${id}/no-show`).then(data),
  reschedule: (id: string, body: RescheduleAppointmentRequest) =>
    apiClient
      .post<ApiResponse<Appointment>>(`/appointments/${id}/reschedule`, body)
      .then(data),
  sendReminder: (id: string) =>
    apiClient.post<ApiResponse<Appointment>>(`/appointments/${id}/send-reminder`).then(data),
  hours: {
    get: () =>
      apiClient
        .get<ApiResponse<{ hours: BusinessHoursDay[] }>>("/appointments/hours")
        .then(data),
    update: (hours: BusinessHoursDay[]) =>
      apiClient
        .put<ApiResponse<{ hours: BusinessHoursDay[] }>>("/appointments/hours", { hours })
        .then(data),
  },
  settings: {
    get: () =>
      apiClient
        .get<ApiResponse<AppointmentSettings>>("/appointments/settings")
        .then(data),
    update: (body: Partial<AppointmentSettingsUpdate>) =>
      apiClient.patch<ApiResponse<AppointmentSettings>>("/appointments/settings", body).then(data),
  },
  blocked: {
    list: (params?: { from?: string; to?: string }) =>
      apiClient
        .get<ApiResponse<BlockedTimeListData>>("/appointments/blocked", { params })
        .then(data),
    create: (body: CreateBlockedTimeRequest) =>
      apiClient.post("/appointments/blocked", body),
    delete: (id: string) => apiClient.delete(`/appointments/blocked/${id}`),
  },
};

// ─── Marketplace ──────────────────────────────────────────────────────────────

export const marketplaceApi = {
  summary: () =>
    apiClient.get<ApiResponse<{ pending_orders: number; today_orders: number; today_bookings: number; unread_orders: number; unread_enquiries: number }>>("/marketplace/summary").then(data),
  profile: {
    get: () => apiClient.get<ApiResponse<StorefrontProfile>>("/marketplace/profile").then(data),
    update: (body: UpdateStorefrontProfileRequest) =>
      apiClient.put<ApiResponse<StorefrontProfile>>("/marketplace/profile", body).then(data),
    togglePublish: () =>
      apiClient.patch<ApiResponse<StorefrontProfile>>("/marketplace/profile/publish").then(data),
  },
  work: {
    list: () => apiClient.get<ApiResponse<WorkProject[]>>("/marketplace/work").then(data),
    get: (id: string) => apiClient.get<ApiResponse<WorkProject>>(`/marketplace/work/${id}`).then(data),
    create: (body: CreateWorkProjectRequest) =>
      apiClient.post<ApiResponse<WorkProject>>("/marketplace/work", body).then(data),
    update: (id: string, body: UpdateWorkProjectRequest) =>
      apiClient.patch<ApiResponse<WorkProject>>(`/marketplace/work/${id}`, body).then(data),
    delete: (id: string) => apiClient.delete(`/marketplace/work/${id}`),
    reorder: (ids: string[]) =>
      apiClient.patch<ApiResponse<{ ok: boolean }>>("/marketplace/work/reorder", { ids }).then(data),
    uploadCover: (id: string, formData: FormData) =>
      apiClient.post<ApiResponse<WorkProject>>(`/marketplace/work/${id}/cover`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }).then(data),
    uploadImage: (id: string, formData: FormData) =>
      apiClient.post<ApiResponse<WorkProjectImage>>(`/marketplace/work/${id}/images`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }).then(data),
    updateImage: (projectId: string, imageId: string, body: UpdateWorkProjectImageRequest) =>
      apiClient
        .patch<ApiResponse<WorkProjectImage>>(`/marketplace/work/${projectId}/images/${imageId}`, body)
        .then(data),
    deleteImage: (projectId: string, imageId: string) =>
      apiClient.delete(`/marketplace/work/${projectId}/images/${imageId}`),
  },
  portfolio: {
    list: () => apiClient.get<ApiResponse<PortfolioImage[]>>("/marketplace/portfolio").then(data),
    upload: (formData: FormData) =>
      apiClient.post<ApiResponse<PortfolioImage>>("/marketplace/portfolio", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }).then(data),
    update: (id: string, body: UpdatePortfolioImageRequest) =>
      apiClient.patch<ApiResponse<PortfolioImage>>(`/marketplace/portfolio/${id}`, body).then(data),
    delete: (id: string) => apiClient.delete(`/marketplace/portfolio/${id}`),
    reorder: (ids: string[]) =>
      apiClient.patch<ApiResponse<{ ok: boolean }>>("/marketplace/portfolio/reorder", { ids }).then(data),
  },
  reviews: {
    list: () => apiClient.get<ApiResponse<MarketplaceReview[]>>("/marketplace/reviews").then(data),
    reply: (id: string, reply: string) =>
      apiClient.post<ApiResponse<{ ok: boolean }>>(`/marketplace/reviews/${id}/reply`, { reply }).then(data),
    flag: (id: string) =>
      apiClient.post<ApiResponse<{ ok: boolean }>>(`/marketplace/reviews/${id}/flag`).then(data),
  },
  orders: {
    list: (params?: {
      limit?: number;
      offset?: number;
      status?: OrderStatus;
      search?: string;
      from?: string;
      to?: string;
    }) =>
      apiClient.get<ApiResponse<OrderListData>>("/marketplace/orders", { params }).then(data),
    get: (id: string) =>
      apiClient.get<ApiResponse<MarketplaceOrder>>(`/marketplace/orders/${id}`).then(data),
    updateStatus: (id: string, body: UpdateOrderStatusRequest) =>
      apiClient.patch<ApiResponse<MarketplaceOrder>>(`/marketplace/orders/${id}/status`, body).then(data),
    createCustomer: (id: string) =>
      apiClient
        .post<ApiResponse<MarketplaceOrder>>(`/marketplace/orders/${id}/create-customer`)
        .then(data),
  },
  enquiries: {
    list: (params?: { limit?: number; offset?: number }) =>
      apiClient.get<ApiResponse<EnquiryListData>>("/marketplace/enquiries", { params }).then(data),
    markRead: (id: string) =>
      apiClient.patch<ApiResponse<MarketplaceEnquiry>>(`/marketplace/enquiries/${id}/read`).then(data),
  },
  discounts: {
    analytics: () =>
      apiClient.get<ApiResponse<DiscountAnalytics>>("/marketplace/discounts/analytics").then(data),
  },
  coupons: {
    list: () => apiClient.get<ApiResponse<StorefrontCoupon[]>>("/marketplace/coupons").then(data),
    get: (id: string) =>
      apiClient.get<ApiResponse<StorefrontCoupon>>(`/marketplace/coupons/${id}`).then(data),
    create: (body: CreateCouponRequest) =>
      apiClient.post<ApiResponse<StorefrontCoupon>>("/marketplace/coupons", body).then(data),
    update: (id: string, body: UpdateCouponRequest) =>
      apiClient.patch<ApiResponse<StorefrontCoupon>>(`/marketplace/coupons/${id}`, body).then(data),
    delete: (id: string) => apiClient.delete(`/marketplace/coupons/${id}`),
    setCustomers: (id: string, customerIds: string[]) =>
      apiClient
        .put<ApiResponse<StorefrontCoupon>>(`/marketplace/coupons/${id}/customers`, {
          customer_ids: customerIds,
        })
        .then(data),
    send: (id: string, body: SendCouponRequest) =>
      apiClient.post<ApiResponse<SendCouponResponse>>(`/marketplace/coupons/${id}/send`, body).then(data),
  },
  promotions: {
    list: () => apiClient.get<ApiResponse<StorefrontPromotion[]>>("/marketplace/promotions").then(data),
    get: (id: string) =>
      apiClient.get<ApiResponse<StorefrontPromotion>>(`/marketplace/promotions/${id}`).then(data),
    create: (body: CreatePromotionRequest) =>
      apiClient.post<ApiResponse<StorefrontPromotion>>("/marketplace/promotions", body).then(data),
    update: (id: string, body: UpdatePromotionRequest) =>
      apiClient.patch<ApiResponse<StorefrontPromotion>>(`/marketplace/promotions/${id}`, body).then(data),
    delete: (id: string) => apiClient.delete(`/marketplace/promotions/${id}`),
    uploadFlyer: (id: string, file: File) => {
      const form = new FormData();
      form.append("flyer", file);
      return apiClient
        .post<ApiResponse<StorefrontPromotion>>(`/marketplace/promotions/${id}/flyer`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then(data);
    },
    duplicate: (id: string) =>
      apiClient.post<ApiResponse<StorefrontPromotion>>(`/marketplace/promotions/${id}/duplicate`).then(data),
  },
};

// ─── Blog ─────────────────────────────────────────────────────────────────────

export const blogApi = {
  list: (params?: { status?: string; search?: string; limit?: number; page?: number }) => {
    const limit = params?.limit ?? 50;
    const offset = params?.page ? (params.page - 1) * limit : 0;
    return apiClient
      .get<ApiResponse<BlogPostListData>>("/blog/posts", {
        params: { status: params?.status, search: params?.search, limit, offset },
      })
      .then(data);
  },
  get: (id: string) =>
    apiClient.get<ApiResponse<BlogPost>>(`/blog/posts/${id}`).then(data),
  create: (body: CreateBlogPostRequest) =>
    apiClient.post<ApiResponse<BlogPost>>("/blog/posts", body).then(data),
  update: (id: string, body: UpdateBlogPostRequest) =>
    apiClient.patch<ApiResponse<BlogPost>>(`/blog/posts/${id}`, body).then(data),
  delete: (id: string) => apiClient.delete(`/blog/posts/${id}`),
  publish: (id: string) =>
    apiClient.patch<ApiResponse<BlogPost>>(`/blog/posts/${id}/publish`).then(data),
  unpublish: (id: string) =>
    apiClient.patch<ApiResponse<BlogPost>>(`/blog/posts/${id}/unpublish`).then(data),
  uploadCover: (id: string, file: File) => {
    const form = new FormData();
    form.append("cover", file);
    return apiClient
      .post<ApiResponse<BlogPost>>(`/blog/posts/${id}/cover`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(data);
  },
};

// ─── Public storefront (no JWT) ───────────────────────────────────────────────

export const publicApi = {
  storefront: (slug: string) =>
    apiClient.get<ApiResponse<PublicStorefront>>(`/public/${slug}`).then(data),
  workProjects: (slug: string) =>
    apiClient.get<ApiResponse<PublicWorkProjectSummary[]>>(`/public/${slug}/work`).then(data),
  workProject: (slug: string, id: string) =>
    apiClient.get<ApiResponse<PublicWorkProjectDetail>>(`/public/${slug}/work/${id}`).then(data),
  promotions: (slug: string) =>
    apiClient.get<ApiResponse<PublicPromotionsData>>(`/public/${slug}/promotions`).then(data),
  validateCoupon: (slug: string, body: ValidateCouponRequest) =>
    apiClient.post<ApiResponse<ValidateCouponResponse>>(`/public/${slug}/coupons/validate`, body).then(data),
  placeOrder: (slug: string, body: PlaceOrderRequest) =>
    apiClient.post<ApiResponse<MarketplaceOrder>>(`/public/${slug}/order`, body).then(data),
  submitEnquiry: (slug: string, body: SubmitEnquiryRequest) =>
    apiClient.post<ApiResponse<SubmitEnquiryResponse>>(`/public/${slug}/enquiry`, body).then(data),
  blogList: (
    slug: string,
    params?: { limit?: number; offset?: number; q?: string; category?: string },
  ) =>
    apiClient
      .get<ApiResponse<PublicBlogListData>>(`/public/${slug}/blog`, { params })
      .then(data),
  blogPost: (slug: string, postSlug: string) =>
    apiClient.get<ApiResponse<BlogPost>>(`/public/${slug}/blog/${postSlug}`).then(data),
  exchangeSupportCode: (code: string) =>
    apiClient
      .post<
        ApiResponse<{
          token: string;
          session: { session_id: string; business_id: string; scope: string };
        }>
      >("/public/support/exchange", { code })
      .then(data),
};

// ─── Support access (merchant) ────────────────────────────────────────────────

export const supportApi = {
  grants: () =>
    apiClient
      .get<
        ApiResponse<
          {
            id: string;
            status: string;
            scope: string;
            reason: string;
            has_code: boolean;
            expires_at: string;
            created_at: string;
          }[]
        >
      >("/support/grants")
      .then(data),
  createGrant: (body: { scope?: string; reason?: string; hours?: number }) =>
    apiClient
      .post<
        ApiResponse<{
          grant: { id: string; status: string; scope: string; expires_at: string };
          code?: string;
        }>
      >("/support/grants", body)
      .then(data),
  approveGrant: (id: string) =>
    apiClient.post(`/support/grants/${id}/approve`).then(data),
  revokeGrant: (id: string) =>
    apiClient.post(`/support/grants/${id}/revoke`).then(data),
  regenerateCode: (id: string) =>
    apiClient.post<ApiResponse<{ code: string }>>(`/support/grants/${id}/code`).then(data),
  activeSessions: () =>
    apiClient
      .get<
        ApiResponse<{ id: string; scope: string; admin_name: string; started_at: string }[]>
      >("/support/sessions/active")
      .then(data),
  endSession: (id: string) =>
    apiClient.post(`/support/sessions/${id}/end`).then(data),
};

// ─── Inventory variants ────────────────────────────────────────────────────────

export const variantsApi = {
  list: (productId: string) =>
    apiClient.get<ApiResponse<ProductVariant[]>>(`/inventory/${productId}/variants`).then(data),
  create: (productId: string, body: CreateVariantRequest) =>
    apiClient.post<ApiResponse<ProductVariant>>(`/inventory/${productId}/variants`, body).then(data),
  update: (productId: string, variantId: string, body: UpdateVariantRequest) =>
    apiClient.patch<ApiResponse<ProductVariant>>(`/inventory/${productId}/variants/${variantId}`, body).then(data),
  delete: (productId: string, variantId: string) =>
    apiClient.delete(`/inventory/${productId}/variants/${variantId}`),
};

// ─── POS ──────────────────────────────────────────────────────────────────────

export const posApi = {
  getSettings: () => apiClient.get<ApiResponse<PosSettings>>("/pos/settings").then(data),
  updateSettings: (body: Partial<PosSettings>) =>
    apiClient.patch<ApiResponse<PosSettings>>("/pos/settings", body).then(data),
  getActiveSession: () => apiClient.get<ApiResponse<PosSession>>("/pos/session/active").then(data),
  openSession: (body: { register_id?: string; opening_float?: number }) =>
    apiClient.post<ApiResponse<PosSession>>("/pos/session/open", body).then(data),
  closeSession: (id: string, body: { counted_cash: number; close_note?: string }) =>
    apiClient.post<ApiResponse<PosSession>>(`/pos/session/${id}/close`, body).then(data),
  sessionCloseReport: (sessionId: string) =>
    apiClient.get<ApiResponse<PosSessionCloseReport>>(`/pos/session/${sessionId}/report`).then(data),
  catalog: (params?: { search?: string; category?: string; type?: string }) =>
    apiClient.get<ApiResponse<PosCatalogData>>("/pos/catalog", { params }).then(data),
  scan: (code: string) =>
    apiClient.get<ApiResponse<PosCatalogItem>>("/pos/catalog/scan", { params: { code } }).then(data),
  checkout: (body: PosCheckoutRequest) =>
    apiClient.post<ApiResponse<PosCheckoutResult>>("/pos/checkout", body).then(data),
  hold: (body: { session_id: string; label: string; cart: PosHeldCart["cart"] }) =>
    apiClient.post<ApiResponse<PosHeldCart>>("/pos/hold", body).then(data),
  listHeld: (sessionId?: string) =>
    apiClient
      .get<ApiResponse<{ carts: PosHeldCart[] }>>("/pos/hold", {
        params: sessionId ? { session_id: sessionId } : undefined,
      })
      .then(data),
  deleteHeld: (id: string) => apiClient.delete(`/pos/hold/${id}`),
  listSales: (params?: { limit?: number; offset?: number }) =>
    apiClient
      .get<ApiResponse<{ sales: PosSaleSummary[]; total: number }>>("/pos/sales", { params })
      .then(data),
  salesReport: (params?: { from?: string; to?: string; limit?: number; offset?: number }) =>
    apiClient.get<ApiResponse<PosSalesReport>>("/pos/sales/report", { params }).then(data),
  receipt: (saleId: string) => apiClient.get<ApiResponse<PosReceipt>>(`/pos/sales/${saleId}/receipt`).then(data),
  voidSale: (saleId: string) => apiClient.post(`/pos/sales/${saleId}/void`),
};

// ─── AI ───────────────────────────────────────────────────────────────────────

export type DraftStreamHandlers = {
  onDelta: (text: string) => void;
  onDone: (meta: AIDraftMeta) => void;
  onError: (message: string) => void;
};

async function aiStreamRequest(
  path: string,
  body: unknown,
  handlers: DraftStreamHandlers,
  signal?: AbortSignal
): Promise<void> {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";
  const token = useAuthStore.getState().token;
  let res: Response;
  try {
    res = await fetch(`${base}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
      signal,
    });
  } catch {
    handlers.onError("Could not reach the server");
    return;
  }
  if (!res.ok) {
    let msg = "Request failed";
    try {
      const j = (await res.json()) as { error?: string; code?: string };
      msg = j.error ?? j.code ?? msg;
    } catch {
      // non-JSON error body
    }
    handlers.onError(msg);
    return;
  }
  if (!res.body) {
    handlers.onError("No response stream");
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  const dispatch = (raw: string) => {
    let event = "message";
    let dataStr = "";
    for (const line of raw.split("\n")) {
      if (line.startsWith("event:")) event = line.slice(6).trim();
      else if (line.startsWith("data:")) dataStr += line.slice(5).trim();
    }
    if (!dataStr) return;
    let parsed: unknown;
    try {
      parsed = JSON.parse(dataStr);
    } catch {
      return;
    }
    if (event === "delta") {
      handlers.onDelta((parsed as { text?: string }).text ?? "");
    } else if (event === "done") {
      handlers.onDone(parsed as AIDraftMeta);
    } else if (event === "error") {
      handlers.onError((parsed as { error?: string }).error ?? "Stream error");
    }
  };

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let idx: number;
    while ((idx = buffer.indexOf("\n\n")) >= 0) {
      const chunk = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 2);
      dispatch(chunk);
    }
  }
}

export const aiApi = {
  getSettings: () => apiClient.get<ApiResponse<AISettings>>("/ai/settings").then(data),
  updateSettings: (body: UpdateAISettingsRequest) =>
    apiClient.patch<ApiResponse<AISettings>>("/ai/settings", body).then(data),
  getUsage: () => apiClient.get<ApiResponse<AIUsage>>("/ai/usage").then(data),

  generate: (body: AIGenerateRequest) =>
    apiClient.post<ApiResponse<AIGenerateResponse>>("/ai/generate", body).then(data),

  briefing: () => apiClient.get<ApiResponse<AIBriefingResponse>>("/ai/briefing").then(data),

  customerBrief: (customerId: string) =>
    apiClient
      .post<ApiResponse<AIBriefingResponse>>(`/ai/customers/${customerId}/brief`)
      .then(data),

  explainPnL: (params: { from?: string; to?: string }) =>
    apiClient
      .get<ApiResponse<AIBriefingResponse>>("/ai/accounts/explain-pnl", { params })
      .then(data),

  draftStream: (body: AIDraftRequest, handlers: DraftStreamHandlers, signal?: AbortSignal) =>
    aiStreamRequest("/ai/draft", body, handlers, signal),

  chatStream: (body: AIChatRequest, handlers: DraftStreamHandlers, signal?: AbortSignal) =>
    aiStreamRequest("/ai/chat", body, handlers, signal),
};

// ─── Error helper ─────────────────────────────────────────────────────────────

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return (
      (error.response?.data as { error?: string })?.error ??
      error.message ??
      "Something went wrong"
    );
  }
  return "Something went wrong";
}
