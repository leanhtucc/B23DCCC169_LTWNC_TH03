import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GitHub from 'next-auth/providers/github';
import { z } from 'zod';
import { authConfig } from './auth.config';
import type { AuthRole } from '@/app/lib/definitions';

type Account = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: AuthRole;
};

const ACCOUNTS: Account[] = [
  { id: 'u-admin', name: 'Nguyễn Văn Admin', email: 'admin@ptit.edu.vn', password: 'admin123', role: 'admin' },
  { id: 'u-sv', name: 'Trần Thị Sinh', email: 'sv@ptit.edu.vn', password: 'sv123456', role: 'user' },
];

const adminEmails = (process.env.ADMIN_EMAILS ?? '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    GitHub({
      profile(profile) {
        const email = profile.email?.toLowerCase();
        return {
          id: `gh-${profile.id}`,
          name: profile.name ?? profile.login,
          email: profile.email,
          image: profile.avatar_url,
          role: email && adminEmails.includes(email) ? 'admin' : 'user',
        };
      },
    }),
    Credentials({
      async authorize(credentials) {
        const parsed = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
        if (!parsed.success) return null;

        const account = ACCOUNTS.find(
          (a) =>
            a.email === parsed.data.email.toLowerCase() &&
            a.password === parsed.data.password,
        );
        if (!account) return null;
        return { id: account.id, name: account.name, email: account.email, role: account.role };
      },
    }),
  ],
});
