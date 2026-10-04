"use client";

import { useState } from "react";

export default function WidgetPage({ params }: { params: { publicKey: string } }) {
  const [messages, setMessages] = useState<{ role: "USER" | "ASSISTANT"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState("");
  const [loading, setLoading] = useState(false);
  const [handoff, setHandoff] = useState(false);

  async function send() {
    const message = input.trim();
    if (!message || loading) return;
    setInput("");
    setMessages((items) => [...items, { role: "USER", content: message }]);
    setLoading(true);
    const response = await fetch("/api/widget/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ publicKey: params.publicKey, conversationId: conversationId || undefined, message }) });
    const data = await response.json();
    setMessages((items) => [...items, { role: "ASSISTANT", content: response.ok ? data.reply : (data.error ?? "Sorry, something went wrong.") }]);
    if (response.ok) setConversationId(data.conversationId);
    setLoading(false);
  }

  async function requestHuman() {
    if (!conversationId || handoff) return;
    const response = await fetch("/api/widget/handoff", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ publicKey: params.publicKey, conversationId }) });
    if (response.ok) setHandoff(true);
  }

  return (
    <div style={{ height: "100vh", background: "transparent", fontFamily: "Inter,system-ui,sans-serif" }}>
      <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden", borderRadius: 18, background: "#0b1422", color: "#f5f8fc", border: "1px solid rgba(255,255,255,.1)" }}>
        <div style={{ padding: "14px 16px", fontWeight: 800, borderBottom: "1px solid rgba(255,255,255,.1)" }}>HELP-ME Assistant <button onClick={requestHuman} disabled={!conversationId || handoff} style={{ float:"right", border:0, background:"transparent", color:"#39d9ff", cursor:"pointer", fontSize:12 }}>{handoff ? "Human requested" : "Talk to a human"}</button></div>
        <div style={{ flex: 1, overflow: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
          {messages.length === 0 && <div style={{ padding: 12, borderRadius: 14, background: "rgba(255,255,255,.06)" }}>Hello! How can I help you today?</div>}
          {messages.map((m, i) => <div key={i} style={{ alignSelf: m.role === "USER" ? "flex-end" : "flex-start", maxWidth: "82%", padding: "10px 12px", borderRadius: 14, background: m.role === "USER" ? "#39d9ff" : "rgba(255,255,255,.07)", color: m.role === "USER" ? "#031018" : "#f5f8fc" }}>{m.content}</div>)}
          {loading && <div style={{ padding: 12, color: "#9aa9bc" }}>Thinking…</div>}
        </div>
        <div style={{ display: "flex", gap: 8, padding: 10, borderTop: "1px solid rgba(255,255,255,.1)" }}>
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Type your message…" style={{ minWidth: 0, flex: 1, padding: "11px 12px", borderRadius: 10, border: "1px solid rgba(255,255,255,.12)", background: "rgba(0,0,0,.2)", color: "#fff", outline: "none" }} />
          <button onClick={send} disabled={loading} style={{ border: 0, borderRadius: 10, padding: "0 15px", background: "#39d9ff", color: "#031018", fontWeight: 800 }}>Send</button>
        </div>
      </div>
    </div>
  );
}
