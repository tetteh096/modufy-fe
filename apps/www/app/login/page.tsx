import { redirect } from "next/navigation";
import { appPath } from "@/lib/site-config";

export default function LoginRedirectPage() {
  redirect(appPath("/login"));
}
