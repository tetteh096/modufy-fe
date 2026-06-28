"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Spinner } from "@/components/shared/spinner";
import { AuthField, AuthFormReveal } from "@/components/features/auth/auth-form-fields";
import { AuthBoxReveal } from "@/components/features/auth/auth-motion";
import { apiClient, getApiErrorMessage } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/utils";

const schema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  category: z.string().min(1, "Pick a category"),
  country: z.string().min(1, "Select a country"),
  phone: z.string().optional(),
  city: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

const categories = [
  "Retail", "Food & Beverage", "Fashion", "Beauty & Wellness", "Technology",
  "Healthcare", "Education", "Construction", "Agriculture", "Logistics",
  "Professional Services", "Entertainment", "Other",
];

const countries = [
  { code: "GH", name: "Ghana", currency: "GHS" },
  { code: "NG", name: "Nigeria", currency: "NGN" },
  { code: "KE", name: "Kenya", currency: "KES" },
  { code: "ZA", name: "South Africa", currency: "ZAR" },
  { code: "GB", name: "United Kingdom", currency: "GBP" },
  { code: "US", name: "United States", currency: "USD" },
];

function currencyForCountry(code: string): string {
  return countries.find((c) => c.code === code)?.currency ?? "USD";
}

const steps = [
  { title: "Tell us about your business", description: "What it's called and what you do." },
  { title: "Where do you operate?", description: "We use this to set your currency and defaults." },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, setAuth } = useAuthStore();
  const [step, setStep] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { country: "GH", category: "" },
  });

  const category = watch("category");
  const country = watch("country");

  async function nextStep() {
    const valid = await trigger(["businessName", "category"]);
    if (valid) setStep(1);
  }

  async function onSubmit(data: FormValues) {
    try {
      await apiClient.post("/onboarding", {
        name: data.businessName,
        category: data.category,
        country: data.country,
        currency: currencyForCountry(data.country),
        phone: data.phone,
        city: data.city,
        owner_name: user?.name,
        owner_email: user?.email,
      });

      const res = await fetch("/api/auth/token");
      const { token: newToken } = await res.json() as { token: string };

      if (newToken && user) {
        setAuth(newToken, user, user.id ?? "");
      }

      toast.success("Business created! Welcome to Modufy.");
      router.push("/dashboard");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  }

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <nav className="auth-step-track" aria-label="Setup progress">
          {steps.map((s, i) => {
            const done = step > i;
            const active = step === i;
            return (
              <div
                key={s.title}
                className={cn("auth-step-pill", active && "is-active", done && "is-done")}
              >
                <span className="auth-step-dot">
                  {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </span>
                <span className="auth-step-label">{i === 0 ? "Business" : "Location"}</span>
              </div>
            );
          })}
        </nav>

        <AuthBoxReveal delay={0.04}>
          <div className="space-y-2">
            <h1 className="auth-page-title">
              {step === 0 && user?.name ? `Hey ${user.name.split(" ")[0]}! ` : ""}
              {steps[step].title}
            </h1>
            <p className="auth-page-description">{steps[step].description}</p>
          </div>
        </AuthBoxReveal>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {step === 0 ? (
          <div className="space-y-6">
            <AuthField
              id="businessName"
              label="Business name"
              placeholder="e.g. Mama Akua Stores"
              autoFocus
              revealDelay={0.1}
              error={errors.businessName?.message}
              {...register("businessName")}
            />

            <AuthFormReveal delay={0.14}>
              <div className="auth-field">
                <span className="auth-field-label">What do you do?</span>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Business category">
                  {categories.map((c) => {
                    const selected = category === c;
                    return (
                      <button
                        key={c}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => setValue("category", c, { shouldValidate: true })}
                        className={`auth-chip ${selected ? "auth-chip--selected" : ""}`}
                      >
                        {selected ? <Check className="h-3.5 w-3.5" /> : null}
                        {c}
                      </button>
                    );
                  })}
                </div>
                {errors.category ? (
                  <p className="auth-field-error">{errors.category.message}</p>
                ) : null}
              </div>
            </AuthFormReveal>

            <AuthFormReveal delay={0.22}>
              <button type="button" onClick={nextStep} className="auth-btn-primary group/btn">
                <span className="inline-flex items-center gap-2">
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </span>
              </button>
            </AuthFormReveal>
          </div>
        ) : (
          <div className="space-y-6">
            <AuthFormReveal delay={0.1}>
              <div className="auth-field">
                <label htmlFor="country" className="auth-field-label">
                  Country
                </label>
                <select
                  id="country"
                  className="auth-field-input"
                  value={country}
                  onChange={(e) => setValue("country", e.target.value)}
                >
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs auth-text-muted">
                  Your currency will be set to {currencyForCountry(country)}.
                </p>
              </div>
            </AuthFormReveal>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <AuthField
                id="phone"
                label="WhatsApp / Phone (optional)"
                type="tel"
                placeholder="+233 50 123 4567"
                revealDelay={0.14}
                error={errors.phone?.message}
                {...register("phone")}
              />
              <AuthField
                id="city"
                label="City (optional)"
                placeholder="Accra"
                revealDelay={0.18}
                error={errors.city?.message}
                {...register("city")}
              />
            </div>

            <AuthFormReveal delay={0.22}>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="auth-btn-secondary !w-auto px-4"
                  disabled={isSubmitting}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
                <button type="submit" className="auth-btn-primary group/btn flex-1" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <Spinner size="sm" className="text-white" />
                      Creating your business…
                    </span>
                  ) : (
                    "Create my business"
                  )}
                </button>
              </div>
            </AuthFormReveal>
          </div>
        )}
      </form>
    </div>
  );
}
