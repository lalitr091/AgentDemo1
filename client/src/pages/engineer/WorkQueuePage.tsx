import { AppLayout } from '@/components/layout/AppLayout';
import { WorkQueue } from '@/components/tickets/WorkQueue';
import { TicketDetail } from '@/components/tickets/TicketDetail';

export default function WorkQueuePage() {
  return (
    <AppLayout>
      <div className="h-full flex">
        <WorkQueue />
        <TicketDetail />
      </div>
    </AppLayout>
  );
}
