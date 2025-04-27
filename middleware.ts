import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Track previous redirects to prevent loops
const redirectCache = new Map<string, number>()
const MAX_REDIRECTS = 3

export async function middleware(req: NextRequest) {
  // Skip middleware processing for API routes and static files
  if (
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.startsWith('/api') ||
    req.nextUrl.pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  const res = NextResponse.next()
  
  // Debug: Log all cookies
  console.log('All cookies:', Array.from(req.cookies.getAll()).map(c => `${c.name}=${c.value.substring(0, Math.min(10, c.value.length))}...`))
  
  // Check for our manual auth cookies
  const hasAuthCookie = Array.from(req.cookies.getAll())
    .some(cookie => 
      cookie.name === 'auth-manual' ||
      cookie.name === 'auth-user-id'
    )
  
  console.log('Has auth cookie:', hasAuthCookie)
  
  // Auth route protection logic
  const path = req.nextUrl.pathname
  const publicPaths = ['/', '/login', '/signup', '/verify-email', '/auth/callback']
  const requestId = `${req.headers.get('x-forwarded-for') || 'unknown'}-${path}`
  
  // Check for redirect loops
  const redirectCount = redirectCache.get(requestId) || 0
  if (redirectCount >= MAX_REDIRECTS) {
    console.log(`⚠️ Detected redirect loop for ${requestId}, skipping redirect`)
    return res
  }
  
  // Redirect unauthenticated users trying to access protected routes
  if (!hasAuthCookie && !publicPaths.includes(path)) {
    console.log(`Redirecting unauthenticated user from ${path} to /login`)
    redirectCache.set(requestId, redirectCount + 1)
    return NextResponse.redirect(new URL('/login', req.url))
  }
  
  // Redirect authenticated users away from auth pages
  if (hasAuthCookie && (path === '/login' || path === '/signup')) {
    console.log(`Redirecting authenticated user from ${path} to /generate`)
    redirectCache.set(requestId, redirectCount + 1)
    return NextResponse.redirect(new URL('/generate', req.url))
  }
  
  // Clear redirect count for successful requests
  redirectCache.delete(requestId)
  return res
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|api).*)',
  ],
}