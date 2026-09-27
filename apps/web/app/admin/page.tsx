import { auth, signOut } from "../../auth";
import { getHelpRequests } from "../../lib/help/store";

export default async function AdminPage() {
  const session = await auth();
  const requests = await getHelpRequests();

  const languageCount = new Set(requests.map((request) => request.locale)).size;
  const latestRequest = requests[0];

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "32px 20px 56px",
        background: "#07111f",
        color: "#fff",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 20,
            flexWrap: "wrap",
            marginBottom: 28,
          }}
        >
          <div>
            <div style={{ color: "#18a0fb", fontWeight: 700, fontSize: 13, letterSpacing: 1 }}>
              HELP ME / ADMIN
            </div>
            <h1 style={{ margin: "6px 0 4px", fontSize: 32 }}>Control Center</h1>
            <p style={{ margin: 0, color: "#a9bdd1" }}>
              {session?.user?.email ?? "Administrator"}
            </p>
          </div>

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
          >
            <button
              type="submit"
              style={{
                padding: "10px 16px",
                borderRadius: 10,
                border: "1px solid #34516e",
                background: "#0d1b2a",
                color: "#fff",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Sign out
            </button>
          </form>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))",
            gap: 14,
            marginBottom: 24,
          }}
        >
          <div style={cardStyle}>
            <div style={labelStyle}>TOTAL REQUESTS</div>
            <strong style={valueStyle}>{requests.length}</strong>
            <div style={mutedStyle}>Requests currently available to the server</div>
          </div>

          <div style={cardStyle}>
            <div style={labelStyle}>LANGUAGES</div>
            <strong style={valueStyle}>{languageCount}</strong>
            <div style={mutedStyle}>Different request locales</div>
          </div>

          <div style={cardStyle}>
            <div style={labelStyle}>SECURITY</div>
            <strong style={{ ...valueStyle, fontSize: 24 }}>PROTECTED</strong>
            <div style={mutedStyle}>Admin route requires administrator access</div>
          </div>
        </section>

        <section
          style={{
            borderRadius: 16,
            background: "#0d1b2a",
            border: "1px solid #24415f",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: 20,
              borderBottom: "1px solid #24415f",
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div>
              <h2 style={{ margin: 0, fontSize: 21 }}>HELP ME Requests</h2>
              <p style={{ margin: "6px 0 0", color: "#7189a0", fontSize: 13 }}>
                Latest customer messages received by the platform
              </p>
            </div>
            {latestRequest && (
              <div style={{ color: "#7189a0", fontSize: 12, alignSelf: "center" }}>
                Latest: {new Date(latestRequest.createdAt).toLocaleString()}
              </div>
            )}
          </div>

          {requests.length === 0 ? (
            <div style={{ padding: 32, color: "#a9bdd1" }}>
              No customer requests yet.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Time</th>
                    <th style={thStyle}>Language</th>
                    <th style={thStyle}>Customer message</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request.id}>
                      <td style={{ ...tdStyle, whiteSpace: "nowrap", color: "#a9bdd1" }}>
                        {new Date(request.createdAt).toLocaleString()}
                      </td>
                      <td style={tdStyle}>{request.locale.toUpperCase()}</td>
                      <td style={{ ...tdStyle, lineHeight: 1.55 }}>{request.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <p style={{ margin: "18px 0 0", color: "#5f7890", fontSize: 12 }}>
          Note: requests are currently held in server memory. The next platform step is replacing this temporary store with persistent database storage.
        </p>
      </div>
    </main>
  );
}

const cardStyle = {
  padding: 20,
  borderRadius: 16,
  background: "#0d1b2a",
  border: "1px solid #24415f",
};

const labelStyle = {
  color: "#7189a0",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: 1,
};

const valueStyle = {
  display: "block",
  margin: "8px 0 5px",
  fontSize: 30,
};

const mutedStyle = {
  color: "#a9bdd1",
  fontSize: 13,
};

const thStyle = {
  textAlign: "left" as const,
  padding: 14,
  borderBottom: "1px solid #24415f",
  color: "#7189a0",
  fontSize: 12,
  textTransform: "uppercase" as const,
  letterSpacing: 0.6,
};

const tdStyle = {
  padding: 14,
  borderBottom: "1px solid #172c40",
  verticalAlign: "top" as const,
};
