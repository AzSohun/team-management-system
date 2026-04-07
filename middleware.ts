import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const pathname = request.nextUrl.pathname;

    // Public routes (no auth required)
    const publicRoutes = ['/login', '/register'];

    // Check if the current path is a public route
    const isPublicRoute = publicRoutes.some((route) =>
        pathname.startsWith(route)
    );

    // If user is authenticated and tries to access auth pages, redirect to dashboard
    if (token && isPublicRoute) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // If user is not authenticated and tries to access protected routes, redirect to login
    if (!token && !isPublicRoute && pathname !== '/') {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
