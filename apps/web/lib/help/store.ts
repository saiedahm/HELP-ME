export type HelpRequest = {
  id: string;
  message: string;
  locale: string;
  createdAt: string;
};

const MAX_STORED_REQUESTS = 1000;
const MAX_MESSAGE_LENGTH = 5000;
const MAX_LOCALE_LENGTH = 32;

const globalStore = globalThis as typeof globalThis & {
  __helpMeRequests?: HelpRequest[];
};

const requests =
  globalStore.__helpMeRequests ??
  (globalStore.__helpMeRequests = []);

function normalizeLocale(locale?: string): string {
  const value = typeof locale === "string" ? locale.trim() : "de";
  return (value || "de").slice(0, MAX_LOCALE_LENGTH);
}

function normalizeMessage(message: string): string {
  return message.trim().slice(0, MAX_MESSAGE_LENGTH);
}

/**
 * Temporary server-side request store.
 * This adapter intentionally keeps persistence behind a small API so it can
 * be replaced by PostgreSQL without changing the HELP ME API contract.
 */
export async function saveHelpRequest(input: {
  message: string;
  locale?: string;
}): Promise<HelpRequest> {
  const message = normalizeMessage(input.message);

  if (!message) {
    throw new Error("Message is required");
  }

  const request: HelpRequest = {
    id: crypto.randomUUID(),
    message,
    locale: normalizeLocale(input.locale),
    createdAt: new Date().toISOString(),
  };

  requests.unshift(request);

  if (requests.length > MAX_STORED_REQUESTS) {
    requests.length = MAX_STORED_REQUESTS;
  }

  return request;
}

export async function getHelpRequests(): Promise<HelpRequest[]> {
  return requests.map((request) => ({ ...request }));
}
