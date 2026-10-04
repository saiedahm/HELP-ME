import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/client";

export default async function ChatbotsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const membership = await prisma.organizationMember.findFirst({
    where: { userId: session.user.id },
    include: { organization: { include: { chatbots: { orderBy: { createdAt: "desc" } } } } },
  });
  if (!membership) redirect("/dashboard");
  return <main className="dashboard-page">
    <header className="dashboard-header"><div><div className="badge">HELP-ME · Chatbots</div><h1>Your website assistants</h1><p>Create and manage the assistants connected to your company.</p></div><div className="actions"><Link className="button" href="/dashboard">Dashboard</Link><Link className="button primary" href="/dashboard/chatbots/new">Create chatbot</Link></div></header>
    <section className="dashboard-card"><div className="bot-list">{membership.organization.chatbots.length===0 ? <p className="muted">No chatbots yet. Create your first assistant.</p> : membership.organization.chatbots.map(bot => <article className="bot-row" key={bot.id}><div><strong>{bot.name}</strong><small>{bot.status} · {bot.publicKey}</small><p>{bot.welcomeMessage || "Ready for your website."}</p></div><Link className="button" href={`/dashboard/chatbots/${bot.id}`}>Manage</Link></article>)}</div></section>
  </main>;
}
