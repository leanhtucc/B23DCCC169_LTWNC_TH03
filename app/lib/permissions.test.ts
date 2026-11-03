import { can, type Action } from './permissions';
import type { Role } from './definitions';

const expected: Record<Role, Record<Action, boolean>> = {
  guest: { view: true, markDone: false, add: false, delete: false },
  user: { view: true, markDone: true, add: false, delete: false },
  admin: { view: true, markDone: true, add: true, delete: true },
};

describe('can(role, action)', () => {
  for (const role of Object.keys(expected) as Role[]) {
    for (const action of Object.keys(expected[role]) as Action[]) {
      it(`${role} ${expected[role][action] ? 'được' : 'không được'} ${action}`, () => {
        expect(can(role, action)).toBe(expected[role][action]);
      });
    }
  }

  it('coi undefined/null là guest', () => {
    expect(can(undefined, 'add')).toBe(false);
    expect(can(null, 'view')).toBe(true);
  });
});
