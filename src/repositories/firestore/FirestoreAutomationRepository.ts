import { Firestore } from 'firebase-admin/firestore';
import { IAutomationRepository, AutomationJobFilter } from '../interfaces/IAutomationRepository';
import { AutomationJob, AutomationExecution } from '@/types/automation';
import { getAdminFirestore } from '@/lib/firebase/admin';

export class FirestoreAutomationRepository implements IAutomationRepository {
  private get db(): Firestore {
    const firestore = getAdminFirestore();
    if (!firestore) throw new Error('Firebase Admin Firestore is not initialized.');
    return firestore;
  }

  private get jobsCollection() {
    return this.db.collection('automationJobs');
  }

  private get executionsCollection() {
    return this.db.collection('automationExecutions');
  }

  async createJobIfNotExist(idempotencyKey: string, jobData: Omit<AutomationJob, 'id' | 'createdAt' | 'updatedAt'>): Promise<AutomationJob | null> {
    const docId = idempotencyKey.replace(/[^a-zA-Z0-9_-]/g, '_');
    const docRef = this.jobsCollection.doc(docId);

    try {
      const result = await this.db.runTransaction(async (transaction) => {
        const existingDoc = await transaction.get(docRef);
        if (existingDoc.exists) {
          return null; // Already exists
        }

        const newJob: AutomationJob = {
          ...jobData,
          id: docId,
          idempotencyKey,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        transaction.set(docRef, newJob);
        return newJob;
      });

      return result;
    } catch (error) {
      console.error('Error creating job with transaction:', error);
      throw error;
    }
  }

  async claimJob(jobId: string): Promise<AutomationJob | null> {
    const docRef = this.jobsCollection.doc(jobId);

    try {
      return await this.db.runTransaction(async (transaction) => {
        const docSnap = await transaction.get(docRef);
        if (!docSnap.exists) return null;

        const job = docSnap.data() as AutomationJob;
        if (job.status === 'RUNNING') return null;

        const updatedJob = {
          ...job,
          status: 'RUNNING',
          updatedAt: new Date().toISOString()
        };

        transaction.update(docRef, updatedJob);
        return updatedJob as AutomationJob;
      });
    } catch (e) {
      console.error('Transaction failed: ', e);
      return null;
    }
  }

  async findById(id: string): Promise<AutomationJob | null> {
    const docRef = this.jobsCollection.doc(id);
    const snap = await docRef.get();
    if (!snap.exists) return null;
    return snap.data() as AutomationJob;
  }

  async findByIdempotencyKey(key: string): Promise<AutomationJob | null> {
    const docId = key.replace(/[^a-zA-Z0-9_-]/g, '_');
    return this.findById(docId);
  }

  async updateJob(id: string, updates: Partial<Omit<AutomationJob, 'id'>>): Promise<AutomationJob> {
    const docRef = this.jobsCollection.doc(id);
    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    await docRef.update(updatedData);
    const snap = await docRef.get();
    return snap.data() as AutomationJob;
  }

  async listJobs(filter?: AutomationJobFilter): Promise<AutomationJob[]> {
    let q: FirebaseFirestore.Query = this.jobsCollection;
    
    if (filter?.status) q = q.where('status', '==', filter.status);
    if (filter?.type) q = q.where('type', '==', filter.type);
    if (filter?.entityId) q = q.where('entityId', '==', filter.entityId);

    q = q.orderBy('createdAt', 'desc');

    const snap = await q.get();
    return snap.docs.map(doc => doc.data() as AutomationJob);
  }

  async createExecution(execution: Omit<AutomationExecution, 'id' | 'startedAt'>): Promise<AutomationExecution> {
    const docId = crypto.randomUUID();
    const docRef = this.executionsCollection.doc(docId);

    const newExec: AutomationExecution = {
      ...execution,
      id: docId,
      startedAt: new Date().toISOString(),
      logs: execution.logs || [],
    };

    await docRef.set(newExec);
    return newExec;
  }

  async updateExecution(id: string, updates: Partial<Omit<AutomationExecution, 'id'>>): Promise<AutomationExecution> {
    const docRef = this.executionsCollection.doc(id);
    await docRef.update(updates);
    const snap = await docRef.get();
    return snap.data() as AutomationExecution;
  }

  async getExecutionsByJobId(jobId: string): Promise<AutomationExecution[]> {
    const q = this.executionsCollection.where('jobId', '==', jobId).orderBy('startedAt', 'desc');
    const snap = await q.get();
    return snap.docs.map(doc => doc.data() as AutomationExecution);
  }

  async addExecutionLog(executionId: string, log: string): Promise<void> {
    const docRef = this.executionsCollection.doc(executionId);
    await this.db.runTransaction(async (transaction) => {
      const snap = await transaction.get(docRef);
      if (snap.exists) {
        const data = snap.data() as AutomationExecution;
        const newLogs = [...(data.logs || []), `[${new Date().toISOString()}] ${log}`];
        transaction.update(docRef, { logs: newLogs });
      }
    });
  }
}
