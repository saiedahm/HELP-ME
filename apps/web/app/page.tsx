const features = [
  { title: "Einfach starten", text: "Beschreibe, was du brauchst. HELP ME strukturiert den nächsten sinnvollen Schritt." },
  { title: "KI-gestützte Hilfe", text: "Eine modulare Grundlage für intelligente Assistenz, Automatisierung und zukünftige Agenten." },
  { title: "Für Menschen gemacht", text: "Transparente Abläufe, verständliche Informationen und eine Oberfläche ohne unnötige Komplexität." },
];

export default function HomePage() {
  return (
    <main>
      <header className="header">
        <div className="container header-inner">
          <a className="brand" href="#top" aria-label="HELP-ME Startseite">
            <img src="/help-me-logo.png" alt="HELP-ME" style={{ width: 38, height: 38, objectFit: "contain", borderRadius: "50%", verticalAlign: "middle", marginRight: 10 }} />
            HELP ME
          </a>
          <nav className="nav" aria-label="Hauptnavigation">
            <a href="#how">So funktioniert es</a>
            <a href="#features">Funktionen</a>
            <a href="/help">Jetzt Hilfe erhalten</a>
            <a href="#contact">Kontakt</a>
          </nav>
        </div>
      </header>

      <section id="top" className="hero">
        <div className="container">
          <div className="eyebrow">HELP ME</div>
          <h1>Tell me what you need. I&apos;ll help you get it done.</h1>
          <p>Eine moderne Plattform für digitale Hilfe, intelligente Assistenz und klar geführte nächste Schritte.</p>
          <div className="actions">
            <a className="button primary" href="/help">Jetzt Hilfe erhalten</a>
            <a className="button" href="#how">Entdecken</a>
          </div>
        </div>
      </section>

      <section id="how" className="container grid">
        {features.map((feature) => (
          <article className="card" key={feature.title}>
            <h2>{feature.title}</h2>
            <p>{feature.text}</p>
          </article>
        ))}
      </section>

      <section id="features" className="container" style={{ paddingBottom: 90 }}>
        <div className="card">
          <div className="eyebrow">Plattform</div>
          <h2>Eine stabile Basis für eine globale digitale Assistenzplattform</h2>
          <p>Web-App, API-Client, gemeinsame Typen, Lokalisierung und Validierung bleiben modular organisiert. So können Authentifizierung, Datenbank, KI-Dienste, Zahlungen und weitere Funktionen sauber angebunden werden.</p>
        </div>
      </section>

      <section id="contact" className="container" style={{ paddingBottom: 90 }}>
        <div className="card">
          <div className="eyebrow">Kontakt</div>
          <h2>HELP ME wird Schritt für Schritt erweitert.</h2>
          <p>Für Fragen zur Plattform erreichen Sie uns unter <a href="mailto:info@nexoraonline.de" style={{ color: "var(--accent)" }}>info@nexoraonline.de</a>.</p>
          <p>Die Plattform befindet sich aktuell in der Testphase.</p>
        </div>
      </section>

      <footer className="footer">
        <div className="container" style={{ display: "flex", justifyContent: "space-between", gap: 18, flexWrap: "wrap" }}>
          <span>© {new Date().getFullYear()} HELP ME. Alle Rechte vorbehalten.</span>
          <nav aria-label="Rechtliche Navigation" style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href="mailto:info@nexoraonline.de">info@nexoraonline.de</a>
            <a href="/legal#widerruf">Widerruf</a>
            <a href="/legal#agb">AGB</a>
            <a href="/legal#datenschutz">Datenschutz</a>
            <a href="/legal#impressum">Impressum</a>
            <a href="/legal#cookies">Cookie-Einstellungen</a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
