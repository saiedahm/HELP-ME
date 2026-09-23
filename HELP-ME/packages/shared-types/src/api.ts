 import type { Pagination, UUID } from "./common";

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  requestId?: UUID;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  requestId: UUID;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiError;
  requestId: UUID;
}

export type ApiResponse<T> =
  | ApiSuccessResponse<T>
  | ApiErrorResponse;

export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: Pagination;
  requestId: UUID;
}

export interface HealthResponse {
  status: "ok" | "degraded" | "down";
  version: string;
  timestamp: string;
}
