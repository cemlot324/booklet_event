import { NextResponse } from 'next/server';
import { clerkMiddleware } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';

const publicRoutes = [
  '/',
  '/events/:id',
  '/api/webhook/clerk',
  '/api/webhook/stripe',
  '/api/uploadthing'
];

// Helper function to check if a route is public
function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some((route) => new RegExp(`^${route.replace(/:\w+/g, '[^/]+')}$`).test(pathname));
}

// Middleware function
export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check if the route is public and bypass Clerk middleware if it is
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // If not a public route, use Clerk's middleware directly without passing `req`
  return clerkMiddleware();
}

// Clerk matcher configuration
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
