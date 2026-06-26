import { NextRequest, NextResponse } from 'next/server';
import { verifyLicenseToken, fetchLicenseValidation, LICENSE_COOKIE_NAME } from '@/lib/license';

// Paths that skip license check entirely
const LICENSE_SKIP_PATHS = [
  '/license-required',
  '/api/auth',
  '/_next',
  '/favicon.ico',
];

async function licenseMiddleware(request: NextRequest): Promise<NextResponse | null> {
  const pathname = request.nextUrl.pathname;

  // Skip check for system paths
  if (LICENSE_SKIP_PATHS.some(p => pathname.startsWith(p))) {
    return null;
  }

  // Check existing JWT cookie
  const cookieToken = request.cookies.get(LICENSE_COOKIE_NAME)?.value;
  if (cookieToken && cookieToken !== 'grace') {
    const isValid = await verifyLicenseToken(cookieToken);
    if (isValid) return null; // Valid JWT — allow through
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
      response.cookies.set(LICENSE_COOKIE_NAME, 'grace', {
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
