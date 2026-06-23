import { redirect } from "next/navigation";

export default function CreatePasswordRedirect() {
  redirect("/reset-password");
}
