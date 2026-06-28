import { cookies } from 'next/headers';
import { verifyAdminSession, ADMIN_SESSION_COOKIE_NAME } from '@/lib/license';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return Response.json({ authenticated: false }, { status: 401 });
  }

  const isValid = await verifyAdminSession(token);

  if (!isValid) {
    return Response.json({ authenticated: false }, { status: 401 });
  }

  return Response.json({ authenticated: true });
}
