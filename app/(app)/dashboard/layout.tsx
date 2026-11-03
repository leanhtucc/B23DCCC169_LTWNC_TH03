import type { Metadata } from 'next';
import { auth } from '@/auth';
import { can } from '@/app/lib/permissions';
import SideNav, { type NavItem } from '@/app/ui/side-nav';

export const metadata: Metadata = {
  title: 'Dashboard',
  robots: { index: false, follow: false },
};

// Layout lồng nhau: sidebar chỉ có trong /dashboard.
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const items: NavItem[] = [
    { href: '/dashboard', label: 'Tất cả deadline' },
    { href: '/dashboard/done', label: 'Đã hoàn thành' },
  ];
  if (can(session?.user.role, 'add')) items.push({ href: '/admin', label: 'Quản trị' });

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <aside className="md:w-52 md:shrink-0">
        <SideNav items={items} />
      </aside>
      <section className="min-w-0 flex-1">{children}</section>
    </div>
  );
}
