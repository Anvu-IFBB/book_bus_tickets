import { getServerUser } from './getServerUser';
import { AuthUser, UserRole } from '@/types/auth';

export async function requireAuth(): Promise<AuthUser> {
  const user = await getServerUser();
  if (!user) {
    throw new Error('Unauthorized: Vui lòng đăng nhập.');
  }
  return user;
}

export async function requirePermission(
  permissionCheck: (role: UserRole) => boolean,
  errorMessage: string = 'Forbidden: Bạn không có quyền thực hiện thao tác này.'
): Promise<AuthUser> {
  const user = await requireAuth();
  if (!permissionCheck(user.role)) {
    throw new Error(errorMessage);
  }
  return user;
}
