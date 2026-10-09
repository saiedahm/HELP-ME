import Link from "next/link";

const features = [
  ["AI Assistance", "Give customers fast, clear answers through an intelligent support experience."],
  ["Knowledge Base", "Connect business information, FAQs, websites and documents to your assistant."],
  ["Business Dashboard", "Manage conversations, usage, plans and customer support from one secure place."],
  ["Human Handoff", "Keep the human team in the loop when an automated answer is not enough."]
];

function BrandLogo() {
  return (
    <Link className="brand" href="/" aria-label="HELP-ME homepage">
      <span className="brand-emblem" aria-hidden="true">
        <svg viewBox="0 0 100 100" role="img">
          <defs>
            <linearGradient id="brandGlow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#49d7ff" />
              <stop offset="100%" stopColor="#ffbf55" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="44" fill="#071326" stroke="url(#brandGlow)" strokeWidth="3" />
          <circle cx="50" cy="50" r="34" fill="none" stroke="#49d7ff" strokeOpacity=".6" strokeWidth="1.5" />
          <ellipse cx="50" cy="50" rx="16" ry="34" fill="none" stroke="#49d7ff" strokeOpacity=".65" strokeWidth="1.5" />
          <path d="M17 40H83M14 51H86M18 62H82" stroke="#49d7ff" strokeOpacity=".6" strokeWidth="1.5" />
          <path d="M39 36V64M39 50H59M59 36V64" stroke="url(#brandGlow)" strokeWidth="6" strokeLinecap="round" fill="none" />
        </svg>
      </span>
      <span className="brand-word">HELP-ME</span>
    </Link>
  );
}

export default function HomePage() {
  return (
    <main>
      <nav className="nav shell">
        <BrandLogo />
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#business">Business</a>
          <Link href="/chat">Try AI</Link>
          <Link className="nav-button" href="/login">Log in</Link>
          <Link className="nav-button nav-signup" href="/signup">Get started</Link>
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
            <span>● Secure foundation</span><span>● Multi-tenant ready</span><span>● AI-powered support</span>
          </div>
        </div>
        <div className="hero-card" aria-label="HELP-ME global AI support visual">
          <div className="hero-art">
            <div className="art-ring" />
            <div className="art-globe"><span>HELP</span><b>ME</b></div>
            <div className="art-circuit circuit-left">✦ ━━━━━ ●<br />✧ ━━━━━ ●<br />✦ ━━━━━ ●</div>
            <div className="art-circuit circuit-right">● ━━━━━ ✦<br />● ━━━━━ ✧<br />● ━━━━━ ✦</div>
            <div className="art-caption">GLOBAL INTELLIGENCE · HUMAN CONNECTION</div>
          </div>
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
          <p>A secure AI support platform for businesses and their customers.</p>
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
          <p>For stores, clinics, service providers and growing companies.</p>
        </div>
        <Link className="button primary" href="/dashboard">Open Dashboard</Link>
      </section>

      <footer className="footer shell">
        <div className="footer-brand">
          <BrandLogo />
          <p>Intelligent assistance. Human connection.</p>
          <span>© 2026 HELP-ME. All rights reserved.</span>
        </div>
        <div className="footer-links" aria-label="Legal information">
          <Link href="/terms">AGB &amp; Terms</Link>
          <Link href="/privacy">Datenschutz &amp; Privacy</Link>
        </div>
        <div className="footer-contact">
          <a href="https://www.nexoraonline.de">www.nexoraonline.de</a>
          <a href="mailto:info@nexoraonline.de">info@nexoraonline.de</a>
        </div>
      </footer>
    </main>
  );
}
