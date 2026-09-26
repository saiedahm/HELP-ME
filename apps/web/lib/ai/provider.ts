export type AiMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type AiProviderResult = {
  content: string;
  provider: string;
  model: string;
};

export async function generateAiReply(messages: AiMessage[]): Promise<AiProviderResult> {
  const apiKey = process.env.AI_API_KEY;

  if (!apiKey) {
    return {
      content:
        "Danke für deine Anfrage. Die KI-Verbindung ist noch nicht aktiviert. Deine Anfrage wurde sicher angenommen.",
      provider: "configuration",
      model: "pending",
    };
  }

  const endpoint = process.env.AI_API_URL;
  const model = process.env.AI_MODEL ?? "default";

  if (!endpoint) {
    throw new Error("AI_API_URL is not configured");
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, messages }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`AI provider request failed with status ${response.status}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (typeof content !== "string" || !content.trim()) {
    throw new Error("AI provider returned an invalid response");
  }

  return { content: content.trim(), provider: "configured", model };
}
