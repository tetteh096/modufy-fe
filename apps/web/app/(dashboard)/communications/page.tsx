import { PageHeader } from "@/components/shared/page-header";
import { CommunicationsInbox } from "@/components/features/communications/communications-inbox";

export default function CommunicationsPage() {
  return (
    <div className="w-full space-y-5">
      <PageHeader
        title="Messages"
        description="Send SMS and email to customers. Automated order and reminder messages appear in your outbox."
      />
      <CommunicationsInbox className="h-[calc(100vh-10rem)] min-h-[640px]" />
    </div>
  );
}
