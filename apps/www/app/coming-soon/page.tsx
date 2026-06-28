import type { Metadata } from "next";
import { ComingSoonContent } from "@/components/marketing/coming-soon-content";

export const metadata: Metadata = {
  title: "Coming Soon",
  description: "Something great is coming soon from Modufy.",
};

export default function ComingSoonPage() {
  return <ComingSoonContent />;
}
