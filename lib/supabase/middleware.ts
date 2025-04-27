import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // Create a response object that we'll modify and return
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value
        },
        set(name, value, options) {
          // Set cookie on the response, not the request
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name, options) {
          // Remove cookie from the response
          response.cookies.delete(name)
        },
      },
    }
  )

  // Get the user session data
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Define authentication-exempt routes
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || 
                      request.nextUrl.pathname.startsWith('/register') ||
                      request.nextUrl.pathname.startsWith('/auth') ||
                      request.nextUrl.pathname === '/'
  
  // Handle redirects based on authentication status
  if (!user && !isAuthRoute) {
    // Not logged in and trying to access protected route, redirect to login
    const redirectUrl = new URL('/login', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  if (user && isAuthRoute && request.nextUrl.pathname !== '/') {
    // Already logged in and trying to access login/auth pages (except home), redirect to dashboard
    const redirectUrl = new URL('/generate', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}