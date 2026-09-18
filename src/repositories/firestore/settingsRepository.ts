/* eslint-disable @typescript-eslint/no-explicit-any */
import { Firestore } from 'firebase-admin/firestore';
import { ISettingsRepository } from '../interfaces/ISettingsRepository';
import { SystemSettings, AuditLog } from '@/types/automation';
import { getAdminFirestore } from '@/lib/firebase/admin';
import { INITIAL_SETTINGS } from '../memory/mockData';
import { cleanUndefined, docToEntity } from './helpers';

export class FirestoreSettingsRepository implements ISettingsRepository {
  private get db(): Firestore {
    const firestore = getAdminFirestore();
    if (!firestore) {
      throw new Error('Firebase Admin Firestore is not initialized.');
    }
    return firestore;
  }

  async getSettings(): Promise<SystemSettings> {
    const docRef = this.db.collection('systemSettings').doc('general');
    const snap = await docRef.get();
    if (!snap.exists) {
      await docRef.set(cleanUndefined(INITIAL_SETTINGS as unknown as Record<string, unknown>));
      return { ...INITIAL_SETTINGS };
    }
    return snap.data() as SystemSettings;
  }

  async updateSettings(updates: Partial<SystemSettings>): Promise<SystemSettings> {
    const docRef = this.db.collection('systemSettings').doc('general');
    const current = await this.getSettings();
    const merged: SystemSettings = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    await docRef.update(cleanUndefined(merged as unknown as Record<string, unknown>));
    return merged;
  }

  async createAuditLog(log: AuditLog): Promise<AuditLog> {
    try {
      const docRef = this.db.collection('auditLogs').doc(log.id);
      await docRef.set(cleanUndefined(log as unknown as Record<string, unknown>));
    } catch (err) {
      console.warn('Ignored createAuditLog error:', err);
    }
    return log;
  }

  async listAuditLogs(entityType?: string, entityId?: string): Promise<AuditLog[]> {
    let q: FirebaseFirestore.Query = this.db.collection('auditLogs');
    if (entityType) {
      q = q.where('entityType', '==', entityType);
    }
    if (entityId) {
      q = q.where('entityId', '==', entityId);
    }

    const snap = await q.get();
    const results = snap.docs.map((d) => docToEntity<AuditLog>(d as any)!);
    return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}
