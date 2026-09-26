export type HelpRequest = {
  id: string;
  message: string;
  locale: string;
  createdAt: string;
};

const globalStore = globalThis as typeof globalThis & {
  __helpMeRequests?: HelpRequest[];
};

const requests = globalStore.__helpMeRequests ?? (globalStore.__helpMeRequests = []);

/**
 * Server-side persistence boundary.
 * Keeps requests available for the lifetime of the running server and leaves
 * a clean adapter point for a managed database when database credentials are
 * configured. No secrets are stored in source code.
 */
export async function saveHelpRequest(input: {
  message: string;
  locale?: string;
}): Promise<HelpRequest> {
  const request: HelpRequest = {
    id: crypto.randomUUID(),
    message: input.message,
    locale: input.locale ?? "de",
    createdAt: new Date().toISOString(),
  };

  requests.unshift(request);

  // Avoid unbounded memory growth until a managed database adapter is used.
  if (requests.length > 1000) requests.length = 1000;

  return request;
}

export async function getHelpRequests(): Promise<HelpRequest[]> {
  return [...requests];
}
