import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getDeadlines, getSubjects } from '@/app/lib/db';
import { formatDateTime } from '@/app/lib/utils';
import Countdown from '@/app/ui/countdown';

// SSG: không đọc cookies/headers nên Next render tĩnh lúc build.
export const metadata: Metadata = {
  title: { absolute: 'Class Deadline Hub - Cổng deadline của lớp' },
  description:
    'Xem deadline các môn học của lớp công khai. Đăng nhập để đánh dấu hoàn thành, lớp trưởng quản lý deadline.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Class Deadline Hub',
    description: 'Cổng deadline của lớp: không bỏ lỡ hạn nộp nào.',
    url: '/',
    images: ['/hero.svg'],
  },
};

export default async function HomePage() {
  const [subjects, deadlines] = await Promise.all([getSubjects(), getDeadlines()]);
  const upcoming = deadlines.slice(0, 5);

  return (
    <div className="space-y-12">
      <section className="grid items-center gap-8 md:grid-cols-2">
        <div>
          <h1 className="text-3xl font-bold md:text-4xl">Không bỏ lỡ deadline nào của lớp</h1>
          <p className="mt-4 text-gray-600">
            Mọi người đều xem được deadline công khai. Sinh viên đăng nhập để đánh dấu đã xong,
            lớp trưởng thêm và xoá deadline.
          </p>
          <Link
            href="/deadlines"
            className="mt-6 inline-block rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-400"
          >
            Xem tất cả deadline
          </Link>
        </div>
        <Image src="/hero.svg" alt="Minh hoạ danh sách deadline" width={480} height={320} priority className="w-full" />
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Môn học</h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {subjects.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/subjects/${s.slug}`}
                className="block rounded-lg border border-gray-200 bg-white p-4 hover:border-blue-400"
              >
                <p className="font-semibold">{s.name}</p>
                <p className="text-sm text-gray-500">{s.teacher}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Deadline sắp tới</h2>
        <ul className="space-y-3">
          {upcoming.map((d) => (
            <li key={d.id}>
              <Link
                href={`/deadlines/${d.id}`}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white p-4 hover:border-blue-400"
              >
                <div>
                  <p className="font-semibold">{d.title}</p>
                  <p className="text-sm text-gray-500">{formatDateTime(d.dueDate)}</p>
                </div>
                <Countdown dueDate={d.dueDate} />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
