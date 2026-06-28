import { cookies } from 'next/headers';
import {
  validateLicenseKey,
  signAdminSession,
  ADMIN_SESSION_COOKIE_NAME,
  ADMIN_SESSION_MAX_AGE,
} from '@/lib/license';

export async function POST(request: Request) {
  let body: { licenseKey?: unknown };

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const licenseKey = typeof body.licenseKey === 'string' ? body.licenseKey.trim() : '';

  if (!licenseKey) {
    return Response.json({ error: 'License key is required' }, { status: 400 });
  }

  const isValid = await validateLicenseKey(licenseKey);

  if (!isValid) {
    return Response.json({ error: 'Invalid or inactive license key' }, { status: 401 });
  }

  const token = await signAdminSession();
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: ADMIN_SESSION_MAX_AGE,
    path: '/',
  });

  return Response.json({ success: true });
}
