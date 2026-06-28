import { redirect } from "next/navigation";
import { appPath } from "@/lib/site-config";

export default function RegisterRedirectPage() {
  redirect(appPath("/register"));
}
