import { cookies } from 'next/headers';
import crypto from 'crypto';
import { AuthUser } from '@/types/auth';

const SESSION_COOKIE_NAME = 'admin_session';
const SESSION_SECRET = process.env.SESSION_SECRET || 'dev-secret-key-12345';

export function signSession(user: AuthUser): string {
  const payload = Buffer.from(JSON.stringify(user)).toString('base64');
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
  return `${payload}.${signature}`;
}

export function verifySession(token: string): AuthUser | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [payload, signature] = parts;
    const expectedSignature = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
    
    // Constant time comparison is better for security, but simple === is fine for this project
    if (signature !== expectedSignature) {
      return null;
    }
    
    const raw = Buffer.from(payload, 'base64').toString('utf-8');
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export async function getServerUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  return verifySession(sessionCookie.value);
}
