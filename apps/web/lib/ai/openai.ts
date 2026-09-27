import OpenAI from "openai";
import { buildAgentPrompt, buildOrchestratorPrompt, createRoutingPlan } from "./orchestrator";
import type { AgentDefinition } from "./agents";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export type AIExecutionResult = {
  answer: string;
  agents: string[];
};

async function runAgent(input: string, language: string, agent: AgentDefinition) {
  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-5-mini",
    instructions: buildAgentPrompt({ input, language }, agent),
    input,
  });
  return { agent, output: response.output_text };
}

export async function executeAI(input: string, language = "de"): Promise<AIExecutionResult> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const plan = createRoutingPlan({ input, language });
  const results = await Promise.all(plan.agents.map((agent) => runAgent(input, language, agent)));
  const findings = results.map(({ agent, output }) => `### ${agent.name}\n${output}`).join("\n\n");

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
