'use client';

import { useActionState } from 'react';
import { authenticate, authenticateGitHub } from '@/app/lib/actions';

export default function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [error, formAction, pending] = useActionState(authenticate, undefined);

  return (
    <div className="space-y-4">
      <form action={formAction} className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
        <h1 className="text-2xl font-bold">Đăng nhập</h1>
        <input type="hidden" name="redirectTo" value={callbackUrl} />
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label>
          <input id="email" name="email" type="email" required className="w-full rounded-md border-gray-300 text-sm" />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium">Mật khẩu</label>
          <input id="password" name="password" type="password" required minLength={6} className="w-full rounded-md border-gray-300 text-sm" />
        </div>
        <button
          disabled={pending}
          className="h-10 w-full rounded-lg bg-blue-500 text-sm font-medium text-white hover:bg-blue-400 disabled:opacity-50"
        >
          {pending ? 'Đang đăng nhập…' : 'Đăng nhập'}
        </button>
        <p aria-live="polite" className="min-h-5 text-sm text-red-600">{error}</p>
      </form>

      <form action={authenticateGitHub} className="rounded-lg border border-gray-200 bg-white p-6">
        <input type="hidden" name="redirectTo" value={callbackUrl} />
        <button className="h-10 w-full rounded-lg bg-gray-900 text-sm font-medium text-white hover:bg-gray-800">
          Tiếp tục với GitHub
        </button>
      </form>
    </div>
  );
}
