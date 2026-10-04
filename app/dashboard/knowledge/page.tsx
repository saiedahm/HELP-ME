import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/client";
import KnowledgeForm from "@/components/knowledge/knowledge-form";

export default async function KnowledgePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const membership = await prisma.organizationMember.findFirst({
    where: { userId: session.user.id },
    include: {
      organization: {
        include: {
          knowledgeItems: { orderBy: { updatedAt: "desc" }, take: 30 },
        },
      },
    },
  });

  if (!membership) redirect("/dashboard");

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div><div className="badge">HELP-ME · Knowledge Base</div><h1>Teach your assistant</h1><p>Add company information, FAQs, website content and later uploaded files.</p></div>
        <Link className="button" href="/dashboard">Dashboard</Link>
      </header>
      <div className="dashboard-grid">
        <section className="dashboard-card">
          <span className="badge">Sources</span><h2>Company knowledge</h2>
          {membership.organization.knowledgeItems.length === 0 ? <p className="muted">No knowledge sources yet. Add the first source on the right.</p> :
            <div className="bot-list">{membership.organization.knowledgeItems.map((item) => <div className="bot-row" key={item.id}><div><strong>{item.title}</strong><small>{item.type}{item.sourceUrl ? ` · ${item.sourceUrl}` : ""}</small></div></div>)}</div>}
        </section>
        <section className="dashboard-card"><span className="badge">Add source</span><h2>Knowledge source</h2><KnowledgeForm /></section>
      </div>
    </main>
  );
}
