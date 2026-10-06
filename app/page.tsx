import Link from "next/link";

const features = [
  ["AI Assistance", "Give customers fast, clear answers through an intelligent support experience."],
  ["Knowledge Base", "Connect business information, FAQs, websites and documents to your assistant."],
  ["Business Dashboard", "Manage conversations, usage, plans and customer support from one secure place."],
  ["Human Handoff", "Keep the human team in the loop when an automated answer is not enough."]
];

export default function HomePage() {
  return (
    <main>
      <nav className="nav shell">
        <Link className="brand" href="/">
          <span className="brand-mark">H</span>
          <span>HELP-ME</span>
        </Link>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#business">Business</a>
          <Link href="/chat">Try AI</Link>
          <Link className="nav-button" href="/dashboard">Dashboard</Link>
        </div>
      </nav>

      <section className="hero shell">
        <div className="hero-copy">
          <span className="eyebrow">SECURE AI ASSISTANCE PLATFORM</span>
          <h1>Help your customers.<br /><span>Smarter.</span></h1>
          <p>
            HELP-ME gives businesses a modern AI support layer for answering questions,
            guiding visitors and connecting customers with the right human help.
          </p>
          <div className="hero-actions">
            <Link className="button primary" href="/chat">Try HELP-ME</Link>
            <Link className="button secondary" href="#business">For Business</Link>
          </div>
          <div className="trust-row">
            <span>● Secure foundation</span><span>● Multi-tenant ready</span><span>● Vercel ready</span>
          </div>
        </div>
        <div className="hero-card">
          <div className="glow-orb" />
          <div className="assistant-window">
            <div className="assistant-head"><span className="status-dot" /> HELP-ME Assistant <small>Online</small></div>
            <div className="message bot">Hello! How can I help you today?</div>
            <div className="message user">I need help understanding a service.</div>
            <div className="message bot">Of course. Tell me what you need and I’ll guide you step by step.</div>
            <div className="input-demo">Ask anything… <span>→</span></div>
          </div>
        </div>
      </section>

      <section id="features" className="section shell">
        <div className="section-heading">
          <span className="eyebrow">ONE PLATFORM</span>
          <h2>Built for helpful conversations.</h2>
          <p>A clean foundation first. Powerful business features next.</p>
        </div>
        <div className="feature-grid">
          {features.map(([title, text]) => (
            <article className="feature-card" key={title}>
              <div className="feature-icon">{title[0]}</div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="business" className="business-banner shell">
        <div>
          <span className="eyebrow">HELP-ME BUSINESS</span>
          <h2>Your website. Your knowledge. Your assistant.</h2>
          <p>Prepare one secure AI layer for stores, clinics, service providers and growing companies.</p>
        </div>
        <Link className="button primary" href="/dashboard">Open Dashboard</Link>
      </section>

      <footer className="footer shell">
        <span>© 2026 HELP-ME</span>
        <span>Foundation build updated from main.</span>
      </footer>
    </main>
  );
}
