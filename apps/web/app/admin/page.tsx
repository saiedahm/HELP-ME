import { auth, signOut } from "../../auth";
import { getHelpRequests } from "../../lib/help/store";

export default async function AdminPage() {
  const session = await auth();
  const requests = await getHelpRequests();

  return (
    <main style={{ minHeight: "100vh", padding: 32, background: "#07111f", color: "#fff" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, marginBottom: 28 }}>
          <div>
            <h1 style={{ margin: 0 }}>HELP ME Admin</h1>
            <p style={{ color: "#a9bdd1" }}>{session?.user?.email ?? "Administrator"}</p>
          </div>
          <form action={async () => { "use server"; await signOut({ redirectTo: "/admin/login" }); }}>
            <button type="submit" style={{ padding: "10px 16px", borderRadius: 10, border: "1px solid #34516e", background: "transparent", color: "#fff", cursor: "pointer" }}>Sign out</button>
          </form>
        </header>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14, marginBottom: 24 }}>
          <div style={{ padding: 20, borderRadius: 16, background: "#0d1b2a", border: "1px solid #24415f" }}><strong>{requests.length}</strong><div style={{ color: "#a9bdd1" }}>Requests in current server session</div></div>
          <div style={{ padding: 20, borderRadius: 16, background: "#0d1b2a", border: "1px solid #24415f" }}><strong>Secure</strong><div style={{ color: "#a9bdd1" }}>Admin route protected</div></div>
        </section>

        <section style={{ borderRadius: 16, background: "#0d1b2a", border: "1px solid #24415f", overflow: "hidden" }}>
          <div style={{ padding: 20, borderBottom: "1px solid #24415f" }}><h2 style={{ margin: 0 }}>HELP ME Requests</h2></div>
          {requests.length === 0 ? (
            <p style={{ padding: 20, color: "#a9bdd1" }}>No requests yet.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr><th style={{ textAlign: "left", padding: 14 }}>Time</th><th style={{ textAlign: "left", padding: 14 }}>Language</th><th style={{ textAlign: "left", padding: 14 }}>Message</th></tr></thead>
                <tbody>{requests.map((request) => <tr key={request.id}><td style={{ padding: 14, whiteSpace: "nowrap", color: "#a9bdd1" }}>{new Date(request.createdAt).toLocaleString()}</td><td style={{ padding: 14 }}>{request.locale}</td><td style={{ padding: 14 }}>{request.message}</td></tr>)}</tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
