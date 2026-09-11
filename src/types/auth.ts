export type UserRole = 'ADMIN' | 'MANAGER' | 'STAFF';

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  active: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

export interface SessionState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
