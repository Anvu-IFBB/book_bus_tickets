import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  Firestore,
} from 'firebase/firestore';
import { ISettingsRepository } from '../interfaces/ISettingsRepository';
import { SystemSettings, AuditLog } from '@/types/automation';
import { getFirebaseFirestore } from '@/lib/firebase/client';
import { INITIAL_SETTINGS } from '../memory/mockData';
import { cleanUndefined, docToEntity } from './helpers';

export class FirestoreSettingsRepository implements ISettingsRepository {
  private get db(): Firestore {
    const firestore = getFirebaseFirestore();
    if (!firestore) {
      throw new Error('Firebase Firestore is not initialized.');
    }
    return firestore;
  }

  async getSettings(): Promise<SystemSettings> {
    const docRef = doc(this.db, 'systemSettings', 'general');
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      await setDoc(docRef, cleanUndefined(INITIAL_SETTINGS as unknown as Record<string, unknown>));
      return { ...INITIAL_SETTINGS };
    }
    return snap.data() as SystemSettings;
  }

  async updateSettings(updates: Partial<SystemSettings>): Promise<SystemSettings> {
    const docRef = doc(this.db, 'systemSettings', 'general');
    const current = await this.getSettings();
    const merged: SystemSettings = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    await updateDoc(docRef, cleanUndefined(merged as unknown as Record<string, unknown>));
    return merged;
  }

  async createAuditLog(log: AuditLog): Promise<AuditLog> {
    if (typeof window !== 'undefined') {
      console.warn('SECURITY WARN: Client is no longer allowed to create Audit Logs directly.');
      return log;
    }
    // Fallback for any legacy server-side usage of Client SDK (though Admin SDK should be used)
    try {
      const docRef = doc(this.db, 'auditLogs', log.id);
      await setDoc(docRef, cleanUndefined(log as unknown as Record<string, unknown>));
    } catch (err) {
      console.warn('Ignored createAuditLog error (Likely blocked by Firestore Rules):', err);
    }
    return log;
  }

  async listAuditLogs(entityType?: string, entityId?: string): Promise<AuditLog[]> {
    let q = query(collection(this.db, 'auditLogs'));
    if (entityType) {
      q = query(q, where('entityType', '==', entityType));
    }
    if (entityId) {
      q = query(q, where('entityId', '==', entityId));
    }

    const snap = await getDocs(q);
    const results = snap.docs.map((d) => docToEntity<AuditLog>(d)!);
    return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}
