'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

const ROLE_LABEL = { admin: 'Lớp trưởng', user: 'Sinh viên' } as const;

// Client Component: header công khai vẫn tĩnh (SSG/ISR), trạng thái đăng nhập lấy phía client.
export default function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="h-8 w-40 animate-pulse rounded bg-gray-200" aria-hidden />;
  }
  if (!session?.user) {
    return (
      <Link
        href="/login"
        className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-400"
      >
        Đăng nhập
      </Link>
    );
  }
  const { name, role } = session.user;
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="hidden sm:inline">
        {name} ·{' '}
        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
          {ROLE_LABEL[role]}
        </span>
      </span>
      <button
        onClick={() => signOut({ redirectTo: '/' })}
        className="rounded-lg border border-gray-300 px-3 py-1.5 font-medium hover:bg-gray-100"
      >
        Đăng xuất
      </button>
    </div>
  );
}
