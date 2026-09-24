 import type {
  ApiResponse,
  HealthResponse,
  Task,
  User,
} from "@help-me/shared-types";

export interface ApiClientConfig {
  baseUrl: string;
  getAccessToken?: () => string | null | Promise<string | null>;
}

export class ApiClient {
  private readonly baseUrl: string;

  private readonly getAccessToken?: ApiClientConfig["getAccessToken"];

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/+$/, "");
    this.getAccessToken = config.getAccessToken;
  }

  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getAccessToken
      ? await this.getAccessToken()
      : null;

    const headers = new Headers(options.headers);

    headers.set("Accept", "application/json");

    if (options.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(
      `${this.baseUrl}${path}`,
      {
        ...options,
        headers,
      }
    );

    const body = (await response.json()) as ApiResponse<T>;

    if (!response.ok) {
      return body;
    }

    return body;
  }

  async health(): Promise<ApiResponse<HealthResponse>> {
    return this.request<HealthResponse>("/health");
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<User>("/api/v1/auth/me");
  }

  async getTask(
    taskId: string
  ): Promise<ApiResponse<Task>> {
    return this.request<Task>(
      `/api/v1/tasks/${encodeURIComponent(taskId)}`
    );
  }

  async createTask(input: {
    title: string;
    input: string;
    priority?: "low" | "normal" | "high" | "critical";
  }): Promise<ApiResponse<Task>> {
    return this.request<Task>("/api/v1/tasks", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  async cancelTask(
    taskId: string
  ): Promise<ApiResponse<Task>> {
    return this.request<Task>(
      `/api/v1/tasks/${encodeURIComponent(taskId)}/cancel`,
      {
        method: "POST",
      }
    );
  }
}
