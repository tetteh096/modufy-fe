"use client";

import { use } from "react";
import { TeamMemberDetailView } from "@/components/features/team/team-member-detail-view";

export default function TeamMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <TeamMemberDetailView memberId={id} />;
}
