import { NextRequest, NextResponse } from 'next/server';
import {
  createGraceToken,
  fetchLicenseValidation,
  LICENSE_COOKIE_NAME,
  verifyGraceToken,
  verifyLicenseToken,
} from '@/lib/license';

// Paths that skip license check entirely
const LICENSE_SKIP_PATHS = [
  '/license-required',
  '/api/auth',
  '/api/admin',
  '/admin',
  '/_next',
  '/favicon.ico',
];

async function licenseMiddleware(request: NextRequest): Promise<NextResponse | null> {
  const pathname = request.nextUrl.pathname;

  // Skip check for system paths
  if (LICENSE_SKIP_PATHS.some(p => pathname.startsWith(p))) {
    return null;
  }

  // Check an existing license JWT or a short-lived signed grace JWT locally.
  const cookieToken = request.cookies.get(LICENSE_COOKIE_NAME)?.value;
  if (cookieToken) {
    if (await verifyLicenseToken(cookieToken)) return null;
    if (await verifyGraceToken(cookieToken)) return null;
  }

  // Cookie missing or expired — fetch from license server
  const { valid, token, grace } = await fetchLicenseValidation();

  if (!valid) {
    // License invalid or revoked — block access
    const url = request.nextUrl.clone();
    url.pathname = '/license-required';
    return NextResponse.redirect(url);
  }

  if (token || grace) {
    const response = NextResponse.next();
    if (token) {
      response.cookies.set(LICENSE_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 48,
        path: '/',
      });
    } else if (grace) {
      const graceToken = await createGraceToken(6);
      response.cookies.set(LICENSE_COOKIE_NAME, graceToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 6,
        path: '/',
      });
    }
    return response;
  }

  return null;
}

export default async function middleware(request: NextRequest) {
  // 1. License check
  const licenseResponse = await licenseMiddleware(request);
  if (licenseResponse) {
    return licenseResponse;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
