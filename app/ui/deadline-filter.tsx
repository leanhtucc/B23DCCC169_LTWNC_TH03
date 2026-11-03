'use client';

import Link from 'next/link';
import { useState } from 'react';
import Countdown from '@/app/ui/countdown';
import { formatDateTime } from '@/app/lib/utils';
import type { Deadline, Subject } from '@/app/lib/definitions';

type Status = 'all' | 'upcoming' | 'overdue';

export default function DeadlineFilter({
  deadlines,
  subjects,
}: {
  deadlines: Deadline[];
  subjects: Subject[];
}) {
  const [subject, setSubject] = useState('all');
  const [status, setStatus] = useState<Status>('all');
  // Lọc theo trạng thái cần "bây giờ": chỉ dùng sau khi người dùng thao tác (client).
  const visible = deadlines.filter((d) => {
    if (subject !== 'all' && d.subjectSlug !== subject) return false;
    if (status === 'upcoming') return new Date(d.dueDate).getTime() >= Date.now();
    if (status === 'overdue') return new Date(d.dueDate).getTime() < Date.now();
    return true;
  });
  const subjectName = (slug: string) => subjects.find((s) => s.slug === slug)?.name ?? slug;

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-3">
        <select
          aria-label="Lọc theo môn học"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="rounded-lg border-gray-300 text-sm"
        >
          <option value="all">Tất cả môn học</option>
          {subjects.map((s) => (
            <option key={s.slug} value={s.slug}>{s.name}</option>
          ))}
        </select>
        <select
          aria-label="Lọc theo trạng thái"
          value={status}
          onChange={(e) => setStatus(e.target.value as Status)}
          className="rounded-lg border-gray-300 text-sm"
        >
          <option value="all">Mọi trạng thái</option>
          <option value="upcoming">Còn hạn</option>
          <option value="overdue">Quá hạn</option>
        </select>
      </div>

      {visible.length === 0 ? (
        <p className="rounded-lg bg-white p-6 text-center text-gray-500">
          Không có deadline phù hợp.
        </p>
      ) : (
        <ul className="space-y-3">
          {visible.map((d) => (
            <li key={d.id}>
              <Link
                href={`/deadlines/${d.id}`}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white p-4 hover:border-blue-400"
              >
                <div>
                  <p className="font-semibold">{d.title}</p>
                  <p className="text-sm text-gray-500">
                    {subjectName(d.subjectSlug)} · {formatDateTime(d.dueDate)}
                  </p>
                </div>
                <Countdown dueDate={d.dueDate} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
