import { redirect } from "next/navigation";

export default function MarketplaceOrdersRedirectPage() {
  redirect("/orders?tab=products");
}
