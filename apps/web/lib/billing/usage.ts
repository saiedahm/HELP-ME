export type UsageState = {
  used: number;
  limit: number;
  remaining: number;
};

export function getUsageState(used: number, limit: number): UsageState {
  const safeUsed = Math.max(0, Math.floor(used));
  const safeLimit = Math.max(0, Math.floor(limit));
  return {
    used: safeUsed,
    limit: safeLimit,
    remaining: Math.max(0, safeLimit - safeUsed),
  };
}

export function canUseAI(used: number, limit: number) {
  return Math.max(0, Math.floor(used)) < Math.max(0, Math.floor(limit));
}
