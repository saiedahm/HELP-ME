import type { ISODateString, UUID } from "./common";

export type TaskStatus =
  | "created"
  | "queued"
  | "planning"
  | "running"
  | "waiting_confirmation"
  | "verifying"
  | "completed"
  | "failed"
  | "cancelled";

export type TaskPriority =
  | "low"
  | "normal"
  | "high"
  | "critical";

export interface Task {
  id: UUID;
  userId: UUID;
  title: string;
  input: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  completedAt: ISODateString | null;
}

export interface TaskStep {
  id: UUID;
  taskId: UUID;
  sequence: number;
  name: string;
  status: TaskStatus;
  startedAt: ISODateString | null;
  completedAt: ISODateString | null;
  error: string | null;
} 
