import { signIn } from "../../../auth";

export default function AdminLoginPage() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "#07111f", color: "#fff" }}>
      <section style={{ width: "100%", maxWidth: 420, padding: 32, borderRadius: 20, background: "#0d1b2a", border: "1px solid #24415f" }}>
        <h1 style={{ margin: 0, fontSize: 30 }}>HELP ME Admin</h1>
        <p style={{ color: "#a9bdd1", marginTop: 8 }}>Administrator access</p>

        <form
          action={async (formData) => {
            "use server";
            await signIn("credentials", {
              email: formData.get("email"),
              password: formData.get("password"),
              redirectTo: "/admin",
            });
          }}
          style={{ display: "grid", gap: 14, marginTop: 24 }}
        >
          <input name="email" type="email" required placeholder="Admin email" autoComplete="username" style={{ padding: 13, borderRadius: 10, border: "1px solid #34516e", background: "#081522", color: "#fff" }} />
          <input name="password" type="password" required placeholder="Admin password" autoComplete="current-password" style={{ padding: 13, borderRadius: 10, border: "1px solid #34516e", background: "#081522", color: "#fff" }} />
          <button type="submit" style={{ padding: 13, border: 0, borderRadius: 10, background: "#18a0fb", color: "#fff", fontWeight: 700, cursor: "pointer" }}>Sign in</button>
        </form>

        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/admin" });
          }}
          style={{ marginTop: 12 }}
        >
          <button type="submit" style={{ width: "100%", padding: 13, borderRadius: 10, border: "1px solid #34516e", background: "transparent", color: "#fff", fontWeight: 600, cursor: "pointer" }}>
            Continue with Google
          </button>
        </form>
      </section>
    </main>
  );
}
