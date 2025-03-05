import type { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/middleware"
import { NextResponse } from "next/server"
import { createClient as createBrowserClient } from "@/lib/supabase/client"

const PUBLIC_PATHS = [
  '/login',
  '/register',
  '/reset-password',
  '/update-password',
  '/logout',
  '/',
  '/about',
  '/contact'
]

export async function middleware(request: NextRequest) {
  const res = createClient(request)
  const browserClient = createBrowserClient()

  // Check if path is public
  const isPublicPath = PUBLIC_PATHS.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )

  if (isPublicPath) {
    return res
  }

  const { data: { session } } = await browserClient.auth.getSession()

  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
    '/login',
    '/register',
    '/reset-password',
    '/update-password',
    '/logout',
    '/',
    '/about',
    '/contact'
  ],
}
