import type { PlanCode } from "@prisma/client";
import { PLAN_LIMITS, currentPeriodStart } from "@/lib/billing/plans";

export async function getUsageState(prisma: any, organizationId: string, plan: PlanCode) {
  const periodStart = currentPeriodStart();
  const usage = await prisma.usage.upsert({
    where: { organizationId },
    create: { organizationId, periodStart },
    update: {},
  });

  if (usage.periodStart.getTime() < periodStart.getTime()) {
    const reset = await prisma.usage.update({ where: { organizationId }, data: { periodStart, messages: 0, conversations: 0 } });
    return { usage: reset, limit: PLAN_LIMITS[plan].monthlyMessages, allowed: true };
  }

  return { usage, limit: PLAN_LIMITS[plan].monthlyMessages, allowed: usage.messages < PLAN_LIMITS[plan].monthlyMessages };
}
