import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

let locales = ['en', 'bg']
let defaultLocale = 'bg'

export function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // Redirect if there is no locale
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`
  // e.g. incoming request is /products
  // The new URL is now /bg/products
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api, public files)
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
