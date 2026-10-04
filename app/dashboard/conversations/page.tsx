import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/client";

export default async function ConversationsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const membership = await prisma.organizationMember.findFirst({
    where: { userId: session.user.id },
    include: { organization: { include: { conversations: { orderBy: { updatedAt: "desc" }, take: 100, include: { chatbot: { select: { name: true } }, messages: { orderBy: { createdAt: "desc" }, take: 1 } } } } } },
  });
  if (!membership) redirect("/dashboard");
  const conversations = membership.organization.conversations;

  return <main className="dashboard-page">
    <header className="dashboard-header"><div><div className="badge">HELP-ME · Conversations</div><h1>Customer conversations</h1><p>Review chats and handle requests that need a human.</p></div><Link className="button" href="/dashboard">Dashboard</Link></header>
    <section className="dashboard-card">
      {conversations.length === 0 ? <p className="muted">No conversations yet. Your website assistant will appear here when visitors start chatting.</p> :
      <div className="conversation-list">{conversations.map((conversation) => <div className="conversation-row" key={conversation.id}>
        <div><strong>{conversation.title || "New conversation"}</strong><small>{conversation.chatbot.name} · {conversation.status} · {conversation.updatedAt.toLocaleString()}</small><p>{conversation.messages[0]?.content || "No messages"}</p></div>
        {conversation.status === "HANDED_OFF" && <span className="handoff-badge">Human requested</span>}
      </div>)}</div>}
    </section>
  </main>;
}
