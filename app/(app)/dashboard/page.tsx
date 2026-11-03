import { auth } from '@/auth';
import { getCompletions, getDeadlines } from '@/app/lib/db';
import Checklist from '@/app/ui/checklist';

// SSR: render theo từng request vì phụ thuộc người dùng đăng nhập.
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user.id;
  const [deadlines, doneIds] = await Promise.all([getDeadlines(), getCompletions(userId)]);
  const left = deadlines.filter((d) => !doneIds.includes(d.id)).length;

  return (
    <div>
      <h1 className="text-2xl font-bold">Xin chào, {session!.user.name}</h1>
      <p className="mb-6 text-gray-600">
        Đã xong {deadlines.length - left}/{deadlines.length} deadline, còn {left} việc cần làm.
      </p>
      <Checklist deadlines={deadlines} doneIds={doneIds} />
    </div>
  );
}
