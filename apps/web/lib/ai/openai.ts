import OpenAI from "openai";
import { createRoutingPlan } from "./orchestrator";

export type AIExecutionResult = {
  answer: string;
  agents: string[];
};

export async function executeAI(
  input: string,
  language = "de",
): Promise<AIExecutionResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  // Keep the first production chat path deliberately simple and reliable:
  // one Responses API call. Specialist-agent fan-out can be enabled later
  // after the basic user conversation path is proven in production.
  const client = new OpenAI({
    apiKey,
    maxRetries: 2,
  });

  const plan = createRoutingPlan({ input, language });
  const model = process.env.OPENAI_MODEL || "gpt-5-mini";

  const response = await client.responses.create({
    model,
    instructions: [
      "You are HELP-ME, a practical multilingual assistant for people living, working, travelling, or settling in a foreign country.",
      `Answer in the user's requested language: ${language}.`,
      "Be clear, practical, respectful, and concise.",
      "Do not claim that you completed an external action unless it was actually completed.",
      "When a question depends on current local information, explain what information is needed to verify it.",
    ].join("\n"),
    input,
  });

  const answer = response.output_text?.trim();
  if (!answer) {
    throw new Error("OpenAI returned an empty response");
  }

  return {
    answer,
    agents: plan.agents.map((agent) => agent.id),
  };
}
