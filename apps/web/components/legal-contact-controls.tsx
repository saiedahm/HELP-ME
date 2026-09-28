"use client";

import { useState } from "react";

const legal = {
  widerruf: ["Widerruf", "Für Fragen zu einem möglichen Widerruf oder zu einer zukünftigen kostenpflichtigen Leistung wenden Sie sich bitte an info@nexoraonline.de. Während der aktuellen Testphase werden keine nicht angegebenen Vertragsbedingungen oder Fristen erfunden."],
  agb: ["AGB / Nutzungsbedingungen", "Die Nutzung von HELP-ME erfolgt zunächst im Rahmen der Testphase. Die Plattform darf nur rechtmäßig und entsprechend ihrem vorgesehenen Zweck genutzt werden. Verbindliche vollständige Nutzungsbedingungen werden vor dem regulären Produktivbetrieb veröffentlicht."],
  datenschutz: ["Datenschutz", "HELP-ME verarbeitet Daten nur im Rahmen der bereitgestellten Funktionen und zur Durchführung der angeforderten Dienste. Bei Fragen zum Datenschutz wenden Sie sich bitte an info@nexoraonline.de. Diese Plattform befindet sich in der Testphase. Rechtliche Texte werden vor dem öffentlichen Produktivbetrieb weiter geprüft und ergänzt."],
  impressum: ["Impressum", "Rechtsname / Vollständiger Name: Akhmed ismail saied\nFirmenname: digital horizons\nAdresse: Ehndofer str 130\n24537 Neumuenster, Deutschland\nWebsite: www.helpmey.net\nE-Mail: info@nexoraonline.de\nTelefon: +4915123937937\nHandelsregisternummer: Nicht angegeben\nUSt-IdNr.: Nicht angegeben\nStatus: Die Plattform befindet sich in der Testphase."],
  cookies: ["Cookie-Einstellungen", "HELP-ME soll nur die für den Betrieb notwendigen technischen Speicher- und Sitzungsmechanismen verwenden. Nicht notwendige Cookies werden nicht als bereits aktiviert dargestellt. Die Cookie-Einstellungen werden vor dem Produktivbetrieb um eine echte Einwilligungsverwaltung erweitert, sofern nicht notwendige Cookies oder vergleichbare Technologien eingesetzt werden."]
} as const;

export default function LegalContactControls() {
  const [open, setOpen] = useState<keyof typeof legal | null>(null);
  const [contact, setContact] = useState(false);
  const item = open ? legal[open] : null;
  return <>
    <div className="footer-controls">
      {Object.entries(legal).map(([key, value]) => <button key={key} type="button" onClick={() => setOpen(key as keyof typeof legal)}>{value[0]}</button>)}
    </div>
    <button className="floating-contact" type="button" onClick={() => setContact(true)} aria-label="Nachricht senden">✉ <span>Nachricht</span></button>
    {item && <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setOpen(null)}>
      <section className="modal-card" role="dialog" aria-modal="true" aria-label={item[0]}>
        <button className="modal-close" onClick={() => setOpen(null)} aria-label="Schließen">×</button>
        <img src="/help-me-logo.png" alt="HELP-ME" className="modal-logo" />
        <div className="eyebrow">Rechtliche Informationen</div>
        <h2>{item[0]}</h2>
        <p className="modal-text">{item[1]}</p>
      </section>
    </div>}
    {contact && <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setContact(false)}>
      <section className="modal-card" role="dialog" aria-modal="true" aria-label="Nachricht senden">
        <button className="modal-close" onClick={() => setContact(false)} aria-label="Schließen">×</button>
        <div className="eyebrow">Kontakt</div>
        <h2>Nachricht senden</h2>
        <p className="modal-text">Schreiben Sie uns Ihre Nachricht. Das Formular öffnet Ihr E-Mail-Programm mit der Nachricht.</p>
        <form className="contact-form" action="mailto:info@nexoraonline.de" method="post" encType="text/plain">
          <input name="name" placeholder="Ihr Name" aria-label="Ihr Name" />
          <input name="email" type="email" placeholder="Ihre E-Mail" aria-label="Ihre E-Mail" />
          <textarea name="message" rows={6} placeholder="Ihre Nachricht" aria-label="Ihre Nachricht" required />
          <button className="button primary" type="submit">Nachricht senden</button>
        </form>
      </section>
    </div>}
  </>;
}
