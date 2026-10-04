import Link from "next/link";

export default function HomePage() {
  return (
    <main className="page">
      <section className="hero">
        <div className="badge">HELP-ME · SaaS</div>
        <h1>Tell me what you need. I&apos;ll help you get it done.</h1>
        <p>A secure platform for intelligent assistance, conversations, usage management, and future AI providers.</p>
        <div className="actions">
          <Link className="button primary" href="/dashboard">Open Dashboard</Link>
          <Link className="button" href="/api/health">System Health</Link>
        </div>
      </section>
      <section className="grid" aria-label="Platform foundation">
        <article className="card"><h2>Secure accounts</h2><p>Authentication and user isolation will be added before protected data features.</p></article>
        <article className="card"><h2>Mock AI first</h2><p>The first development AI provider will be free and independent from commercial AI APIs.</p></article>
        <article className="card"><h2>Ready to scale</h2><p>Plans, usage limits, billing, conversations, and administration will be added in verified steps.</p></article>
      </section>
    </main>
  );
}
