import { redirect } from "next/navigation";

export default function ConfirmMailRedirect() {
  redirect("/verify-email");
}
