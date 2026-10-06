import Link from "next/link";

const cards = [
  ["01", "AI Assistant", "Configure the customer-facing assistant."],
  ["02", "Knowledge Base", "Add FAQs, website content and documents."],
  ["03", "Conversations", "Review customer questions and responses."],
  ["04", "Usage & Plans", "Track usage before billing is connected."]
];

export default function DashboardPage() {
  return (
    <main className="dashboard-page">
      <nav className="nav shell">
        <Link className="brand" href="/"><span className="brand-mark">H</span><span>HELP-ME</span></Link>
        <Link className="button secondary" href="/">Back to site</Link>
      </nav>
      <section className="dashboard shell">
        <div className="dashboard-head">
          <div><span className="eyebrow">BUSINESS DASHBOARD</span><h1>Control center.</h1><p>The new foundation is ready for the next development phases.</p></div>
          <span className="plan-badge">FOUNDATION · ACTIVE</span>
        </div>
        <div className="stats">
          <div><strong>0</strong><span>Conversations</span></div>
          <div><strong>0</strong><span>Knowledge items</span></div>
          <div><strong>FREE</strong><span>Development plan</span></div>
        </div>
        <div className="dashboard-grid">
          {cards.map(([num, title, text]) => <article className="dashboard-card" key={title}><span>{num}</span><h2>{title}</h2><p>{text}</p><Link href={title === "AI Assistant" ? "/chat" : "/dashboard"}>Open →</Link></article>)}
        </div>
      </section>
    </main>
  );
}
