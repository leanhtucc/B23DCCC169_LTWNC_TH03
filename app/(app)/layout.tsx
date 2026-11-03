import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import Header from '@/app/ui/header';

// Layout riêng cho khu vực cần đăng nhập (lớp bảo vệ thứ 2 sau proxy).
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect('/login');

  return (
    <>
      <Header />
      <main className="mx-auto min-h-[70vh] max-w-5xl px-4 py-8">{children}</main>
    </>
  );
}
