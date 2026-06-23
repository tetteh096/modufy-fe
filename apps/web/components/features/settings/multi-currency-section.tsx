"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Coins, Sparkles } from "lucide-react";
import { businessApi, getApiErrorMessage } from "@/lib/api";
import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SettingsSection } from "@/components/features/settings/settings-section";
import { SettingsField } from "@/components/features/settings/settings-field";
import { SettingsStickyFooter } from "@/components/features/settings/settings-sticky-footer";
import type { Business, BusinessCurrencySetting } from "@/types/api";
import { cn } from "@/lib/utils";

const CURRENCY_CODES = ["GHS", "NGN", "USD", "EUR", "GBP", "KES", "ZAR"] as const;

interface MultiCurrencySectionProps {
  defaultCurrency: string;
  displayMode: "default" | "transaction";
  exchangeMode: "auto" | "manual";
  currencies: BusinessCurrencySetting[];
  onDefaultCurrencyChange?: (code: string) => void;
}

function currencyLabel(c: BusinessCurrencySetting | undefined, code: string) {
  if (c) return `${c.code} · ${c.symbol} ${c.name}`;
  return code;
}

function CurrencyToggleRow({
  currency,
  isDefault,
  onToggle,
}: {
  currency: BusinessCurrencySetting;
  isDefault: boolean;
  onToggle: (enabled: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={currency.enabled}
      onClick={() => onToggle(!currency.enabled)}
      className={cn(
        "flex w-full items-center justify-between gap-4 rounded-xl border px-4 py-3 text-left transition-all",
        currency.enabled
          ? "border-primary/30 bg-primary/[0.03]"
          : "border-border/70 bg-muted/10 hover:border-border hover:bg-muted/20",
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-background text-sm font-semibold">
          {currency.symbol}
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium">{currency.code}</p>
            {isDefault && (
              <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                Default
              </Badge>
            )}
          </div>
          <p className="truncate text-xs text-muted-foreground">{currency.name}</p>
        </div>
      </div>
      <span
        aria-hidden
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 rounded-full border transition-colors",
          currency.enabled ? "border-primary/40 bg-primary" : "border-border/80 bg-muted",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-5 rounded-full bg-background shadow-sm transition-transform",
            currency.enabled ? "translate-x-5" : "translate-x-0.5",
          )}
        />
      </span>
    </button>
  );
}

function EnabledCurrenciesPreview({
  currencies,
  baseCurrency,
}: {
  currencies: BusinessCurrencySetting[];
  baseCurrency: string;
}) {
  const enabled = currencies.filter((c) => c.enabled);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Active on sales & invoices
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {enabled.map((c) => (
          <span
            key={c.code}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
              c.code === baseCurrency
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-border/70 bg-muted/20 text-foreground",
            )}
          >
            <span>{c.symbol}</span>
            {c.code}
          </span>
        ))}
      </div>
    </div>
  );
}

export function MultiCurrencySection({
  defaultCurrency,
  displayMode,
  exchangeMode,
  currencies: initialCurrencies,
  onDefaultCurrencyChange,
}: MultiCurrencySectionProps) {
  const queryClient = useQueryClient();
  const [baseCurrency, setBaseCurrency] = useState(defaultCurrency);
  const [displayCurrencyMode, setDisplayCurrencyMode] = useState(displayMode);
  const [exchangeRateMode, setExchangeRateMode] = useState(exchangeMode);
  const [currencyToggles, setCurrencyToggles] = useState(initialCurrencies);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setBaseCurrency(defaultCurrency);
    setDisplayCurrencyMode(displayMode);
    setExchangeRateMode(exchangeMode);
    setCurrencyToggles(initialCurrencies);
    setDirty(false);
  }, [defaultCurrency, displayMode, exchangeMode, initialCurrencies]);

  const currencyByCode = useMemo(
    () => new Map(currencyToggles.map((c) => [c.code, c])),
    [currencyToggles],
  );

  const saveMutation = useMutation({
    mutationFn: businessApi.updateCurrencies,
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  function onCurrencySaved(updated: Business, message: string) {
    toast.success(message);
    queryClient.setQueryData(["business"], updated);
    queryClient.invalidateQueries({ queryKey: ["sales-summary"] });
    queryClient.invalidateQueries({ queryKey: ["sales"] });
    queryClient.invalidateQueries({ queryKey: ["expenses"] });
    setDirty(false);
  }

  function buildPayload(
    base: string,
    display: "default" | "transaction",
    exchange: "auto" | "manual",
    toggles: BusinessCurrencySetting[],
  ) {
    return {
      default_currency: base,
      display_currency_mode: display,
      exchange_rate_mode: exchange,
      currencies: toggles.map((c) => ({
        code: c.code,
        enabled: c.enabled,
      })),
    };
  }

  function saveNow(
    base: string,
    display: "default" | "transaction",
    exchange: "auto" | "manual",
    toggles: BusinessCurrencySetting[],
    message?: string,
  ) {
    saveMutation.mutate(buildPayload(base, display, exchange, toggles), {
      onSuccess: (updated) =>
        onCurrencySaved(updated, message ?? "Currency settings saved"),
    });
  }

  function toggleCurrency(code: string, enabled: boolean) {
    if (code === baseCurrency && !enabled) {
      toast.error("Your default currency must stay enabled");
      return;
    }
    setCurrencyToggles((prev) =>
      prev.map((c) => (c.code === code ? { ...c, enabled } : c)),
    );
    setDirty(true);
  }

  function discardChanges() {
    setBaseCurrency(defaultCurrency);
    setDisplayCurrencyMode(displayMode);
    setExchangeRateMode(exchangeMode);
    setCurrencyToggles(initialCurrencies);
    setDirty(false);
  }

  return (
    <div className="space-y-5">
      <SettingsSection
        title="Multi-currency"
        icon={Coins}
        description="Accept payments in other currencies and control how amounts are displayed"
      >
        <div className="rounded-xl border border-border/70 bg-muted/15 px-4 py-3">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Your default currency powers the dashboard, new sales, and customer forms.
            <span className="font-medium text-foreground"> Changing the default saves immediately.</span>{" "}
            Display and accepted-currency options use Save changes below. Cross-currency conversion
            uses an exchange rate of <span className="font-medium text-foreground">1.0</span> until
            manual or automatic rates are wired up on sales and invoices.
          </p>
        </div>

        <SettingsField
          label="Default / base currency"
          hint="Primary currency for reporting and converted totals"
        >
          <Select
            value={baseCurrency}
            onValueChange={(v) => {
              if (!v) return;
              const nextToggles = currencyToggles.map((c) =>
                c.code === v ? { ...c, enabled: true } : c,
              );
              setBaseCurrency(v);
              onDefaultCurrencyChange?.(v);
              setCurrencyToggles(nextToggles);
              setDirty(false);
              saveNow(
                v,
                displayCurrencyMode,
                exchangeRateMode,
                nextToggles,
                `Default currency set to ${v}`,
              );
            }}
            disabled={saveMutation.isPending}
          >
            <SelectTrigger className="h-10 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCY_CODES.map((code) => (
                <SelectItem key={code} value={code}>
                  {currencyLabel(currencyByCode.get(code), code)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SettingsField>

        <div className="grid gap-6 sm:grid-cols-2">
          <SettingsField
            label="Display totals as"
            hint="How dashboard and reports show mixed-currency amounts"
          >
            <Select
              value={displayCurrencyMode}
              onValueChange={(v) => {
                if (!v) return;
                setDisplayCurrencyMode(v as "default" | "transaction");
                setDirty(true);
              }}
            >
              <SelectTrigger className="h-10 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">
                  Always in {baseCurrency} (converted)
                </SelectItem>
                <SelectItem value="transaction">Per transaction currency</SelectItem>
              </SelectContent>
            </Select>
          </SettingsField>

          <SettingsField
            label="Exchange rates"
            hint="Manual mode is live today. Automatic daily rates are planned — not connected yet."
          >
            <Select
              value={exchangeRateMode}
              onValueChange={(v) => {
                if (!v) return;
                setExchangeRateMode(v as "auto" | "manual");
                setDirty(true);
              }}
            >
              <SelectTrigger className="h-10 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Manual per transaction (recommended for now)</SelectItem>
                <SelectItem value="auto">Automatic daily rates (coming soon)</SelectItem>
              </SelectContent>
            </Select>
          </SettingsField>
        </div>

        <SettingsField
          label="Accepted currencies"
          hint="Toggle which currencies appear on sales, expenses, and invoices"
        >
          <div className="space-y-2 rounded-xl border border-border/70 bg-muted/10 p-3 sm:p-4">
            {currencyToggles.map((c) => (
              <CurrencyToggleRow
                key={c.code}
                currency={c}
                isDefault={c.code === baseCurrency}
                onToggle={(enabled) => toggleCurrency(c.code, enabled)}
              />
            ))}
          </div>
        </SettingsField>

        <EnabledCurrenciesPreview currencies={currencyToggles} baseCurrency={baseCurrency} />
      </SettingsSection>

      <SettingsStickyFooter>
        <Button type="button" variant="outline" disabled={!dirty} onClick={discardChanges}>
          Discard
        </Button>
        <Button
          type="button"
          disabled={!dirty || saveMutation.isPending}
          onClick={() =>
            saveNow(baseCurrency, displayCurrencyMode, exchangeRateMode, currencyToggles)
          }
        >
          {saveMutation.isPending && <Spinner className="mr-2 h-4 w-4" />}
          Save changes
        </Button>
      </SettingsStickyFooter>
    </div>
  );
}
