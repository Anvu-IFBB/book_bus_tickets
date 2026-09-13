export type UserRole =
  | 'ADMIN'
  | 'OPERATOR'
  | 'MANAGER'
  | 'STAFF'
  | 'CSKH'
  | 'ACCOUNTANT'
  | 'DRIVER';

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

export interface LoginDTO {
  email: string;
  password?: string;
  idToken?: string;
}
