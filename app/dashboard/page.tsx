import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import KnowledgePanel from "./knowledge-panel";
import SignOutButton from "./sign-out-button";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      name: true, email: true,
      memberships: {
        orderBy: { createdAt: "asc" }, take: 1,
        select: {
          role: true,
          organization: {
            select: {
              id: true, name: true,
              _count: { select: { conversations: true, knowledge: true, chatbots: true } }
            }
          }
        }
      }
    }
  });
  if (!user) redirect("/login");
  const membership = user.memberships[0];
  const organization = membership?.organization;

  return (
    <main className="dashboard-page">
      <nav className="nav shell">
        <Link className="brand" href="/"><span className="brand-mark">H</span><span>HELP-ME</span></Link>
        <div className="nav-links"><span>{user.email}</span><SignOutButton /></div>
      </nav>
      <section className="dashboard shell">
        <div className="dashboard-head">
          <div><span className="eyebrow">BUSINESS DASHBOARD</span><h1>Welcome, {user.name || "there"}.</h1><p>{organization ? organization.name : "Your workspace"} · Your account overview.</p></div>
          <span className="plan-badge">FREE · STARTER</span>
        </div>
        <div className="stats">
          <div><strong>{organization?._count.conversations ?? 0}</strong><span>Saved conversations</span></div>
          <div><strong>{organization?._count.knowledge ?? 0}</strong><span>Knowledge items</span></div>
          <div><strong>{organization?._count.chatbots ?? 0}</strong><span>AI assistants</span></div>
        </div>
        <div className="dashboard-grid">
          <article className="dashboard-card"><span>01</span><h2>AI Assistant</h2><p>Try the assistant and save messages to your workspace.</p><Link href="/chat">Open chat →</Link></article>
          <article className="dashboard-card"><span>02</span><h2>Knowledge Base</h2><p>Add FAQs and service information to guide responses.</p><a href="#knowledge-base">Manage knowledge ↓</a></article>
          <article className="dashboard-card"><span>03</span><h2>Conversations</h2><p>Your saved conversations are counted in this workspace.</p><span>{organization?._count.conversations ?? 0} saved</span></article>
          <article className="dashboard-card"><span>04</span><h2>Account &amp; plan</h2><p>Signed in as {user.email}. Billing needs provider configuration.</p><span>{membership?.role ?? "MEMBER"} · FREE</span></article>
        </div>
        <div id="knowledge-base"><KnowledgePanel /></div>
      </section>
    </main>
  );
}
