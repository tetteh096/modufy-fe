import { redirect } from "next/navigation";

export default function TwoFactorRedirect() {
  redirect("/two-factor");
}
