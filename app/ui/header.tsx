import Link from 'next/link';
import Image from 'next/image';
import AuthStatus from '@/app/ui/auth-status';

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-blue-500">
          <Image src="/logo.svg" alt="" width={32} height={32} />
          Class Deadline Hub
        </Link>
        <nav className="flex items-center gap-5 text-sm font-medium">
          <Link href="/deadlines" className="hover:text-blue-500">Deadline</Link>
          <Link href="/dashboard" className="hover:text-blue-500">Dashboard</Link>
          <AuthStatus />
        </nav>
      </div>
    </header>
  );
}
