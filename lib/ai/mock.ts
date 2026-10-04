import type { AIContext, AIMessage, AIProvider } from "./provider";

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\u0600-\u06ff\s]/gi, " ").replace(/\s+/g, " ").trim();
}

export const mockAI: AIProvider = {
  async generateReply(messages: AIMessage[], context: AIContext) {
    const last = messages.at(-1)?.content?.trim() ?? "";
    if (!last) return context.welcomeMessage || `Hello! I’m ${context.chatbotName}. How can I help you?`;

    const query = normalize(last);
    const match = context.knowledge.find((item) => {
      const words = normalize(item.title).split(" ").filter((word) => word.length > 3);
      return words.some((word) => query.includes(word));
    });

    if (match) {
      return `Based on our information about “${match.title}”: ${match.content.slice(0, 700)}`;
    }

    if (/\b(hello|hi|hey|مرحبا|اهلا|أهلا|سلام)\b/i.test(query)) {
      return `Hello! I’m ${context.chatbotName}. How can I help you today?`;
    }

    return `Thanks for your message. I’m ${context.chatbotName}. I’m still learning this company’s knowledge base. Please add more information or ask a member of the team for help.`;
  },
};
