import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { can } from '@/app/lib/permissions';
import { deleteDeadlineAction } from '@/app/lib/actions';
import { getDeadlines, getSubjects } from '@/app/lib/db';
import { formatDateTime } from '@/app/lib/utils';
import AddDeadlineForm from '@/app/ui/add-deadline-form';

// SSR + tự kiểm tra quyền (không tin hoàn toàn vào proxy).
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Quản trị',
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect('/login?callbackUrl=%2Fadmin');
  if (!can(session.user.role, 'add')) redirect('/403');

  const [deadlines, subjects] = await Promise.all([getDeadlines(), getSubjects()]);

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <AddDeadlineForm subjects={subjects} />
      <section>
        <h2 className="mb-3 text-lg font-semibold">Danh sách deadline ({deadlines.length})</h2>
        <ul className="space-y-2">
          {deadlines.map((d) => (
            <li key={d.id} className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white p-3">
              <div className="min-w-0">
                <Link href={`/deadlines/${d.id}`} className="block truncate font-medium hover:underline">
                  #{d.id} {d.title}
                </Link>
                <p className="text-xs text-gray-500">{formatDateTime(d.dueDate)}</p>
              </div>
              <form action={deleteDeadlineAction}>
                <input type="hidden" name="id" value={d.id} />
                <button className="rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50">
                  Xoá
                </button>
              </form>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
