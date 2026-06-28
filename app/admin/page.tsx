import { cookies } from 'next/headers';
import { verifyAdminSession, ADMIN_SESSION_COOKIE_NAME } from '@/lib/license';
import LoginForm from './LoginForm';
import AdminPanel from './AdminPanel';

export default async function AdminPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;

  const isAuthenticated = sessionToken
    ? await verifyAdminSession(sessionToken)
    : false;

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return <AdminPanel />;
}
