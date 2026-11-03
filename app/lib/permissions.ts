import type { Role } from '@/app/lib/definitions';

export type Action = 'view' | 'markDone' | 'add' | 'delete';

// Ma trận phân quyền duy nhất của dự án.
const MATRIX: Record<Role, Record<Action, boolean>> = {
  guest: { view: true, markDone: false, add: false, delete: false },
  user: { view: true, markDone: true, add: false, delete: false },
  admin: { view: true, markDone: true, add: true, delete: true },
};

export function can(role: Role | undefined | null, action: Action): boolean {
  return MATRIX[role ?? 'guest']?.[action] ?? false;
}
