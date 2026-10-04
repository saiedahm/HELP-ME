import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/client";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const membership = await prisma.organizationMember.findFirst({
    where: { userId: session.user.id },
    include: { organization: true },
  });

  if (!membership) {
    return (
      <main className="page">
        <section className="panel">
          <div className="badge">HELP-ME · Account</div>
          <h1>Workspace not found</h1>
          <p>Your account is authenticated, but no company workspace is attached to it.</p>
          <Link className="button" href="/">Back to home</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="panel">
        <div className="badge">HELP-ME · Dashboard</div>
        <h1>{membership.organization.name}</h1>
        <p>Signed in as {session.user.email ?? "account"} · {membership.role}</p>
        <div className="grid">
          <article className="card"><h2>Chatbots</h2><p>Your chatbot management area will be added next.</p></article>
          <article className="card"><h2>Knowledge</h2><p>Company knowledge and content sources will be added after the dashboard foundation.</p></article>
          <article className="card"><h2>Usage</h2><p>Plan limits and usage reporting will be connected to the workspace.</p></article>
        </div>
        <Link className="button" href="/">Back to home</Link>
      </section>
    </main>
  );
}
