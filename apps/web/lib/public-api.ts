import axios from "axios";
import type { ApiResponse, AppointmentAvailability, BusinessHoursDay } from "@/types/api";

const publicClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1",
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

function data<T>(res: { data: ApiResponse<T> }) {
  return res.data.data;
}

export type CancellationPolicyPublic = {
  window_hours: number;
  late_action: string;
  fee_amount: number;
  summary: string;
  enabled: boolean;
};

export type PublicBusinessInfo = {
  name: string;
  slug: string;
  logo_url?: string;
  brand_color: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  city: string;
  hours?: BusinessHoursDay[];
  hours_enabled?: boolean;
  is_open_now?: boolean;
  cancellation_policy: CancellationPolicyPublic;
};

export type PublicServiceItem = {
  id: string;
  name: string;
  description: string;
  photo_url?: string;
  duration_mins: number;
  sell_price: number;
  currency: string;
  deposit_required: number;
};

export type PublicBookingResult = {
  appointment_id: string;
  status: string;
  deposit_required: number;
  currency: string;
  payment_url?: string;
  confirm_token?: string;
  message: string;
};

export type PublicBookingStatus = {
  status: string;
  business_name: string;
  service_name: string;
  start_time: string;
  end_time: string;
  guest_name: string;
  deposit_required: number;
  deposit_paid: number;
  currency: string;
};

export const publicBookingApi = {
  services: (slug: string) =>
    publicClient
      .get<ApiResponse<{ business: PublicBusinessInfo; services: PublicServiceItem[] }>>(
        `/public/booking/${slug}/services`
      )
      .then(data),
  availability: (slug: string, date: string, serviceId: string) =>
    publicClient
      .get<ApiResponse<AppointmentAvailability>>(`/public/booking/${slug}/availability`, {
        params: { date, service: serviceId },
      })
      .then(data),
  book: (
    slug: string,
    body: {
      service_id: string;
      start_time: string;
      guest_name: string;
      guest_phone: string;
      notes?: string;
      policy_accepted?: boolean;
    }
  ) =>
    publicClient
      .post<ApiResponse<PublicBookingResult>>(`/public/booking/${slug}`, body)
      .then(data),
  confirm: (token: string) =>
    publicClient
      .get<ApiResponse<PublicBookingStatus>>(`/public/booking/confirm/${token}`)
      .then(data),
};
