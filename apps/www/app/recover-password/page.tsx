import { redirect } from "next/navigation";
import { appPath } from "@/lib/site-config";

export default function RecoverPasswordRedirectPage() {
  redirect(appPath("/recover-password"));
}
