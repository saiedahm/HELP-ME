import Link from "next/link";

const features = [
  { icon: "ϟ", title: "Fast Support", detail: "Get answers instantly" },
  { icon: "♧", title: "Smart AI", detail: "Accurate & helpful" },
  { icon: "⬡", title: "Secure", detail: "Your data is safe" },
  { icon: "◎", title: "Multi-Language", detail: "20 languages" }
];

function Brand() {
  return <Link href="/" className="brand" aria-label="HELP-ME Home">
    <span className="brand-globe" aria-hidden="true"><span>🌍</span></span>
    <span className="brand-word">HELP<span>-ME</span></span>
  </Link>;
}

export default function HomePage() {
  return <main className="landing">
    <header className="landing-header">
      <Brand />
      <nav className="landing-nav" aria-label="Main navigation">
        <a className="active" href="#home">Home</a>
        <a href="#features">Features</a>
        <a href="#business">Business</a>
        <a href="#pricing">Pricing</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </nav>
      <div className="header-actions">
        <div className="language-hint">◎ <span>Language</span>⌄</div>
        <Link className="header-login" href="/login">♙ &nbsp;Login</Link>
        <Link className="header-register" href="/register">♙ &nbsp;Register</Link>
      </div>
    </header>

    <section className="landing-hero" id="home">
      <div className="landing-copy">
        <div className="landing-eyebrow"><span />YOUR AI SUPPORT PLATFORM<span /></div>
        <h1>HELP-ME</h1>
        <h2>Your <em>Smart</em> AI Assistant</h2>
        <p>Get instant help, ask questions, and find the right answers. HELP-ME is your intelligent support platform for businesses, customers and everyone who needs fast, reliable and friendly assistance.</p>
        <div className="landing-ctas">
          <Link className="start-button" href="/chat">➜ &nbsp; Start Now</Link>
          <a className="video-button" href="#about"><span>▶</span> Watch Video</a>
        </div>
        <div className="benefits" id="features">
          {features.map(item => <div className="benefit" key={item.title}>
            <span className="benefit-icon">{item.icon}</span>
            <strong>{item.title}</strong>
            <small>{item.detail}</small>
          </div>)}
        </div>
      </div>

      <div className="landing-visual" aria-label="HELP-ME intelligent global AI assistant">
        <div className="city-glow" />
        <div className="orbit orbit-one" /><div className="orbit orbit-two" />
        <div className="digital-globe">
          <div className="globe-grid" />
          <span className="globe-continents">🌍</span>
          <div className="globe-word">HELP-ME</div>
        </div>
        <div className="tech-tile tile-ai">AI<br/><b>▦</b></div>
        <div className="tech-tile tile-cloud">☁</div>
        <div className="tech-tile tile-chat">☏</div>
        <div className="tech-tile tile-safe">♢</div>
        <div className="tech-tile tile-people">♧</div>
        <div className="chat-demo">
          <div className="chat-demo-head"><span className="online-dot" /> <b>HELP-ME Assistant</b><small>Online</small></div>
          <div className="demo-bubble">Hello! How can I help you today?</div>
          <div className="demo-bubble user-bubble">I need help understanding a service.</div>
          <div className="demo-bubble">Of course. Tell me what you need and I’ll guide you step by step.</div>
          <Link href="/chat" className="demo-input">Ask anything... <span>➜</span></Link>
        </div>
      </div>
    </section>

    <footer className="landing-footer" id="contact">
      <Brand />
      <a href="https://www.nexoraonline.de" className="footer-link">↗ &nbsp; www.nexoraonline.de</a>
      <a href="mailto:info@nexoraonline.de" className="footer-link">✉ &nbsp; info@nexoraonline.de</a>
      <nav className="legal-links" aria-label="Legal links">
        <Link href="/widerruf">Widerruf</Link><i>|</i><Link href="/agb">AGB</Link><i>|</i><Link href="/datenschutz">Datenschutz</Link><i>|</i><Link href="/impressum">Impressum</Link><i>|</i><Link href="/cookie-einstellungen">Cookie-Einstellungen</Link>
      </nav>
      <small className="copyright">© 2026 HELP-ME. All rights reserved.</small>
    </footer>
    <div id="business" className="sr-only">HELP-ME Business</div><div id="pricing" className="sr-only">Pricing</div><div id="about" className="sr-only">About HELP-ME</div>
  </main>;
}
