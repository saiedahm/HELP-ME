"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function ChatTestPage({ params }: { params: { id: string } }) {
  const [messages, setMessages] = useState<{ role: "USER" | "ASSISTANT"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function send(event: FormEvent) {
    event.preventDefault();
    const message = input.trim();
    if (!message || loading) return;
    setInput("");
    setError("");
    setMessages((items) => [...items, { role: "USER", content: message }]);
    setLoading(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatbotId: params.id, conversationId: conversationId || undefined, message }),
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? "Unable to send message.");
      setLoading(false);
      return;
    }

    setConversationId(data.conversationId);
    setMessages((items) => [...items, { role: "ASSISTANT", content: data.reply }]);
    setLoading(false);
  }

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div><div className="badge">HELP-ME · Mock AI</div><h1>Test your chatbot</h1><p>This is the free internal AI test environment. No paid AI provider is connected.</p></div>
        <Link className="button" href={`/dashboard/chatbots/${params.id}`}>Editor</Link>
      </header>
      <section className="chat-test">
        <div className="chat-test-messages">
          {messages.length === 0 && <div className="preview-message">Send a message to test your assistant.</div>}
          {messages.map((item, index) => <div className={item.role === "USER" ? "test-message user" : "test-message"} key={index}>{item.content}</div>)}
          {loading && <div className="test-message">Thinking…</div>}
        </div>
        <form className="chat-test-form" onSubmit={send}><input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask your chatbot…" maxLength={4000} /><button className="button primary" type="submit" disabled={loading}>Send</button></form>
        {error && <p className="form-error">{error}</p>}
      </section>
    </main>
  );
}
