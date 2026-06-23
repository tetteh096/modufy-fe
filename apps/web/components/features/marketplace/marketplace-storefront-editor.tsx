"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ExternalLink,
  Copy,
  Check,
  Eye,
  EyeOff,
  ImageIcon,
  ShoppingBag,
  Star,
  Package,
  MessageSquare,
  ArrowRight,
  Tag,
  Ticket,
  Briefcase,
} from "lucide-react";
import { businessApi, marketplaceApi, getApiErrorMessage } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { UpdateStorefrontProfileRequest } from "@/types/api";
import {
  ACCENT_PRESETS,
  SITE_BASE,
  profileToDraft,
} from "./marketplace-storefront-shared";
import { buildChangedPayload, getDraftChanges } from "./storefront-editor-changes";
import {
  CurrentBlock,
  EditField,
  EditToggle,
  SectionNav,
  type EditorSection,
} from "./storefront-editor-parts";
import { MarketplaceDeliverySettingsEditor } from "./marketplace-delivery-settings-editor";
import { normalizeDeliverySettings } from "@/lib/storefront-delivery";

const SECTIONS: EditorSection[] = [
  { id: "link", label: "Your link", short: "Publish & share" },
  { id: "header", label: "Top bar", short: "Name & colour" },
  { id: "hero", label: "Homepage hero", short: "Big banner" },
  { id: "about", label: "About", short: "Story text" },
  { id: "pages", label: "Pages", short: "Shop & services" },
  { id: "menu", label: "Menu labels", short: "Nav wording" },
  { id: "contact", label: "Contact", short: "What to show" },
  { id: "delivery", label: "Checkout & delivery", short: "Fees & payment" },
  { id: "footer", label: "Footer", short: "Text & social" },
  { id: "catalog", label: "Products & photos", short: "Inventory & gallery" },
];

const CATALOG_LINKS = [
  { href: "/marketplace/deals", icon: Tag, label: "Deals & promotions" },
  { href: "/marketplace/coupons", icon: Ticket, label: "Checkout coupons" },
  { href: "/marketplace/products", icon: ShoppingBag, label: "Products on storefront" },
  { href: "/marketplace/work", icon: Briefcase, label: "Work / portfolio projects" },
  { href: "/marketplace/portfolio", icon: ImageIcon, label: "Site photos (hero & banners)" },
  { href: "/orders", icon: Package, label: "Customer orders" },
  { href: "/marketplace/enquiries", icon: MessageSquare, label: "Contact enquiries" },
  { href: "/marketplace/reviews", icon: Star, label: "Reviews" },
] as const;

function val(v?: string | null) {
  return v?.trim() || "—";
}

function onOff(v?: boolean) {
  return v ? "On" : "Off";
}

export function MarketplaceStorefrontEditor() {
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);
  const [section, setSection] = useState("link");
  const [draft, setDraft] = useState<UpdateStorefrontProfileRequest>({});
  const [saved, setSaved] = useState<UpdateStorefrontProfileRequest>({});

  const { data: profile, isLoading } = useQuery({
    queryKey: ["marketplace-profile"],
    queryFn: marketplaceApi.profile.get,
  });

  const { data: business } = useQuery({
    queryKey: ["business"],
    queryFn: businessApi.get,
  });

  useEffect(() => {
    if (!profile) return;
    const snap = profileToDraft(profile);
    const wa = snap.whatsapp?.trim() || business?.whatsapp?.trim();
    if (wa) snap.whatsapp = wa;
    setDraft(snap);
    setSaved(snap);
  }, [profile, business]);

  const updateMutation = useMutation({
    mutationFn: (body: UpdateStorefrontProfileRequest) => marketplaceApi.profile.update(body),
    onSuccess: (data) => {
      const snap = profileToDraft(data);
      setSaved(snap);
      setDraft(snap);
      queryClient.setQueryData(["marketplace-profile"], data);
      queryClient.invalidateQueries({ queryKey: ["business"] });
      toast.success("Storefront updated");
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const publishMutation = useMutation({
    mutationFn: marketplaceApi.profile.togglePublish,
    onSuccess: (p) => {
      queryClient.invalidateQueries({ queryKey: ["marketplace-profile"] });
      toast.success(p.is_public ? "Storefront is live" : "Storefront hidden");
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const storefrontURL = profile ? `${SITE_BASE}/p/${profile.business_slug}` : "";
  const changes = getDraftChanges(saved, draft);
  const saving = updateMutation.isPending;

  function patch(p: Partial<UpdateStorefrontProfileRequest>) {
    setDraft((d) => ({ ...d, ...p }));
  }

  function discard() {
    setDraft(saved);
    toast.message("Changes discarded");
  }

  function copyLink() {
    navigator.clipboard.writeText(storefrontURL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (isLoading || !profile) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="pb-28">
      <div className="grid gap-6 lg:grid-cols-[13.5rem_minmax(0,1fr)]">
        <SectionNav sections={SECTIONS} active={section} onSelect={setSection} />

        <div className="min-w-0 space-y-4">
          {section === "link" && (
            <SectionPanel title="Your link">
              <CurrentBlock
                items={[
                  { label: "Status", value: profile.is_public ? "Live" : "Hidden" },
                  { label: "Views", value: String(profile.view_count) },
                  { label: "URL", value: storefrontURL },
                ]}
              />
              <div className="flex flex-wrap gap-2">
                <Input value={storefrontURL} readOnly className="font-mono text-xs flex-1 min-w-[14rem]" />
                <Button variant="outline" size="sm" onClick={copyLink}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                {profile.is_public ? (
                  <a href={storefrontURL} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="mr-1 h-3.5 w-3.5" />
                      View
                    </Button>
                  </a>
                ) : null}
              </div>
              <Button
                variant={profile.is_public ? "destructive" : "default"}
                size="sm"
                onClick={() => publishMutation.mutate()}
                disabled={publishMutation.isPending}
              >
                {profile.is_public ? (
                  <>
                    <EyeOff className="mr-1.5 h-4 w-4" />
                    Hide storefront
                  </>
                ) : (
                  <>
                    <Eye className="mr-1.5 h-4 w-4" />
                    Publish storefront
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground">
                Slug URL:{" "}
                <Link href="/settings/storefront" className="text-primary underline">
                  Settings → Storefront
                </Link>
              </p>
            </SectionPanel>
          )}

          {section === "header" && (
            <SectionPanel title="Top bar">
              <CurrentBlock
                items={[
                  { label: "Header name", value: val(saved.header_text) },
                  {
                    label: "Theme colour",
                    value: val(saved.accent_color),
                    highlight: saved.accent_color,
                  },
                ]}
              />
              <div className="space-y-3 rounded-xl border p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Change to
                </p>
                <EditField
                  label="Header name"
                  value={draft.header_text ?? ""}
                  onChange={(v) => patch({ header_text: v })}
                  placeholder="new stores"
                />
                <div className="space-y-2">
                  <EditField
                    label="Theme colour"
                    value={draft.accent_color ?? "#16a34a"}
                    onChange={(v) => patch({ accent_color: v })}
                    placeholder="#16a34a"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {ACCENT_PRESETS.map(({ hex, name }) => (
                      <button
                        key={hex}
                        type="button"
                        title={name}
                        onClick={() => patch({ accent_color: hex })}
                        className="h-7 w-7 rounded-full border-2"
                        style={{
                          background: hex,
                          borderColor: draft.accent_color === hex ? "#1f2937" : "transparent",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </SectionPanel>
          )}

          {section === "hero" && (
            <SectionPanel title="Homepage hero">
              <CurrentBlock
                items={[
                  { label: "Headline", value: val(saved.hero_headline) },
                  { label: "Subheadline", value: val(saved.hero_subheadline) },
                  { label: "Promo", value: val(saved.promo_banner) },
                ]}
              />
              <div className="space-y-3 rounded-xl border p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Change to
                </p>
                <EditField
                  label="Headline"
                  value={draft.hero_headline ?? ""}
                  onChange={(v) => patch({ hero_headline: v })}
                  placeholder="Welcome to our shop"
                />
                <EditField
                  label="Subheadline"
                  value={draft.hero_subheadline ?? ""}
                  onChange={(v) => patch({ hero_subheadline: v })}
                  placeholder="Curated essentials for you"
                />
                <EditField
                  label="Promo badge (optional)"
                  value={draft.promo_banner ?? ""}
                  onChange={(v) => patch({ promo_banner: v })}
                  placeholder="Free delivery this week"
                />
              </div>
              <Link
                href="/marketplace/portfolio"
                className="flex items-center gap-2 text-sm text-primary font-medium hover:underline"
              >
                <ImageIcon className="h-4 w-4" />
                Hero images come from Portfolio — upload photos
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </SectionPanel>
          )}

          {section === "about" && (
            <SectionPanel title="About">
              <CurrentBlock items={[{ label: "About text", value: val(saved.bio) }]} />
              <div className="rounded-xl border p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Change to
                </p>
                <EditField
                  label="About your business"
                  value={draft.bio ?? ""}
                  onChange={(v) => patch({ bio: v })}
                  placeholder="What you sell and why customers choose you"
                  multiline
                />
              </div>
            </SectionPanel>
          )}

          {section === "pages" && (
            <SectionPanel title="Pages">
              <CurrentBlock
                items={[
                  { label: "Products / shop", value: onOff(saved.show_products) },
                  { label: "Services / bookings", value: onOff(saved.show_services) },
                  { label: "Deals section", value: onOff(saved.show_deals_section) },
                  { label: "Work / portfolio", value: onOff(saved.show_work) },
                ]}
              />
              <div className="space-y-2 rounded-xl border p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Change to
                </p>
                <EditToggle
                  label="Products (shop, cart, checkout)"
                  checked={draft.show_products ?? true}
                  onChange={(v) => patch({ show_products: v })}
                />
                <EditToggle
                  label="Services (bookings)"
                  checked={draft.show_services ?? true}
                  onChange={(v) => patch({ show_services: v })}
                />
                <EditToggle
                  label="Deals section on homepage"
                  checked={draft.show_deals_section ?? false}
                  onChange={(v) => patch({ show_deals_section: v })}
                />
                <EditToggle
                  label="Portfolio page"
                  checked={draft.show_work ?? false}
                  onChange={(v) => patch({ show_work: v })}
                />
                <EditField
                  label="Portfolio page menu label"
                  value={draft.nav_work_label ?? ""}
                  onChange={(v) => patch({ nav_work_label: v })}
                  placeholder="Portfolio"
                />
                <EditField
                  label="Portfolio page intro"
                  value={draft.work_intro ?? ""}
                  onChange={(v) => patch({ work_intro: v })}
                  placeholder="A short welcome shown at the top of your portfolio page, e.g. A selection of our favourite shoots and projects."
                  multiline
                />
                <p className="text-xs text-muted-foreground">
                  Showcase completed projects (photography, design, agency work). Add projects under{" "}
                  <Link href="/marketplace/work" className="text-primary font-medium underline">
                    Marketplace → Portfolio
                  </Link>
                  , then save this toggle. <em>Photos</em> is only for homepage hero/banners — not the portfolio page.
                </p>
                <div className="mt-3 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground space-y-2">
                  <p>
                    <strong className="text-foreground">Manage services</strong> in Inventory — add
                    name, price, duration, photo, and turn on <em>Show on storefront</em>. Bookings
                    use the Appointments module.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href="/inventory/services"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      Inventory → Services
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                    <Link
                      href="/appointments"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      Appointments calendar
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                    <Link
                      href="/appointments/schedule"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      Set open hours (for time slots)
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </SectionPanel>
          )}

          {section === "menu" && (
            <SectionPanel title="Menu labels">
              <CurrentBlock
                items={[
                  { label: "Home", value: val(saved.nav_home_label) },
                  { label: "Shop", value: val(saved.nav_shop_label) },
                  { label: "Cart", value: val(saved.nav_cart_label) },
                  { label: "Contact", value: val(saved.nav_contact_label) },
                  { label: "Portfolio", value: val(saved.nav_work_label) },
                ]}
              />
              <div className="grid gap-3 sm:grid-cols-2 rounded-xl border p-4">
                <p className="sm:col-span-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Change to (blank = default)
                </p>
                {(
                  [
                    ["nav_home_label", "Home"],
                    ["nav_shop_label", "Shop"],
                    ["nav_services_label", "Services"],
                    ["nav_cart_label", "Cart"],
                    ["nav_contact_label", "Contact"],
                    ["nav_work_label", "Portfolio"],
                  ] as const
                ).map(([key, ph]) => (
                  <EditField
                    key={key}
                    label={ph}
                    value={(draft as Record<string, string | undefined>)[key] ?? ""}
                    onChange={(v) => patch({ [key]: v })}
                    placeholder={ph}
                  />
                ))}
              </div>
            </SectionPanel>
          )}

          {section === "contact" && (
            <SectionPanel title="Contact">
              <CurrentBlock
                items={[
                  { label: "Phone", value: onOff(saved.show_phone) },
                  { label: "Email", value: onOff(saved.show_email) },
                  { label: "WhatsApp button", value: onOff(saved.show_whatsapp) },
                  { label: "WhatsApp number", value: val(saved.whatsapp) },
                  { label: "Opening hours banner", value: onOff(saved.show_hours) },
                ]}
              />
              <div className="space-y-2 rounded-xl border p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Change to
                </p>
                <EditField
                  label="WhatsApp number"
                  value={draft.whatsapp ?? ""}
                  onChange={(v) => patch({ whatsapp: v })}
                  placeholder="e.g. 233241234567"
                />
                <p className="text-xs text-muted-foreground -mt-1">
                  Include country code without +. Customers tap the green WhatsApp icon on your site to message you.
                </p>
                <EditToggle
                  label="Show WhatsApp button on storefront"
                  checked={draft.show_whatsapp ?? true}
                  onChange={(v) => patch({ show_whatsapp: v })}
                />
                <EditToggle
                  label="Show phone on contact page"
                  checked={draft.show_phone ?? true}
                  onChange={(v) => patch({ show_phone: v })}
                />
                <EditToggle
                  label="Show email on contact page"
                  checked={draft.show_email ?? false}
                  onChange={(v) => patch({ show_email: v })}
                />
                <EditToggle
                  label="Show opening hours banner"
                  sub="Managed in Settings → Business hours (banner and weekly schedule)"
                  checked={draft.show_hours ?? false}
                  onChange={(v) => patch({ show_hours: v })}
                />
              </div>
              <Card>
                <CardContent className="pt-4 text-sm text-muted-foreground">
                  Phone, email & map pin can also be updated in{" "}
                  <Link href="/settings/general" className="text-primary font-medium underline">
                    Settings → General
                  </Link>
                  . The floating WhatsApp icon appears on every page when a number is set and the button is on.
                </CardContent>
              </Card>
            </SectionPanel>
          )}

          {section === "delivery" && (
            <SectionPanel title="Checkout & delivery">
              <CurrentBlock
                items={[
                  { label: "Delivery", value: onOff(draft.delivery_settings?.enabled ?? true) },
                  { label: "Pay on delivery", value: onOff(draft.delivery_settings?.allow_pay_on_delivery ?? true) },
                  { label: "Options", value: String(draft.delivery_settings?.rules?.length ?? 0) },
                ]}
              />
              <MarketplaceDeliverySettingsEditor
                value={normalizeDeliverySettings(draft.delivery_settings)}
                onChange={(delivery_settings) => patch({ delivery_settings })}
              />
            </SectionPanel>
          )}

          {section === "footer" && (
            <SectionPanel title="Footer">
              <CurrentBlock
                items={[
                  { label: "Footer text", value: val(saved.footer_text) },
                  { label: "Instagram", value: val(saved.social_instagram) },
                  { label: "Facebook", value: val(saved.social_facebook) },
                ]}
              />
              <div className="space-y-3 rounded-xl border p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Change to
                </p>
                <EditField
                  label="Footer text"
                  value={draft.footer_text ?? ""}
                  onChange={(v) => patch({ footer_text: v })}
                  placeholder="© 2026 Your business"
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  {(
                    [
                      ["social_instagram", "Instagram"],
                      ["social_facebook", "Facebook"],
                      ["social_twitter", "X"],
                      ["social_tiktok", "TikTok"],
                    ] as const
                  ).map(([key, label]) => (
                    <EditField
                      key={key}
                      label={label}
                      value={(draft as Record<string, string | undefined>)[key] ?? ""}
                      onChange={(v) => patch({ [key]: v })}
                      placeholder="https://"
                    />
                  ))}
                </div>
              </div>
            </SectionPanel>
          )}

          {section === "catalog" && (
            <SectionPanel title="Products & photos">
              <CurrentBlock
                items={[
                  { label: "Products page", value: onOff(profile.show_products) },
                  { label: "Reviews", value: `${profile.review_count} on storefront` },
                ]}
              />
              <div className="grid gap-2 sm:grid-cols-2">
                {CATALOG_LINKS.map(({ href, icon: Icon, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-3 rounded-xl border p-4 hover:bg-muted/50 transition-colors"
                  >
                    <Icon className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-sm font-medium flex-1">{label}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </SectionPanel>
          )}
        </div>
      </div>

      <StickySaveBar
        changes={changes}
        saving={saving}
        isLive={profile.is_public}
        storefrontURL={storefrontURL}
        onSave={() => updateMutation.mutate(buildChangedPayload(draft, changes))}
        onDiscard={discard}
      />
    </div>
  );
}

function SectionPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

function StickySaveBar({
  changes,
  saving,
  isLive,
  storefrontURL,
  onSave,
  onDiscard,
}: {
  changes: ReturnType<typeof getDraftChanges>;
  saving: boolean;
  isLive: boolean;
  storefrontURL: string;
  onSave: () => void;
  onDiscard: () => void;
}) {
  const hasChanges = changes.length > 0;

  return (
    <div
      data-slot="dashboard-fixed-footer"
      className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90"
    >
      <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            {hasChanges ? (
              <>
                <p className="text-xs font-semibold text-foreground mb-1.5">
                  {changes.length} change{changes.length !== 1 ? "s" : ""} ready to save
                </p>
                <ul className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto">
                  {changes.map((c) => (
                    <li key={c.key}>
                      <Badge variant="secondary" className="text-[10px] font-normal gap-1 py-0.5">
                        <span className="text-muted-foreground">{c.label}:</span>
                        <span className="line-through opacity-60">{c.from}</span>
                        <span>→</span>
                        <span className="font-semibold">{c.to}</span>
                      </Badge>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
                <span className="inline-flex h-2 w-2 rounded-full bg-green-500" />
                All saved
                {isLive ? (
                  <a
                    href={storefrontURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-xs font-medium hover:underline inline-flex items-center gap-1"
                  >
                    View live storefront
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : null}
              </p>
            )}
          </div>
          <div className="flex shrink-0 gap-2">
            {hasChanges ? (
              <>
                <Button variant="outline" size="sm" onClick={onDiscard} disabled={saving}>
                  Discard
                </Button>
                <Button size="sm" onClick={onSave} disabled={saving}>
                  {saving ? "Saving…" : `Save ${changes.length} change${changes.length !== 1 ? "s" : ""}`}
                </Button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
