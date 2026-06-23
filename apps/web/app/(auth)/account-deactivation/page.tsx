import { redirect } from "next/navigation";

export default function AccountDeactivationRedirect() {
  redirect("/deactivate");
}
