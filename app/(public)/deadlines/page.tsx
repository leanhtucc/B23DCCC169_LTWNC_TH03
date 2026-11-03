import type { Metadata } from 'next';
import { getDeadlines, getSubjects } from '@/app/lib/db';
import DeadlineFilter from '@/app/ui/deadline-filter';

// ISR: làm mới tối đa sau 60 giây.
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Tất cả deadline',
  description: 'Danh sách mọi deadline của lớp, lọc theo môn học và trạng thái.',
  alternates: { canonical: '/deadlines' },
};

export default async function DeadlinesPage() {
  const [deadlines, subjects] = await Promise.all([getDeadlines(), getSubjects()]);
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Tất cả deadline</h1>
      <DeadlineFilter deadlines={deadlines} subjects={subjects} />
    </div>
  );
}
