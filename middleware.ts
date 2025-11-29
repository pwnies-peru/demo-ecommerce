import { updateSession } from '@/lib/supabase/middleware'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Middleware for demo mode
 * - Maintains session state
 * - No route protection (user is always logged in)
 * - Signin/signup pages redirect to home
 */
export async function middleware(request: NextRequest) {
  // Update session (this refreshes the user's session if needed)
  const response = await updateSession(request)

  // Get the pathname
  const path = request.nextUrl.pathname

  // Redirect signin/signup to home since they're disabled in demo mode
  if (path === '/signin' || path === '/signup') {
    // Allow the page to render but it will auto-redirect via the component
    // This provides better UX with a loading message
    return response
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

