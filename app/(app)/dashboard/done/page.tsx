import { auth } from '@/auth';
import { getCompletions, getDeadlines } from '@/app/lib/db';
import Checklist from '@/app/ui/checklist';

export const dynamic = 'force-dynamic';

export default async function DonePage() {
  const session = await auth();
  const [deadlines, doneIds] = await Promise.all([getDeadlines(), getCompletions(session!.user.id)]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Đã hoàn thành</h1>
      <Checklist deadlines={deadlines.filter((d) => doneIds.includes(d.id))} doneIds={doneIds} />
    </div>
  );
}
