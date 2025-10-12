import { NextRequest, NextResponse } from 'next/server'
import { hasValidToken } from './lib/auth'

// Korumalı rotalar
const protectedRoutes = [
  '/dashboard',
  '/transactions',
  '/accounts',
  '/cards',
  '/auto-payments',
  '/gold',
  '/analysis',
  '/portfolio',
  '/settings',
  '/periods',
  '/investments',
  '/beneficiaries',
  '/ewallets',
]

// Auth rotaları (giriş yapmış kullanıcılar erişemez)
const authRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password', '/landing']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Cookie'den token kontrolü (basit)
  const hasToken = hasValidToken(request)

  // Korumalı rotalar için kontrol
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!hasToken) {
      // Giriş yapmamış kullanıcıyı landing sayfasına yönlendir
      return NextResponse.redirect(new URL('/landing', request.url))
    }
  }

  // Auth rotaları için kontrol
  if (authRoutes.some(route => pathname.startsWith(route))) {
    if (hasToken) {
      // Giriş yapmış kullanıcıyı dashboard'a yönlendir
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Ana sayfa yönlendirmesi
  if (pathname === '/') {
    if (hasToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } else {
      return NextResponse.redirect(new URL('/landing', request.url))
    }
  }

  return NextResponse.next()
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
}
