'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { auth, signIn } from '@/auth';
import { can, type Action } from '@/app/lib/permissions';
import {
  addDeadline,
  deleteDeadline,
  getDeadline,
  getSubjects,
  toggleDone,
} from '@/app/lib/db';

// ---------- Đăng nhập ----------

function safeRedirect(target: FormDataEntryValue | null) {
  const value = typeof target === 'string' ? target : '';
  return value.startsWith('/') && !value.startsWith('//') ? value : '/dashboard';
}

export async function authenticateGitHub(formData: FormData) {
  await signIn('github', { redirectTo: safeRedirect(formData.get('redirectTo')) });
}

// ---------- Kiểm tra quyền dùng chung cho mọi Server Action ----------

async function requireCan(action: Action) {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (!can(session.user.role, action)) redirect('/403');
  return session.user;
}

function revalidateDeadlines(id?: number, subjectSlug?: string) {
  revalidatePath('/');
  revalidatePath('/deadlines');
  revalidatePath('/sitemap.xml');
  revalidatePath('/dashboard');
  revalidatePath('/admin');
  if (id !== undefined) revalidatePath(`/deadlines/${id}`);
  if (subjectSlug) revalidatePath(`/subjects/${subjectSlug}`);
}

// ---------- Đánh dấu đã xong (user, admin) ----------

const IdSchema = z.coerce.number().int().positive();

export async function toggleDoneAction(formData: FormData) {
  const user = await requireCan('markDone');
  const id = IdSchema.safeParse(formData.get('id'));
  if (!id.success || !(await getDeadline(id.data))) return;

  await toggleDone(user.id, id.data);
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/done');
}

// ---------- Thêm / xoá (admin) ----------

const AddSchema = z.object({
  title: z.string().trim().min(3, 'Tiêu đề tối thiểu 3 ký tự').max(100, 'Tiêu đề tối đa 100 ký tự'),
  subjectSlug: z.string().min(1, 'Hãy chọn môn học'),
  dueDate: z
    .string()
    .refine((v) => !Number.isNaN(Date.parse(v)), 'Hạn nộp không hợp lệ'),
  description: z.string().trim().max(500, 'Mô tả tối đa 500 ký tự').default(''),
});

export type AddState = {
  ok?: boolean;
  values?: Record<string, string>;
  errors?: Partial<Record<'title' | 'subjectSlug' | 'dueDate' | 'description', string[]>>;
  message?: string;
};

export async function addDeadlineAction(
  _prev: AddState,
  formData: FormData,
): Promise<AddState> {
  await requireCan('add');

  const values = Object.fromEntries(formData) as Record<string, string>;
  const parsed = AddSchema.safeParse(values);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors, values, message: 'Dữ liệu không hợp lệ.' };
  }
  const subjects = await getSubjects();
  if (!subjects.some((s) => s.slug === parsed.data.subjectSlug)) {
    return { errors: { subjectSlug: ['Môn học không tồn tại'] }, values, message: 'Dữ liệu không hợp lệ.' };
  }

  const created = await addDeadline({
    ...parsed.data,
    dueDate: new Date(parsed.data.dueDate).toISOString(),
  });
  revalidateDeadlines(created.id, created.subjectSlug);
  return { ok: true, message: `Đã thêm deadline #${created.id}.` };
}

export async function deleteDeadlineAction(formData: FormData) {
  await requireCan('delete');
  const id = IdSchema.safeParse(formData.get('id'));
  if (!id.success) return;

  const existing = await getDeadline(id.data);
  if (!existing) return;
  await deleteDeadline(id.data);
  revalidateDeadlines(id.data, existing.subjectSlug);
}
