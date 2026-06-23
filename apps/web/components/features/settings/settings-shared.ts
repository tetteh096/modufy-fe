import { z } from "zod";
import type { Business } from "@/types/api";

export const STOREFRONT_BASE =
  `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/p`;

export const CATEGORIES = [
  "Retail",
  "Food & Beverage",
  "Fashion",
  "Beauty & Wellness",
  "Technology",
  "Healthcare",
  "Education",
  "Construction",
  "Agriculture",
  "Logistics",
  "Professional Services",
  "Entertainment",
  "Other",
];

export const COUNTRIES = [
  { code: "GH", name: "Ghana" },
  { code: "NG", name: "Nigeria" },
  { code: "KE", name: "Kenya" },
  { code: "ZA", name: "South Africa" },
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
];

export const BRAND_COLOR_PRESETS = [
  { hex: "#1E40AF", name: "Navy" },
  { hex: "#16a34a", name: "Forest" },
  { hex: "#2563eb", name: "Indigo" },
  { hex: "#7c3aed", name: "Violet" },
  { hex: "#d97706", name: "Amber" },
  { hex: "#dc2626", name: "Red" },
  { hex: "#db2777", name: "Pink" },
  { hex: "#0891b2", name: "Teal" },
  { hex: "#374151", name: "Slate" },
] as const;

export const businessProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  tagline: z.string().optional(),
  category: z.string().optional(),
  country: z.string().length(2, "Select a country"),
  city: z.string().optional(),
  area: z.string().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  website: z.string().optional(),
});

export const storefrontSchema = z.object({
  slug: z
    .string()
    .min(3, "URL must be at least 3 characters")
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
});

export const brandingSchema = z.object({
  brand_color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Use a hex colour like #1E40AF")
    .optional()
    .or(z.literal("")),
});

export const taxSchema = z.object({
  vat_registered: z.boolean(),
  tax_id: z.string().optional(),
});

export const fullBusinessSchema = businessProfileSchema
  .merge(storefrontSchema)
  .merge(brandingSchema)
  .merge(taxSchema);

export type BusinessProfileForm = z.infer<typeof businessProfileSchema>;
export type StorefrontForm = z.infer<typeof storefrontSchema>;
export type BrandingForm = z.infer<typeof brandingSchema>;
export type TaxForm = z.infer<typeof taxSchema>;

export function businessToProfile(b: Business): BusinessProfileForm {
  return {
    name: b.name,
    tagline: b.tagline ?? "",
    category: b.category ?? "",
    country: b.country,
    city: b.city ?? "",
    area: b.area ?? "",
    latitude: b.latitude ?? null,
    longitude: b.longitude ?? null,
    phone: b.phone ?? "",
    whatsapp: b.whatsapp ?? "",
    email: b.email ?? "",
    website: b.website ?? "",
  };
}

export function businessToStorefront(b: Business): StorefrontForm {
  return { slug: b.slug };
}

export function businessToBranding(b: Business): BrandingForm {
  return { brand_color: b.brand_color ?? "#1E40AF" };
}

export function businessToTax(b: Business): TaxForm {
  return {
    vat_registered: b.vat_registered,
    tax_id: b.tax_id ?? "",
  };
}
