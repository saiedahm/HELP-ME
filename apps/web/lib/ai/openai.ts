import OpenAI from "openai";
import { buildAgentPrompt, buildOrchestratorPrompt, createRoutingPlan } from "./orchestrator";
import type { AgentDefinition } from "./agents";

export type AIExecutionResult = {
  answer: string;
  agents: string[];
};

async function runAgent(
  client: OpenAI,
  input: string,
  language: string,
  agent: AgentDefinition,
) {
  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-5-mini",
    instructions: buildAgentPrompt({ input, language }, agent),
    input,
  });
  return { agent, output: response.output_text };
}

export async function executeAI(input: string, language = "de"): Promise<AIExecutionResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  // Create the SDK client only when the API route is actually executed.
  // This prevents Next.js/Vercel build-time page-data collection from
  // failing when the production secret is not available during build.
  const client = new OpenAI({ apiKey });

  const plan = createRoutingPlan({ input, language });
  const results = await Promise.all(
    plan.agents.map((agent) => runAgent(client, input, language, agent)),
  );
  const findings = results
    .map(({ agent, output }) => `### ${agent.name}\n${output}`)
    .join("\n\n");

  const finalResponse = await client.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-5-mini",
    instructions: buildOrchestratorPrompt({ input, language }, plan.agents),
    input: `User request:\n${input}\n\nSpecialist findings:\n${findings}`,
  });

  return {
    answer: finalResponse.output_text,
    agents: results.map(({ agent }) => agent.id),
  };
}
