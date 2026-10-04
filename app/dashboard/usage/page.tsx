import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/client";
import { PLAN_LIMITS, currentPeriodStart } from "@/lib/billing/plans";

export default async function UsagePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const membership = await prisma.organizationMember.findFirst({ where: { userId: session.user.id }, include: { organization: { include: { subscription: true, usage: true } } } });
  if (!membership) redirect("/dashboard");
  const plan = membership.organization.subscription?.plan ?? "STARTER";
  const limit = PLAN_LIMITS[plan].monthlyMessages;
  const usage = membership.organization.usage;
  const periodStart = currentPeriodStart();
  const messages = usage && usage.periodStart.getTime() >= periodStart.getTime() ? usage.messages : 0;
  const percent = Math.min(100, Math.round((messages / limit) * 100));
  return <main className="dashboard-page"><header className="dashboard-header"><div><div className="badge">HELP-ME · Usage</div><h1>Usage & limits</h1><p>Your monthly usage is enforced on the server according to your plan.</p></div><Link className="button" href="/dashboard">Dashboard</Link></header><section className="usage-panel"><div className="usage-top"><div><span>Current plan</span><strong>{plan}</strong></div><div><span>Messages</span><strong>{messages.toLocaleString()} / {limit.toLocaleString()}</strong></div></div><div className="usage-bar"><i style={{ width: percent + "%" }} /></div><p className="muted">{percent}% of your monthly message allowance used.</p></section></main>;
}
