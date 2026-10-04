"use client";

import { FormEvent, useState } from "react";

type Chatbot = {
  id: string;
  publicKey: string;
  name: string;
  welcomeMessage: string | null;
  primaryColor: string | null;
  logoUrl: string | null;
  status: "ACTIVE" | "PAUSED";
};

export default function ChatbotEditor({ chatbot }: { chatbot: Chatbot }) {
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(chatbot.name);
  const [welcomeMessage, setWelcomeMessage] = useState(chatbot.welcomeMessage ?? "");
  const [primaryColor, setPrimaryColor] = useState(chatbot.primaryColor ?? "#39d9ff");
  const [logoUrl, setLogoUrl] = useState(chatbot.logoUrl ?? "");
  const [status, setStatus] = useState(chatbot.status);

  async function save(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSaved(false);
    setLoading(true);

    const response = await fetch(`/api/chatbots/${chatbot.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, welcomeMessage, primaryColor, logoUrl, status }),
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? "Unable to save chatbot.");
      setLoading(false);
      return;
    }

    setSaved(true);
    setLoading(false);
  }

  return (
    <div className="editor-layout">
      <form className="dashboard-card auth-form" onSubmit={save}>
        <span className="badge">Settings</span>
        <label>Chatbot name<input value={name} onChange={(e) => setName(e.target.value)} required /></label>
        <label>Welcome message<textarea value={welcomeMessage} onChange={(e) => setWelcomeMessage(e.target.value)} rows={4} /></label>
        <label>Primary color<div className="color-control"><input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} /><input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} pattern="^#[0-9a-fA-F]{6}$" /></div></label>
        <label>Logo URL<input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://example.com/logo.png" /></label>
        <label>Status<select value={status} onChange={(e) => setStatus(e.target.value as "ACTIVE" | "PAUSED")}><option value="ACTIVE">Active</option><option value="PAUSED">Paused</option></select></label>
        {error && <p className="form-error">{error}</p>}
        {saved && <p className="success-message">Chatbot settings saved.</p>}
        <button className="button primary" type="submit" disabled={loading}>{loading ? "Saving…" : "Save changes"}</button>
      </form>

      <aside className="dashboard-card preview-card">
        <span className="badge">Live preview</span>
        <h2>Website chat</h2>
        <div className="chat-preview" style={{ borderColor: primaryColor }}>
          <div className="chat-preview-header" style={{ background: primaryColor }}>
            <div className="preview-avatar">{logoUrl ? <img src={logoUrl} alt="" /> : "H"}</div>
            <strong>{name || "HELP-ME"}</strong>
          </div>
          <div className="chat-preview-body">
            <div className="preview-message">{welcomeMessage || "Hello! How can I help you today?"}</div>
            <div className="preview-input">Type your message…</div>
          </div>
        </div>
      </aside>
      <section className="dashboard-card embed-panel">
        <span className="badge">Website integration</span>
        <h2>Embed your assistant</h2>
        <p className="muted">Add this small script to your website. Your secret AI credentials never go into the browser.</p>
        <pre className="embed-code">{`<script src="/widget.js" data-bot="${chatbot.publicKey}"></script>`}</pre>
        <button className="button" type="button" onClick={() => navigator.clipboard.writeText(`<script src="/widget.js" data-bot="${chatbot.publicKey}"></script>`)}>Copy embed code</button>
      </section>
    </div>
  );
}
