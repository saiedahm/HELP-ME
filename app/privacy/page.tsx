import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="page">
      <section className="panel">
        <div className="badge">HELP-ME · Privacy</div>
        <h1>Privacy & data use</h1>
        <p>This page is the current privacy notice placeholder for the account-registration flow.</p>
        <p>Account data is used to provide authentication, company workspace access, subscriptions, chatbot management, and usage tracking.</p>
        <p>Before registration, you must explicitly accept the privacy policy and data processing terms.</p>
        <Link className="button" href="/register">Back to registration</Link>
      </section>
    </main>
  );
}
