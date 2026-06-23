import { redirect } from "next/navigation";

export default function SecuritySettingsRedirectPage() {
  redirect("/account?tab=security");
}
