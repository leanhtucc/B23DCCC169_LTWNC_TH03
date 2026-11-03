import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

// Lớp bảo vệ 1: chuyển hướng sớm. Trang /admin và Server Action vẫn tự kiểm tra lại.
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
