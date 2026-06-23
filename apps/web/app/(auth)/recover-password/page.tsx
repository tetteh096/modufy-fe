import { redirect } from "next/navigation";

export default function RecoverPasswordRedirect() {
  redirect("/forgot-password");
}
