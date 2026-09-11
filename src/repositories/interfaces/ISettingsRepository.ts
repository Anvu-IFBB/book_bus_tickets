import { SystemSettings, AuditLog } from '@/types/automation';

export interface ISettingsRepository {
  getSettings(): Promise<SystemSettings>;
  updateSettings(updates: Partial<SystemSettings>): Promise<SystemSettings>;
  createAuditLog(log: AuditLog): Promise<AuditLog>;
  listAuditLogs(entityType?: string, entityId?: string): Promise<AuditLog[]>;
}
