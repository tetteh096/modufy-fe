"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  Banknote,
  FileText,
  UserCircle,
  Hash,
} from "lucide-react";
import { customersApi, getApiErrorMessage } from "@/lib/api";
import { useEnabledCurrencies } from "@/hooks/use-enabled-currencies";
import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Customer, CustomerType } from "@/types/api";

const schema = z
  .object({
    customer_type: z.enum(["individual", "company"]),
    name: z.string().min(1, "Name is required").max(255),
    contact_name: z.string().max(255).optional(),
    tax_id: z.string().max(50).optional(),
    phone: z.string().optional(),
    email: z.union([z.literal(""), z.string().email("Invalid email")]).optional(),
    address: z.string().optional(),
    notes: z.string().optional(),
    preferred_currency: z.string().length(3),
  })
  .superRefine((data, ctx) => {
    if (data.customer_type === "company" && !data.contact_name?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Add a contact person for this company",
        path: ["contact_name"],
      });
    }
  });

type FormValues = z.infer<typeof schema>;

type CustomerFormProps = {
  customer?: Customer;
};

export function CustomerForm({ customer }: CustomerFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { currencies, defaultCurrency } = useEnabledCurrencies();
  const isEdit = !!customer;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      customer_type: "individual",
      name: "",
      contact_name: "",
      tax_id: "",
      phone: "",
      email: "",
      address: "",
      notes: "",
      preferred_currency: "GHS",
    },
  });

  const customerType = watch("customer_type");
  const currency = watch("preferred_currency");

  useEffect(() => {
    if (customer) {
      reset({
        customer_type: (customer.customer_type ?? "individual") as CustomerType,
        name: customer.name,
        contact_name: customer.contact_name ?? "",
        tax_id: customer.tax_id ?? "",
        phone: customer.phone ?? "",
        email: customer.email ?? "",
        address: customer.address ?? "",
        notes: customer.notes ?? "",
        preferred_currency: customer.preferred_currency || defaultCurrency || "GHS",
      });
    } else if (defaultCurrency) {
      setValue("preferred_currency", defaultCurrency);
    }
  }, [customer, defaultCurrency, reset, setValue]);

  const createMutation = useMutation({
    mutationFn: customersApi.create,
    onSuccess: (created) => {
      toast.success("Customer added");
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["customers", "picker"] });
      router.push(`/customers/${created.id}`);
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const updateMutation = useMutation({
    mutationFn: (body: Parameters<typeof customersApi.update>[1]) =>
      customersApi.update(customer!.id, body),
    onSuccess: () => {
      toast.success("Customer updated");
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["customer", customer!.id] });
      router.push(`/customers/${customer!.id}`);
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  function onSubmit(data: FormValues) {
    if (!currencies.includes(data.preferred_currency)) {
      toast.error("Choose a currency enabled in Settings → Currency");
      return;
    }
    const body = {
      customer_type: data.customer_type,
      name: data.name.trim(),
      contact_name:
        data.customer_type === "company" ? data.contact_name?.trim() : undefined,
      tax_id: data.tax_id?.trim() || undefined,
      phone: data.phone?.trim() || undefined,
      email: data.email?.trim() || undefined,
      address: data.address?.trim() || undefined,
      notes: data.notes?.trim() || undefined,
      preferred_currency: data.preferred_currency,
    };
    if (isEdit) updateMutation.mutate(body);
    else createMutation.mutate(body);
  }

  const pending = isSubmitting || createMutation.isPending || updateMutation.isPending;
  const isCompany = customerType === "company";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Tabs
        value={customerType}
        onValueChange={(v) => setValue("customer_type", v as CustomerType)}
      >
        <TabsList className="w-full sm:w-auto grid grid-cols-2">
          <TabsTrigger value="individual" className="gap-1.5">
            <User className="h-3.5 w-3.5" />
            Individual
          </TabsTrigger>
          <TabsTrigger value="company" className="gap-1.5">
            <Building2 className="h-3.5 w-3.5" />
            Company
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="shadow-sm border-border/80">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            {isCompany ? (
              <Building2 className="h-5 w-5 text-primary" />
            ) : (
              <User className="h-5 w-5 text-primary" />
            )}
            {isCompany ? "Company details" : "Personal details"}
          </CardTitle>
          <CardDescription>
            {isCompany
              ? "Legal or trading name on invoices. Add who you usually speak with."
              : "Person you sell to or invoice — walk-in customers can stay anonymous on sales."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              {isCompany ? "Company name *" : "Full name *"}
            </Label>
            <Input
              id="name"
              placeholder={
                isCompany ? "e.g. Kofi & Sons Ltd, Acme Trading" : "e.g. Ama Mensah"
              }
              className="h-11"
              autoFocus
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {isCompany && (
            <>
              <div className="space-y-2">
                <Label
                  htmlFor="contact_name"
                  className="flex items-center gap-1.5 text-sm font-medium"
                >
                  <UserCircle className="h-3.5 w-3.5 text-muted-foreground" />
                  Contact person *
                </Label>
                <Input
                  id="contact_name"
                  placeholder="e.g. Kofi Mensah — who you call or email"
                  className="h-10"
                  {...register("contact_name")}
                />
                {errors.contact_name && (
                  <p className="text-xs text-destructive">
                    {errors.contact_name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="tax_id"
                  className="flex items-center gap-1.5 text-sm"
                >
                  <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                  Tax / registration number
                </Label>
                <Input
                  id="tax_id"
                  placeholder="TIN, VAT, or company reg. no. — optional"
                  className="h-10"
                  {...register("tax_id")}
                />
              </div>
            </>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-1.5 text-sm">
                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                {isCompany ? "Contact phone" : "Phone"}
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+233 24 000 0000"
                className="h-10"
                {...register("phone")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-1.5 text-sm">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                {isCompany ? "Contact email" : "Email"}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="h-10"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-1.5 text-sm">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              {isCompany ? "Business address" : "Address"}
            </Label>
            <Input
              id="address"
              placeholder="Shop, office, or area — optional"
              className="h-10"
              {...register("address")}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-border/80">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Banknote className="h-4 w-4 text-primary" />
            Billing preferences
          </CardTitle>
          <CardDescription>
            Currency for invoices and balance on this customer&apos;s account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-w-[200px]">
            <Label className="text-sm">Preferred currency</Label>
            <Select
              value={currency}
              onValueChange={(v) => v && setValue("preferred_currency", v)}
            >
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-border/80">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            Internal notes
          </CardTitle>
          <CardDescription>Only visible to your team.</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            id="notes"
            placeholder="Payment terms, delivery notes, account manager…"
            rows={3}
            className="resize-none"
            {...register("notes")}
          />
        </CardContent>
      </Card>

      <div
        className={cn(
          "sticky bottom-0 z-10 rounded-xl border bg-background/95 p-4 shadow-lg backdrop-blur-md",
          "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end"
        )}
      >
        <Button
          nativeButton={false}
          render={<Link href={isEdit ? `/customers/${customer!.id}` : "/customers"} />}
          type="button"
          variant="outline"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={pending} className="min-w-[140px]">
          {pending && <Spinner className="mr-2 h-4 w-4" />}
          {isEdit ? "Save changes" : "Save customer"}
        </Button>
      </div>
    </form>
  );
}
