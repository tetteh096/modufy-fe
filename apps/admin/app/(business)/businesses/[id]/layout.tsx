"use client";

import { useParams } from "next/navigation";
import { BusinessWorkspaceProvider } from "@/components/features/admin/business-workspace-context";
import { BusinessWorkspaceShell } from "@/components/features/admin/business-workspace-shell";

export default function BusinessWorkspaceLayout({ children }: { children: React.ReactNode }) {
  const { id } = useParams<{ id: string }>();

  return (
    <BusinessWorkspaceProvider businessId={id}>
      <BusinessWorkspaceShell>{children}</BusinessWorkspaceShell>
    </BusinessWorkspaceProvider>
  );
}
