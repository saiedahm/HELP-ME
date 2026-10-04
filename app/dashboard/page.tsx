import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="page">
      <section className="panel">
        <div className="badge">Dashboard · Foundation</div>
        <h1>Your HELP-ME workspace</h1>
        <p>This dashboard shell is ready. Authentication and user data protection come next.</p>
        <Link className="button" href="/">Back to home</Link>
      </section>
    </main>
  );
}
