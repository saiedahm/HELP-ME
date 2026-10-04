export type AIMessage = { role: "USER" | "ASSISTANT"; content: string };

export type AIContext = {
  chatbotName: string;
  welcomeMessage: string | null;
  knowledge: { title: string; content: string }[];
};

export interface AIProvider {
  generateReply(messages: AIMessage[], context: AIContext): Promise<string>;
}
