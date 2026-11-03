import type { DefaultSession } from 'next-auth';
import type { AuthRole } from '@/app/lib/definitions';

declare module 'next-auth' {
  interface User {
    role?: AuthRole;
  }

  interface Session {
    user: {
      id: string;
      role: AuthRole;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: AuthRole;
  }
}
