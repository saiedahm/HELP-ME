import type { UUID } from "./common";

export type AgentType =
  | "language"
  | "document"
  | "research"
  | "writing"
  | "government_procedure"
  | "work"
  | "action";

export type AgentStatus =
  | "active"
  | "inactive"
  | "deprecated";

export type AgentRiskLevel =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface AgentDefinition {
  id: string;
  name: string;
  type: AgentType;
  version: string;
  status: AgentStatus;
  description: string;
  riskLevel: AgentRiskLevel;
  supportedTasks: string[];
  supportedTools: string[];
}

export interface AgentExecutionRequest {
  taskId: UUID;
  agentId: string;
  input: unknown;
  context?: Record<string, unknown>;
}

export interface AgentExecutionResult<T = unknown> {
  taskId: UUID;
  agentId: string;
  success: boolean;
  output: T | null;
  requiresConfirmation: boolean;
  error: string | null;
  metadata?: Record<string, unknown>;
} 
