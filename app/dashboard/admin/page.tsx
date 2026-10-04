import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/client";
import { requirePlatformAdmin } from "@/lib/auth/admin";

export default async function AdminPage() {
  const admin = await requirePlatformAdmin();
  if (!admin) redirect("/dashboard");

  const [users, organizations, chatbots, conversations, subscriptions] = await Promise.all([
    prisma.user.count(),
    prisma.organization.count(),
    prisma.chatbot.count(),
    prisma.conversation.count(),
    prisma.subscription.groupBy({ by: ["plan"], _count: { _all: true } }),
  ]);

  return <main className="dashboard-page">
    <header className="dashboard-header"><div><div className="badge">HELP-ME · Platform Admin</div><h1>Platform overview</h1><p>System-level metrics for platform administration.</p></div><Link className="button" href="/dashboard">Dashboard</Link></header>
    <section className="admin-grid">
      <article className="admin-stat"><span>Users</span><strong>{users}</strong></article>
      <article className="admin-stat"><span>Organizations</span><strong>{organizations}</strong></article>
      <article className="admin-stat"><span>Chatbots</span><strong>{chatbots}</strong></article>
      <article className="admin-stat"><span>Conversations</span><strong>{conversations}</strong></article>
    </section>
    <section className="dashboard-card"><h2>Subscriptions</h2><div className="subscription-stats">{subscriptions.map((item) => <div key={item.plan}><span>{item.plan}</span><strong>{item._count._all}</strong></div>)}</div></section>
  </main>;
}
