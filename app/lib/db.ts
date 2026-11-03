import 'server-only';
import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';
import type { Deadline, DeadlineStore, Subject } from '@/app/lib/definitions';

const SEED_FILE = path.join(process.cwd(), 'data', 'deadlines.json');
// Vercel chỉ cho ghi vào /tmp khi chạy; local ghi thẳng vào file JSON.
const WRITE_FILE = process.env.VERCEL
  ? path.join(os.tmpdir(), 'deadlines.json')
  : SEED_FILE;

async function read(): Promise<DeadlineStore> {
  for (const file of [WRITE_FILE, SEED_FILE]) {
    try {
      return JSON.parse(await fs.readFile(file, 'utf8')) as DeadlineStore;
    } catch {
      // thử file kế tiếp
    }
  }
  throw new Error('Không đọc được dữ liệu deadlines.json');
}

async function write(store: DeadlineStore) {
  await fs.writeFile(WRITE_FILE, JSON.stringify(store, null, 2), 'utf8');
}

export async function getSubjects(): Promise<Subject[]> {
  return (await read()).subjects;
}

export async function getSubject(slug: string): Promise<Subject | undefined> {
  return (await getSubjects()).find((s) => s.slug === slug);
}

export async function getDeadlines(): Promise<Deadline[]> {
  const { deadlines } = await read();
  return [...deadlines].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}

export async function getDeadline(id: number): Promise<Deadline | undefined> {
  return (await read()).deadlines.find((d) => d.id === id);
}

export async function getDeadlinesBySubject(slug: string): Promise<Deadline[]> {
  return (await getDeadlines()).filter((d) => d.subjectSlug === slug);
}

export async function getCompletions(userId: string): Promise<number[]> {
  return (await read()).completions[userId] ?? [];
}

export async function toggleDone(userId: string, deadlineId: number) {
  const store = await read();
  const done = new Set(store.completions[userId] ?? []);
  if (!done.delete(deadlineId)) done.add(deadlineId);
  store.completions[userId] = [...done];
  await write(store);
}

export async function addDeadline(input: Omit<Deadline, 'id'>): Promise<Deadline> {
  const store = await read();
  const id = Math.max(0, ...store.deadlines.map((d) => d.id)) + 1;
  const deadline = { id, ...input };
  store.deadlines.push(deadline);
  await write(store);
  return deadline;
}

export async function deleteDeadline(id: number) {
  const store = await read();
  store.deadlines = store.deadlines.filter((d) => d.id !== id);
  for (const uid of Object.keys(store.completions)) {
    store.completions[uid] = store.completions[uid].filter((x) => x !== id);
  }
  await write(store);
}
