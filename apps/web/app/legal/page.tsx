const company = {
  owner: "Akhmed ismail saied",
  company: "digital horizons",
  address: "Ehndofer str 130",
  city: "24537 Neumuenster",
  country: "Deutschland",
  website: "www.helpmey.net",
  email: "info@nexoraonline.de",
  phone: "+4915123937937",
  registry: "Nicht angegeben",
  vatId: "Nicht angegeben",
  status: "Die Plattform befindet sich in der Testphase.",
};

export default function LegalPage() {
  return (
    <main className="legal-page">
      <div className="container legal-shell">
        <a className="back-link" href="/">← HELP ME</a>
        <div className="legal-brand">
          <img src="/help-me-logo.png" alt="HELP-ME" className="legal-logo" />
          <span>HELP-ME</span>
        </div>
        <p className="eyebrow">Rechtliche Informationen</p>
        <h1>Rechtliches &amp; Datenschutz</h1>
        <p className="legal-intro">Transparente Informationen zur Plattform, zum Anbieter und zu den verfügbaren Einstellungen.</p>

        <section id="impressum" className="legal-card">
          <h2>Impressum</h2>
          <p><strong>Rechtsname / Vollständiger Name:</strong> {company.owner}</p>
          <p><strong>Firmenname:</strong> {company.company}</p>
          <p><strong>Adresse:</strong> {company.address}</p>
          <p><strong>Ort + Postleitzahl:</strong> {company.city}</p>
          <p><strong>Land:</strong> {company.country}</p>
          <p><strong>Website:</strong> {company.website}</p>
          <p><strong>E-Mail:</strong> {company.email}</p>
          <p><strong>Telefon:</strong> {company.phone}</p>
          <p><strong>Handelsregisternummer:</strong> {company.registry}</p>
          <p><strong>USt-IdNr.:</strong> {company.vatId}</p>
          <p><strong>Status:</strong> {company.status}</p>
        </section>

        <section id="datenschutz" className="legal-card">
          <h2>Datenschutz</h2>
          <p>HELP-ME verarbeitet Daten nur im Rahmen der bereitgestellten Funktionen und zur Durchführung der angeforderten Dienste.</p>
          <p>Bei Fragen zum Datenschutz wenden Sie sich bitte an <a href={`mailto:${company.email}`}>{company.email}</a>.</p>
          <p>Diese Plattform befindet sich in der Testphase. Rechtliche Texte werden vor dem öffentlichen Produktivbetrieb weiter geprüft und ergänzt.</p>
        </section>

        <section id="agb" className="legal-card">
          <h2>AGB / Nutzungsbedingungen</h2>
          <p>Die Nutzung von HELP-ME erfolgt zunächst im Rahmen der Testphase. Die Plattform darf nur rechtmäßig und entsprechend ihrem vorgesehenen Zweck genutzt werden.</p>
          <p>Verbindliche vollständige Nutzungsbedingungen werden vor dem regulären Produktivbetrieb veröffentlicht.</p>
        </section>

        <section id="widerruf" className="legal-card">
          <h2>Widerruf</h2>
          <p>Für Fragen zu einem möglichen Widerruf oder zu einer zukünftigen kostenpflichtigen Leistung wenden Sie sich bitte an <a href={`mailto:${company.email}`}>{company.email}</a>.</p>
          <p>Während der aktuellen Testphase werden keine nicht angegebenen Vertragsbedingungen oder Fristen erfunden.</p>
        </section>

        <section id="cookies" className="legal-card">
          <h2>Cookie-Einstellungen</h2>
          <p>HELP-ME soll nur die für den Betrieb notwendigen technischen Speicher- und Sitzungsmechanismen verwenden. Nicht notwendige Cookies werden nicht als bereits aktiviert dargestellt.</p>
          <p>Die Cookie-Einstellungen werden vor dem Produktivbetrieb um eine echte Einwilligungsverwaltung erweitert, sofern nicht notwendige Cookies oder vergleichbare Technologien eingesetzt werden.</p>
        </section>

        <footer className="footer legal-footer">
          <a href={`mailto:${company.email}`}>{company.email}</a>
          <nav aria-label="Rechtliche Navigation">
            <a href="#widerruf">Widerruf</a>
            <a href="#agb">AGB</a>
            <a href="#datenschutz">Datenschutz</a>
            <a href="#impressum">Impressum</a>
            <a href="#cookies">Cookie-Einstellungen</a>
          </nav>
        </footer>
      </div>
    </main>
  );
}
