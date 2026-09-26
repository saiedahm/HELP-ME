export type HelpRequest = {
  id: string;
  message: string;
  locale: string;
  createdAt: string;
};

/**
 * Persistence boundary for HELP ME requests.
 * Replace this implementation with the project's database adapter when the
 * database connection is configured. Keeping the boundary here prevents the
 * API layer from depending on a storage implementation.
 */
export async function saveHelpRequest(input: {
  message: string;
  locale?: string;
}): Promise<HelpRequest> {
  return {
    id: crypto.randomUUID(),
    message: input.message,
    locale: input.locale ?? "de",
    createdAt: new Date().toISOString(),
  };
}
