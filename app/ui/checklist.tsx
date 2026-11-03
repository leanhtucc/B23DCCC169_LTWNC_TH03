import Link from 'next/link';
import { toggleDoneAction } from '@/app/lib/actions';
import { formatDateTime } from '@/app/lib/utils';
import Countdown from '@/app/ui/countdown';
import type { Deadline } from '@/app/lib/definitions';

// Server Component: danh sách có nút đánh dấu đã xong (form + Server Action).
export default function Checklist({
  deadlines,
  doneIds,
}: {
  deadlines: Deadline[];
  doneIds: number[];
}) {
  if (deadlines.length === 0) {
    return <p className="rounded-lg bg-white p-6 text-center text-gray-500">Chưa có deadline nào.</p>;
  }
  return (
    <ul className="space-y-3">
      {deadlines.map((d) => {
        const done = doneIds.includes(d.id);
        return (
          <li key={d.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white p-4">
            <div className={done ? 'opacity-60' : ''}>
              <Link href={`/deadlines/${d.id}`} className={`font-semibold hover:underline ${done ? 'line-through' : ''}`}>
                {d.title}
              </Link>
              <p className="text-sm text-gray-500">{formatDateTime(d.dueDate)}</p>
            </div>
            <div className="flex items-center gap-3">
              {!done && <Countdown dueDate={d.dueDate} />}
              <form action={toggleDoneAction}>
                <input type="hidden" name="id" value={d.id} />
                <button
                  className={
                    done
                      ? 'rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-100'
                      : 'rounded-lg bg-blue-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-400'
                  }
                >
                  {done ? 'Bỏ đánh dấu' : 'Đánh dấu đã xong'}
                </button>
              </form>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
