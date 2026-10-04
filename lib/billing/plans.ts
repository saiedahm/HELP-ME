import type { PlanCode } from "@prisma/client";

export const PLAN_LIMITS: Record<PlanCode, { monthlyMessages: number; chatbots: number; knowledgeItems: number }> = {
  STARTER: { monthlyMessages: 1000, chatbots: 1, knowledgeItems: 50 },
  BUSINESS: { monthlyMessages: 5000, chatbots: 5, knowledgeItems: 250 },
  PRO: { monthlyMessages: 20000, chatbots: 20, knowledgeItems: 1000 },
};

export function currentPeriodStart(date = new Date()) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}
