'use client';

import { useActionState } from 'react';
import { addDeadlineAction, type AddState } from '@/app/lib/actions';
import type { Subject } from '@/app/lib/definitions';

const initial: AddState = {};

export default function AddDeadlineForm({ subjects }: { subjects: Subject[] }) {
  const [state, formAction, pending] = useActionState(addDeadlineAction, initial);

  return (
    <form action={formAction} className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="text-lg font-semibold">Thêm deadline</h2>
      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium">Tiêu đề</label>
        <input id="title" name="title" required className="w-full rounded-md border-gray-300 text-sm" />
        <p className="text-xs text-red-600">{state.errors?.title?.[0]}</p>
      </div>
      <div>
        <label htmlFor="subjectSlug" className="mb-1 block text-sm font-medium">Môn học</label>
        <select id="subjectSlug" name="subjectSlug" required className="w-full rounded-md border-gray-300 text-sm">
          {subjects.map((s) => (
            <option key={s.slug} value={s.slug}>{s.name}</option>
          ))}
        </select>
        <p className="text-xs text-red-600">{state.errors?.subjectSlug?.[0]}</p>
      </div>
      <div>
        <label htmlFor="dueDate" className="mb-1 block text-sm font-medium">Hạn nộp</label>
        <input id="dueDate" name="dueDate" type="datetime-local" required className="w-full rounded-md border-gray-300 text-sm" />
        <p className="text-xs text-red-600">{state.errors?.dueDate?.[0]}</p>
      </div>
      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium">Mô tả</label>
        <textarea id="description" name="description" rows={3} className="w-full rounded-md border-gray-300 text-sm" />
        <p className="text-xs text-red-600">{state.errors?.description?.[0]}</p>
      </div>
      <button
        disabled={pending}
        className="h-10 rounded-lg bg-blue-500 px-4 text-sm font-medium text-white hover:bg-blue-400 disabled:opacity-50"
      >
        {pending ? 'Đang thêm…' : 'Thêm deadline'}
      </button>
      <p aria-live="polite" className={state.ok ? 'text-sm text-green-700' : 'text-sm text-red-600'}>
        {state.message}
      </p>
    </form>
  );
}
