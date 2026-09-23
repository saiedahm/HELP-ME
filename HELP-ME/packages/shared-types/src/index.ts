import { z } from "zod";

export const uuidSchema = z.string().uuid();

export const emailSchema = z
  .string()
  .trim()
  .email();

export const localeSchema = z
  .string()
  .trim()
  .min(2)
  .max(20);

export const timezoneSchema = z
  .string()
  .trim()
  .min(1)
  .max(100);

export const paginationSchema = z.object({
  page: z
    .number()
    .int()
    .min(1)
    .default(1),

  pageSize: z
    .number()
    .int()
    .min(1)
    .max(100)
    .default(20)
});

export const taskPrioritySchema = z.enum([
  "low",
  "normal",
  "high",
  "critical"
]);

export const taskStatusSchema = z.enum([
  "created",
  "queued",
  "planning",
  "running",
  "waiting_confirmation",
  "verifying",
  "completed",
  "failed",
  "cancelled"
]);

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1)
    .max(500),

  input: z
    .string()
    .trim()
    .min(1)
    .max(50_000),

  priority: taskPrioritySchema
    .default("normal")
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1)
    .max(500)
    .optional(),

  priority: taskPrioritySchema
    .optional()
});

export const agentExecutionRequestSchema = z.object({
  taskId: uuidSchema,

  agentId: z
    .string()
    .trim()
    .min(1)
    .max(100),

  input: z.unknown(),

  context: z
    .record(z.string(), z.unknown())
    .optional()
});

export type CreateTaskInput =
  z.infer<typeof createTaskSchema>;

export type UpdateTaskInput =
  z.infer<typeof updateTaskSchema>;

export type AgentExecutionRequestInput =
  z.infer<typeof agentExecutionRequestSchema>; 
