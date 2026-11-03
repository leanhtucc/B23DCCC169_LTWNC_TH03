'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export type NavItem = { href: string; label: string };

export default function SideNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Menu dashboard" className="flex gap-2 md:flex-col">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={pathname === item.href ? 'page' : undefined}
          className={clsx(
            'rounded-lg px-3 py-2 text-sm font-medium',
            pathname === item.href
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-700 hover:bg-gray-100',
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
