// middleware.ts
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

// Define your custom user type for session (optional, but good practice)
declare module 'next-auth' {
  interface Session {
    user: {
      id?: string; // Add Supabase user ID here
      email?: string | null;
      name?: string | null;
      image?: string | null;
    };
  }
}

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const publicPaths = ['/register', '/api/auth', '/favicon.ico']; // Paths accessible without login, include static assets

    // Allow access to public paths
    if (publicPaths.some(path => pathname.startsWith(path))) {
        return NextResponse.next();
    }

    // Check if the user is authenticated using NextAuth.js JWT
    // The secret is required for production, and recommended for development.
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
        // Optional: specify encryption for the JWT, if you have it configured in NextAuth.js
        // encryption: true, // Only if your NextAuth.js config uses encryption
    });

    // If no token and not on a public path, redirect to /register
    if (!token && pathname !== '/auth') {
        return NextResponse.redirect(new URL('/auth', req.url));
    }

    // If authenticated, allow access
    return NextResponse.next();
}

// Optionally, define a matcher to run middleware only on specific paths
export const config = {
    matcher: ['/', '/((?!api|_next/static|_next/image|favicon.ico).*)'], // Match all paths except API routes, static files, etc.
};