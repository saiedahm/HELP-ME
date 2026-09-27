export type AgentTeam = "development" | "design" | "content" | "research" | "security";

export type AgentDefinition = {
  id: string;
  name: string;
  team: AgentTeam;
  description: string;
  priority: number;
};

export const AGENTS: AgentDefinition[] = [
  { id: "architect", name: "Software Architect", team: "development", description: "Plans software architecture and implementation paths.", priority: 1 },
  { id: "frontend", name: "Frontend Developer", team: "development", description: "Handles UI and client-side implementation.", priority: 2 },
  { id: "backend", name: "Backend/API Developer", team: "development", description: "Handles APIs, server logic and integrations.", priority: 2 },
  { id: "code-reviewer", name: "Code Reviewer", team: "development", description: "Reviews implementation quality and regressions.", priority: 3 },
  { id: "uiux", name: "UI/UX Designer", team: "design", description: "Plans interfaces and user experience.", priority: 1 },
  { id: "website-builder", name: "Website Builder", team: "design", description: "Turns approved designs into web experiences.", priority: 2 },
  { id: "seo", name: "SEO Specialist", team: "design", description: "Optimizes discoverability and page structure.", priority: 3 },
  { id: "accessibility", name: "Accessibility Specialist", team: "design", description: "Checks accessibility and inclusive interaction.", priority: 3 },
  { id: "writer", name: "Content Writer", team: "content", description: "Creates clear, useful platform content.", priority: 1 },
  { id: "translator", name: "Translator", team: "content", description: "Localizes content while preserving meaning and tone.", priority: 2 },
  { id: "editor", name: "Editor/Proofreader", team: "content", description: "Reviews language, consistency and clarity.", priority: 3 },
  { id: "researcher", name: "Researcher", team: "research", description: "Breaks down research tasks and evidence needs.", priority: 1 },
  { id: "analyst", name: "Data Analyst", team: "research", description: "Analyzes structured information and findings.", priority: 2 },
  { id: "fact-checker", name: "Fact Checker", team: "research", description: "Checks claims against available evidence.", priority: 3 },
  { id: "security", name: "Security Agent", team: "security", description: "Identifies security risks and unsafe configurations.", priority: 1 },
  { id: "tester", name: "Testing Agent", team: "security", description: "Plans and validates functional test coverage.", priority: 2 },
  { id: "performance", name: "Performance Agent", team: "security", description: "Identifies performance bottlenecks and optimization opportunities.", priority: 2 },
  { id: "orchestrator", name: "AI Orchestrator", team: "development", description: "Routes requests to the smallest useful set of specialist agents.", priority: 0 },
];

const TEAM_KEYWORDS: Record<Exclude<AgentTeam, "development">, string[]> = {
  design: ["design", "ui", "ux", "website", "web site", "layout", "logo", "interface", "تصميم", "موقع"],
  content: ["content", "write", "translation", "translate", "language", "text", "محتوى", "ترجمة", "لغة", "نص"],
  research: ["research", "analyze", "analysis", "data", "compare", "بحث", "تحليل", "بيانات", "مقارنة"],
  security: ["security", "secure", "test", "testing", "performance", "speed", "bug", "حماية", "اختبار", "سرعة", "خطأ"],
};

export function routeTask(input: string): AgentDefinition[] {
  const text = input.toLowerCase();
  const selectedTeams = new Set<AgentTeam>();

  for (const [team, keywords] of Object.entries(TEAM_KEYWORDS) as [Exclude<AgentTeam, "development">, string[]][]) {
    if (keywords.some((keyword) => text.includes(keyword))) selectedTeams.add(team);
  }

  const developmentKeywords = ["code", "coding", "program", "api", "database", "bug", "build", "developer", "برمجة", "كود", "api", "قاعدة"];
  if (developmentKeywords.some((keyword) => text.includes(keyword))) selectedTeams.add("development");

  if (selectedTeams.size === 0) return [AGENTS.find((agent) => agent.id === "researcher")!];

  const agents = AGENTS.filter((agent) => selectedTeams.has(agent.team) && agent.id !== "orchestrator");
  return agents.sort((a, b) => a.priority - b.priority).slice(0, 4);
}
