import { IAutomationRepository, AutomationJobFilter } from '../interfaces/IAutomationRepository';
import { AutomationJob, AutomationExecution } from '@/types/automation';

export class MemoryAutomationRepository implements IAutomationRepository {
  private jobs: AutomationJob[] = [];
  private executions: AutomationExecution[] = [];

  async createJobIfNotExist(idempotencyKey: string, jobData: Omit<AutomationJob, 'id' | 'createdAt' | 'updatedAt'>): Promise<AutomationJob | null> {
    const existing = this.jobs.find(j => j.idempotencyKey === idempotencyKey);
    if (existing) return null;

    const newJob: AutomationJob = {
      ...jobData,
      id: `job-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.jobs.push(newJob);
    return newJob;
  }

  async claimJob(jobId: string): Promise<AutomationJob | null> {
    const job = this.jobs.find(j => j.id === jobId);
    if (!job || job.status === 'RUNNING') return null;
    
    // Simulate transaction
    job.status = 'RUNNING';
    job.updatedAt = new Date().toISOString();
    return { ...job };
  }

  async findById(id: string): Promise<AutomationJob | null> {
    return this.jobs.find(j => j.id === id) || null;
  }

  async findByIdempotencyKey(key: string): Promise<AutomationJob | null> {
    return this.jobs.find(j => j.idempotencyKey === key) || null;
  }

  async updateJob(id: string, updates: Partial<Omit<AutomationJob, 'id'>>): Promise<AutomationJob> {
    const idx = this.jobs.findIndex(j => j.id === id);
    if (idx === -1) throw new Error(`Job not found: ${id}`);
    
    const updated = {
      ...this.jobs[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.jobs[idx] = updated;
    return updated;
  }

  async listJobs(filter?: AutomationJobFilter): Promise<AutomationJob[]> {
    let result = [...this.jobs];
    if (filter) {
      if (filter.status) result = result.filter(j => j.status === filter.status);
      if (filter.type) result = result.filter(j => j.type === filter.type);
      if (filter.entityId) result = result.filter(j => j.entityId === filter.entityId);
    }
    // Sort by createdAt descending
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createExecution(execution: Omit<AutomationExecution, 'id' | 'startedAt'>): Promise<AutomationExecution> {
    const newExec: AutomationExecution = {
      ...execution,
      id: `exec-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      startedAt: new Date().toISOString(),
      logs: execution.logs || [],
    };
    this.executions.push(newExec);
    return newExec;
  }

  async updateExecution(id: string, updates: Partial<Omit<AutomationExecution, 'id'>>): Promise<AutomationExecution> {
    const idx = this.executions.findIndex(e => e.id === id);
    if (idx === -1) throw new Error(`Execution not found: ${id}`);
    
    const updated = {
      ...this.executions[idx],
      ...updates,
    };
    this.executions[idx] = updated;
    return updated;
  }

  async getExecutionsByJobId(jobId: string): Promise<AutomationExecution[]> {
    return this.executions
      .filter(e => e.jobId === jobId)
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
  }

  async addExecutionLog(executionId: string, log: string): Promise<void> {
    const idx = this.executions.findIndex(e => e.id === executionId);
    if (idx !== -1) {
      this.executions[idx].logs = [...(this.executions[idx].logs || []), `[${new Date().toISOString()}] ${log}`];
    }
  }
}
