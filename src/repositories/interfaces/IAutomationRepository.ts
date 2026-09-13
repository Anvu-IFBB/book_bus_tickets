import { AutomationJob, AutomationExecution, AutomationJobStatus, AutomationType } from '@/types/automation';

export interface AutomationJobFilter {
  status?: AutomationJobStatus;
  type?: AutomationType;
  entityId?: string;
}

export interface IAutomationRepository {
  createJobIfNotExist(idempotencyKey: string, data: Omit<AutomationJob, 'id' | 'createdAt' | 'updatedAt'>): Promise<AutomationJob | null>;
  claimJob(jobId: string): Promise<AutomationJob | null>;
  findById(id: string): Promise<AutomationJob | null>;
  findByIdempotencyKey(key: string): Promise<AutomationJob | null>;
  updateJob(id: string, updates: Partial<Omit<AutomationJob, 'id'>>): Promise<AutomationJob>;
  listJobs(filter?: AutomationJobFilter): Promise<AutomationJob[]>;

  // Execution Management
  createExecution(execution: Omit<AutomationExecution, 'id' | 'startedAt'>): Promise<AutomationExecution>;
  updateExecution(id: string, updates: Partial<Omit<AutomationExecution, 'id'>>): Promise<AutomationExecution>;
  getExecutionsByJobId(jobId: string): Promise<AutomationExecution[]>;
  addExecutionLog(executionId: string, log: string): Promise<void>;
}
