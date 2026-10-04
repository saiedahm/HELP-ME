import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/client";

export default async function LeadsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const membership = await prisma.organizationMember.findFirst({ where: { userId: session.user.id }, include: { organization: { include: { conversations: { where: { visitorEmail: { not: null } }, orderBy: { updatedAt: "desc" }, take: 100, include: { chatbot: { select: { name: true } } } } } } } });
  if (!membership) redirect("/dashboard");
  const leads = membership.organization.conversations;
  return <main className="dashboard-page"><header className="dashboard-header"><div><div className="badge">HELP-ME · Leads</div><h1>Customer leads</h1><p>Contact details captured from your website conversations.</p></div><Link className="button" href="/dashboard">Dashboard</Link></header><section className="dashboard-card">{leads.length === 0 ? <p className="muted">No leads captured yet.</p> : <div className="lead-list">{leads.map((lead) => <div className="lead-row" key={lead.id}><div><strong>{lead.visitorName || "Website visitor"}</strong><small>{lead.visitorEmail}</small><small>{lead.chatbot.name} · {lead.updatedAt.toLocaleString()}</small></div><a className="button" href={`mailto:${lead.visitorEmail}`}>Email</a></div>)}</div>}</section></main>;
}
