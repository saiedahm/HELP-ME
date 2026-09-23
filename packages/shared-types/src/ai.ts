export type AIProvider =
  | "openai"
  | "anthropic"
  | "google"
  | "other";

export type AIRequestStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "timeout";

export interface AIRequest {
  provider: AIProvider;
  model: string;
  systemPrompt?: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIUsage {
  provider: AIProvider;
  model: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCost: number;
}

export interface AIResponse<T = unknown> {
  status: AIRequestStatus;
  data: T | null;
  usage: AIUsage | null;
  error: string | null;
} 
