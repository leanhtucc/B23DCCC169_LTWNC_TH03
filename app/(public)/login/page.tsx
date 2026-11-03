import type { Metadata } from 'next';
import LoginForm from '@/app/ui/login-form';

export const metadata: Metadata = {
  title: 'Đăng nhập',
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;
  const safe =
    callbackUrl && callbackUrl.startsWith('/') && !callbackUrl.startsWith('//')
      ? callbackUrl
      : '/dashboard';
  return (
    <div className="mx-auto max-w-sm">
      <LoginForm callbackUrl={safe} />
    </div>
  );
}
