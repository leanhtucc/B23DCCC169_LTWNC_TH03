import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '403 - Không có quyền truy cập',
  robots: { index: false, follow: false },
};

export default function ForbiddenPage() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-3xl font-bold">403 - Không có quyền truy cập</h1>
      <p className="mt-3 text-gray-600">Chỉ lớp trưởng (admin) mới vào được trang này.</p>
      <Link href="/dashboard" className="mt-6 inline-block rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-400">
        Về Dashboard
      </Link>
    </div>
  );
}
