import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/client";
import NewChatbotForm from "@/components/chatbots/new-chatbot-form";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const membership = await prisma.organizationMember.findFirst({
    where: { userId: session.user.id },
    include: {
      organization: {
        include: {
          chatbots: { orderBy: { createdAt: "desc" }, take: 20 },
          subscription: true,
          usage: true,
        },
      },
    },
  });

  if (!membership) {
    return <main className="page"><section className="panel"><h1>Workspace not found</h1><p>No company workspace is attached to this account.</p><Link className="button" href="/">Back to home</Link></section></main>;
  }

  const { organization } = membership;

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div><div className="badge">HELP-ME · Company Dashboard</div><h1>{organization.name}</h1><p>{session.user.email} · {membership.role}</p></div>
        <Link className="button" href="/">Home</Link>
      </header>
      <section className="stats">
        <article className="stat"><span>Chatbots</span><strong>{organization.chatbots.length}</strong></article>
        <article className="stat"><span>Plan</span><strong>{organization.subscription?.plan ?? "STARTER"}</strong></article>
        <article className="stat"><span>Messages</span><strong>{organization.usage?.messages ?? 0}</strong></article>
      </section>
      <section className="dashboard-grid">
        <article className="dashboard-card">
          <div className="section-heading"><div><span className="badge">Your bots</span><h2>Chatbots</h2></div></div>
          {organization.chatbots.length === 0 ? <p className="muted">No chatbot yet. Create your first one below.</p> : <div className="bot-list">{organization.chatbots.map((bot) => <div className="bot-row" key={bot.id}><span className="bot-dot" style={{ background: bot.primaryColor ?? "#39d9ff" }} /><div><strong>{bot.name}</strong><small>{bot.status} · {bot.publicKey}</small></div></div>)}</div>}
        </article>
        <article className="dashboard-card"><span className="badge">Create</span><h2>New chatbot</h2><p className="muted">Set the basic identity now. Knowledge, design controls and embedding come next.</p><NewChatbotForm /></article>
      </section>
    </main>
  );
}
