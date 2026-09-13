import { UserRole } from '@/types/auth';

export const Permissions = {
  canManageBookings: (role: UserRole) => ['ADMIN', 'OPERATOR', 'STAFF', 'CSKH'].includes(role),
  canAssignFleet: (role: UserRole) => ['ADMIN', 'OPERATOR'].includes(role),
  canManagePayments: (role: UserRole) => ['ADMIN', 'OPERATOR', 'ACCOUNTANT'].includes(role),
  canManageInvoices: (role: UserRole) => ['ADMIN', 'ACCOUNTANT'].includes(role),
  canModifySettings: (role: UserRole) => ['ADMIN'].includes(role),
  canDeleteData: (role: UserRole) => ['ADMIN'].includes(role),
  canViewAuditLogs: (role: UserRole) => ['ADMIN', 'OPERATOR'].includes(role),
  canManageFeedback: (role: UserRole) => ['ADMIN', 'OPERATOR', 'CSKH'].includes(role),
  canManageAutomation: (role: UserRole) => ['ADMIN', 'OPERATOR'].includes(role),
  canViewAutomationLogs: (role: UserRole) => ['ADMIN', 'OPERATOR', 'CSKH'].includes(role),
  canViewAnalytics: (role: UserRole) => ['ADMIN', 'OPERATOR'].includes(role),
};
