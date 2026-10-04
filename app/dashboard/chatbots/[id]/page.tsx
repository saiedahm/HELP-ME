import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/client";
import ChatbotEditor from "@/components/chatbots/chatbot-editor";

export default async function ChatbotPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const { id } = await params;

  const chatbot = await prisma.chatbot.findFirst({
    where: {
      id,
      organization: { members: { some: { userId: session.user.id } } },
    },
  });

  if (!chatbot) {
    return <main className="page"><section className="panel"><h1>Chatbot not found</h1><Link className="button" href="/dashboard">Back to dashboard</Link></section></main>;
  }

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div><div className="badge">HELP-ME · Chatbot Editor</div><h1>{chatbot.name}</h1><p>Customize the identity and behavior shown to your website visitors.</p></div>
        <Link className="button" href="/dashboard">Dashboard</Link>
      </header>
      <ChatbotEditor chatbot={chatbot} />
    </main>
  );
}
