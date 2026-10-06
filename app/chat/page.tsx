"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

type Message = { role: "user" | "assistant"; content: string };

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I’m HELP-ME. What can I help you with?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send(event: FormEvent) {
    event.preventDefault();
    const content = input.trim();
    if (!content || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content }]);
    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: content })
      });
      const data = await response.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply ?? "Please try again." }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "The assistant is temporarily unavailable." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="chat-page">
      <div className="chat-shell">
        <header className="chat-top">
          <Link className="brand" href="/"><span className="brand-mark">H</span><span>HELP-ME</span></Link>
          <span className="online-pill"><i /> Mock AI Online</span>
        </header>
        <section className="chat-panel">
          <div className="chat-title"><span className="eyebrow">DEMO ASSISTANT</span><h1>How can we help?</h1><p>This demo uses the free Mock AI provider.</p></div>
          <div className="messages">
            {messages.map((message, index) => <div className={`chat-message ${message.role}`} key={index}>{message.content}</div>)}
            {loading && <div className="chat-message assistant">Thinking…</div>}
          </div>
          <form className="chat-input" onSubmit={send}>
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask HELP-ME anything…" aria-label="Message" />
            <button className="button primary" type="submit">Send</button>
          </form>
        </section>
      </div>
    </main>
  );
}
