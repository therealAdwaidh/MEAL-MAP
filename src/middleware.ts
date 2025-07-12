// middleware.ts
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Define all public routes (including root and auth pages)
  const publicPaths = ['/', '/auth', '/auth/login', '/auth/register', '/favicon.ico', '/api/auth'];

  // Allow all public paths through
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check auth token
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // If not authenticated, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', req.url)); // 👈 Or `/auth` if preferred
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
