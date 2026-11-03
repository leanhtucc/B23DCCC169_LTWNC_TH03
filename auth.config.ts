import type { NextAuthConfig } from 'next-auth';
import { can } from '@/app/lib/permissions';
import type { AuthRole } from '@/app/lib/definitions';

// Cấu hình nhẹ, an toàn cho proxy/edge (không import fs hay provider nặng).
export const authConfig = {
  pages: { signIn: '/login' },
  session: { strategy: 'jwt' },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const { pathname, search } = nextUrl;
      const isProtected =
        pathname.startsWith('/dashboard') || pathname.startsWith('/admin');
      if (!isProtected) return true;

      if (!auth?.user) {
        const url = new URL('/login', nextUrl);
        url.searchParams.set('callbackUrl', pathname + search);
        return Response.redirect(url);
      }
      if (pathname.startsWith('/admin') && !can(auth.user.role, 'add')) {
        return Response.redirect(new URL('/403', nextUrl));
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id ?? token.sub ?? '';
        token.role = user.role ?? 'user';
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as AuthRole;
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
