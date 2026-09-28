export type AgentTeam =
  | "language"
  | "location"
  | "mobility"
  | "legal"
  | "health"
  | "housing"
  | "work"
  | "education"
  | "services"
  | "travel"
  | "documents"
  | "safety"
  | "finance"
  | "family"
  | "general"
  | "orchestration";

export type AgentDefinition = {
  id: string;
  name: string;
  team: AgentTeam;
  description: string;
  priority: number;
};

export const AGENTS: AgentDefinition[] = [
  { id: "language", name: "Language & Translation Agent", team: "language", description: "Explains and translates the local language into the user's preferred language, including letters, signs, forms and everyday conversations.", priority: 1 },
  { id: "local-guide", name: "Local Guide Agent", team: "location", description: "Helps a newcomer understand places, neighborhoods, opening hours, nearby services and practical local orientation.", priority: 1 },
  { id: "transport", name: "Transport Agent", team: "mobility", description: "Explains public transport, routes, tickets, connections and travel steps; asks for location and date/time when those details matter.", priority: 1 },
  { id: "legal", name: "Legal Information Agent", team: "legal", description: "Provides general legal information and practical next steps, clearly distinguishing general guidance from professional legal advice.", priority: 1 },
  { id: "immigration", name: "Immigration & Residency Agent", team: "legal", description: "Helps with residence, visas, immigration offices, appointments and immigration documents using cautious, jurisdiction-specific guidance.", priority: 1 },
  { id: "health", name: "Health Agent", team: "health", description: "Provides general health guidance, helps identify appropriate care pathways and clearly escalates urgent or emergency situations.", priority: 1 },
  { id: "emergency", name: "Emergency & Crisis Agent", team: "safety", description: "Handles urgent safety situations and directs users toward appropriate emergency services and immediate protective actions.", priority: 0 },
  { id: "housing", name: "Housing Agent", team: "housing", description: "Helps newcomers understand renting, accommodation, landlords, deposits, utilities and housing-related practical steps.", priority: 2 },
  { id: "work-finance", name: "Work & Finance Agent", team: "work", description: "Helps with jobs, employment basics, wages, banking, everyday financial questions and practical work-related processes.", priority: 2 },
  { id: "education", name: "Education Agent", team: "education", description: "Helps students, parents and newcomers understand schools, universities, courses, language learning and education procedures.", priority: 2 },
  { id: "public-services", name: "Public Services Agent", team: "services", description: "Explains government offices, appointments, registrations, forms and everyday administrative procedures.", priority: 1 },
  { id: "travel", name: "Travel & Tourism Agent", team: "travel", description: "Helps tourists and visitors with attractions, local customs, practical travel planning and destination information.", priority: 2 },
  { id: "documents", name: "Document & Letter Agent", team: "documents", description: "Explains official letters, forms, notices and documents in plain language and identifies practical next actions.", priority: 1 },
  { id: "safety", name: "Safety & Scam Agent", team: "safety", description: "Identifies common scams, unsafe requests, suspicious messages and practical personal-safety concerns.", priority: 1 },
  { id: "family", name: "Family & Daily Life Agent", team: "family", description: "Helps families and individuals with childcare, daily-life services, appointments and practical settlement questions.", priority: 2 },
  { id: "general", name: "General HELP-ME Agent", team: "general", description: "Handles questions that do not clearly belong to one specialist and provides a concise practical first answer.", priority: 5 },
  { id: "orchestrator", name: "AI Orchestrator", team: "orchestration", description: "Understands the user's situation, selects the smallest useful set of specialists and combines their findings into one clear answer.", priority: 0 },
];

const ROUTES: Array<{ ids: string[]; keywords: string[] }> = [
  { ids: ["emergency", "safety"], keywords: ["emergency", "urgent", "danger", "police", "ambulance", "fire", "notruf", "112", "110", "hilfe sofort", "طوارئ", "شرطة", "اسعاف", "خطر", "نجدة"] },
  { ids: ["transport", "local-guide"], keywords: ["train", "bus", "tram", "metro", "bahn", "zug", "ticket", "station", "route", "connection", "fahrplan", "مواصلات", "قطار", "باص", "محطة", "طريق", "تذكرة"] },
  { ids: ["immigration", "public-services"], keywords: ["visa", "residence", "residency", "immigration", "ausländer", "aufenthalt", "asylum", "passport", "إقامة", "فيزا", "هجرة", "لجوء", "جواز"] },
  { ids: ["legal", "documents"], keywords: ["law", "legal", "lawyer", "contract", "court", "recht", "gesetz", "anwalt", "vertrag", "gericht", "قانون", "محامي", "عقد", "محكمة"] },
  { ids: ["health", "emergency"], keywords: ["doctor", "hospital", "pharmacy", "arzt", "krankenhaus", "apotheke", "sick", "pain", "مريض", "طبيب", "مستشفى", "صيدلية", "ألم"] },
  { ids: ["housing", "public-services"], keywords: ["rent", "rental", "apartment", "flat", "landlord", "wohnung", "miete", "vermieter", "سكن", "إيجار", "شقة", "مالك"] },
  { ids: ["work-finance"], keywords: ["job", "work", "salary", "bank", "money", "employment", "arbeit", "jobcenter", "gehalt", "bankkonto", "عمل", "وظيفة", "راتب", "بنك"] },
  { ids: ["education", "language"], keywords: ["school", "university", "course", "study", "student", "schule", "universität", "kurs", "studium", "مدرسة", "جامعة", "دراسة", "دورة"] },
  { ids: ["language", "documents"], keywords: ["translate", "translation", "letter", "message", "german", "english", "übersetzen", "brief", "nachricht", "ترجم", "ترجمة", "رسالة", "لغة"] },
  { ids: ["travel", "local-guide"], keywords: ["tourist", "tourism", "visit", "hotel", "attraction", "museum", "urlaub", "reise", "سائح", "سياحة", "زيارة", "فندق", "متحف"] },
  { ids: ["family", "public-services"], keywords: ["child", "children", "family", "daycare", "kindergarten", "familie", "kinder", "kita", "أطفال", "طفل", "عائلة", "حضانة"] },
  { ids: ["safety"], keywords: ["scam", "fraud", "suspicious", "phishing", "betrug", "احتيال", "نصب", "مشبوه", "تصيد"] },
  { ids: ["local-guide"], keywords: ["near me", "nearby", "open now", "opening hours", "near", "in my area", "in der nähe", "geöffnet", "قريب", "بالقرب", "مفتوح"] },
];

function uniqueAgents(ids: string[]): AgentDefinition[] {
  return ids
    .map((id) => AGENTS.find((agent) => agent.id === id))
    .filter((agent): agent is AgentDefinition => Boolean(agent));
}

export function routeTask(input: string): AgentDefinition[] {
  const text = input.toLowerCase();
  const selected: string[] = [];

  for (const route of ROUTES) {
    if (route.keywords.some((keyword) => text.includes(keyword))) {
      selected.push(...route.ids);
      if (selected.length >= 4) break;
    }
  }

  const agents = uniqueAgents(selected).sort((a, b) => a.priority - b.priority).slice(0, 4);
  return agents.length > 0 ? agents : [AGENTS.find((agent) => agent.id === "general")!];
}
