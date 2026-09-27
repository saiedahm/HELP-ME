import { AGENTS, routeTask, type AgentDefinition } from "./agents";

export type AgentTask = {
  input: string;
  language?: string;
};

export type RoutingPlan = {
  orchestrator: AgentDefinition;
  agents: AgentDefinition[];
  parallel: boolean;
};

export function createRoutingPlan(task: AgentTask): RoutingPlan {
  const agents = routeTask(task.input);
  return {
    orchestrator: AGENTS.find((agent) => agent.id === "orchestrator")!,
    agents,
    parallel: agents.length > 1,
  };
}

export function buildAgentPrompt(task: AgentTask, agent: AgentDefinition): string {
  const language = task.language || "the user's language";
  return [
    `You are the ${agent.name} in the HELP-ME platform.`,
    `Role: ${agent.description}`,
    `Respond in ${language}.`,
    "Work only within your specialist role.",
    "Return concise, actionable findings that another agent can combine.",
    `User request:\n${task.input}`,
  ].join("\n\n");
}

export function buildOrchestratorPrompt(task: AgentTask, agents: AgentDefinition[]): string {
  return [
    "You are the HELP-ME AI Orchestrator.",
    "Select and coordinate specialist work; do not invent completed work.",
    `Language: ${task.language || "the user's language"}.`,
    `Selected specialists: ${agents.map((agent) => agent.name).join(", ")}.`,
    "Combine specialist findings into one clear response for the user.",
    "Avoid duplicate work and keep the final answer focused.",
    `User request:\n${task.input}`,
  ].join("\n\n");
}
