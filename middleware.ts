import { NextResponse } from 'next/server';
import { clerkMiddleware } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';

// Define routes that should be publicly accessible without Clerk authentication
const publicRoutes = [
  '/',
  '/events/:id',
  '/api/webhook/clerk',
  '/api/webhook/stripe',
  '/api/uploadthing'
];

// Function to check if a route should bypass Clerk middleware
function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some((route) => new RegExp(`^${route.replace(/:\w+/g, '[^/]+')}$`).test(pathname));
}

// Middleware handler
export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // If the route is public, skip Clerk middleware
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Otherwise, apply Clerk middleware directly
  return clerkMiddleware(req);
}

// Clerk matcher configuration
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
