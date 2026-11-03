'use client';

import { useEffect, useState } from 'react';
import { describeRemaining } from '@/app/lib/utils';

// Chỉ tính trên client để HTML tĩnh (SSG/ISR) không bị lệch thời gian.
export default function Countdown({ dueDate }: { dueDate: string }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(timer);
  }, []);

  if (now === null) {
    return <span className="text-gray-400">…</span>;
  }
  const { overdue, text } = describeRemaining(dueDate, now);
  return (
    <span
      className={
        overdue
          ? 'rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-600'
          : 'rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700'
      }
    >
      {text}
    </span>
  );
}
