import { ModuleFullBleedHero } from "@/components/modules/module-fullbleed-hero";
import {
  AccountsAutopostSection,
  AccountsCloseSection,
  AccountsFeaturesGrid,
  AccountsReportsSection,
  AccountsSourceStrip,
} from "@/components/modules/accounts/accounts-visual-sections";
import { moduleHeroImages } from "@/lib/module-heroes";

export function AccountsPage() {
  return (
    <>
      <ModuleFullBleedHero
        breadcrumb="Accounting & Finance"
        eyebrow="Paid module"
        title="Books that"
        titleAccent="update themselves."
        description="Sales, invoice payments, expenses, and stock movements can post to your ledger automatically. P&L and cash flow without re-keying."
        image={moduleHeroImages.accounts}
        imageAlt="Accounting and finance reports"
      />
      <AccountsSourceStrip />
      <AccountsAutopostSection />
      <AccountsReportsSection />
      <AccountsFeaturesGrid />
      <AccountsCloseSection />
    </>
  );
}
