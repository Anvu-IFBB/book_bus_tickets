import { IAutomationRepository, AutomationJobFilter } from '../interfaces/IAutomationRepository';
import { AutomationJob, AutomationExecution } from '@/types/automation';
import { getFirebaseFirestore } from '@/lib/firebase/client';
import { collection, doc, getDoc, getDocs, query, runTransaction, setDoc, updateDoc, where, orderBy, QueryConstraint } from 'firebase/firestore';

export class FirestoreAutomationRepository implements IAutomationRepository {
  private get jobsCollection() {
    return collection(getFirebaseFirestore()!, 'automationJobs');
  }

  private get executionsCollection() {
    return collection(getFirebaseFirestore()!, 'automationExecutions');
  }

  async createJobIfNotExist(idempotencyKey: string, jobData: Omit<AutomationJob, 'id' | 'createdAt' | 'updatedAt'>): Promise<AutomationJob | null> {
    const db = getFirebaseFirestore()!;
    // Use sanitized idempotency key as the document ID to guarantee uniqueness via transaction
    const docId = idempotencyKey.replace(/[^a-zA-Z0-9_-]/g, '_');
    const docRef = doc(db, 'automationJobs', docId);

    try {
      const result = await runTransaction(db, async (transaction) => {
        const existingDoc = await transaction.get(docRef);
        if (existingDoc.exists()) {
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
    const db = getFirebaseFirestore()!;
    const docRef = doc(this.jobsCollection, jobId);

    try {
      return await runTransaction(db, async (transaction) => {
        const docSnap = await transaction.get(docRef);
        if (!docSnap.exists()) return null;

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
    const docRef = doc(this.jobsCollection, id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return snap.data() as AutomationJob;
  }

  async findByIdempotencyKey(key: string): Promise<AutomationJob | null> {
    const docId = key.replace(/[^a-zA-Z0-9_-]/g, '_');
    return this.findById(docId);
  }

  async updateJob(id: string, updates: Partial<Omit<AutomationJob, 'id'>>): Promise<AutomationJob> {
    const docRef = doc(this.jobsCollection, id);
    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    await updateDoc(docRef, updatedData);
    const snap = await getDoc(docRef);
    return snap.data() as AutomationJob;
  }

  async listJobs(filter?: AutomationJobFilter): Promise<AutomationJob[]> {
    const constraints: QueryConstraint[] = [];
    if (filter?.status) constraints.push(where('status', '==', filter.status));
    if (filter?.type) constraints.push(where('type', '==', filter.type));
    if (filter?.entityId) constraints.push(where('entityId', '==', filter.entityId));

    constraints.push(orderBy('createdAt', 'desc'));

    const q = query(this.jobsCollection, ...constraints);
    const snap = await getDocs(q);
    return snap.docs.map(doc => doc.data() as AutomationJob);
  }

  async createExecution(execution: Omit<AutomationExecution, 'id' | 'startedAt'>): Promise<AutomationExecution> {
    const docId = `exec-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const docRef = doc(this.executionsCollection, docId);

    const newExec: AutomationExecution = {
      ...execution,
      id: docId,
      startedAt: new Date().toISOString(),
      logs: execution.logs || [],
    };

    await setDoc(docRef, newExec);
    return newExec;
  }

  async updateExecution(id: string, updates: Partial<Omit<AutomationExecution, 'id'>>): Promise<AutomationExecution> {
    const docRef = doc(this.executionsCollection, id);
    await updateDoc(docRef, updates);
    const snap = await getDoc(docRef);
    return snap.data() as AutomationExecution;
  }

  async getExecutionsByJobId(jobId: string): Promise<AutomationExecution[]> {
    const q = query(this.executionsCollection, where('jobId', '==', jobId), orderBy('startedAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(doc => doc.data() as AutomationExecution);
  }

  async addExecutionLog(executionId: string, log: string): Promise<void> {
    const db = getFirebaseFirestore()!;
    const docRef = doc(this.executionsCollection, executionId);
    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(docRef);
      if (snap.exists()) {
        const data = snap.data() as AutomationExecution;
        const newLogs = [...(data.logs || []), `[${new Date().toISOString()}] ${log}`];
        transaction.update(docRef, { logs: newLogs });
      }
    });
  }
}
