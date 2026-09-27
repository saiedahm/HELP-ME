import { signIn } from "../../../auth";

export default function AdminLoginPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background: "#07111f",
        color: "#fff",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: 440,
          padding: 32,
          borderRadius: 20,
          background: "#0d1b2a",
          border: "1px solid #24415f",
          boxShadow: "0 20px 60px rgba(0,0,0,.28)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h1 style={{ margin: 0, fontSize: 30 }}>HELP ME Admin</h1>
          <p style={{ color: "#a9bdd1", margin: "8px 0 0" }}>
            Secure administrator access
          </p>
        </div>

        <form
          action={async (formData) => {
            "use server";
            await signIn("credentials", {
              email: String(formData.get("email") ?? ""),
              password: String(formData.get("password") ?? ""),
              redirectTo: "/admin",
            });
          }}
          style={{ display: "grid", gap: 14 }}
        >
          <label style={{ display: "grid", gap: 7 }}>
            <span style={{ color: "#d7e6f5", fontSize: 14 }}>Admin email</span>
            <input
              name="email"
              type="email"
              required
              autoComplete="username"
              placeholder="admin@example.com"
              style={{
                padding: 13,
                borderRadius: 10,
                border: "1px solid #34516e",
                background: "#081522",
                color: "#fff",
                outline: "none",
              }}
            />
          </label>

          <label style={{ display: "grid", gap: 7 }}>
            <span style={{ color: "#d7e6f5", fontSize: 14 }}>Password</span>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="Enter your password"
              style={{
                padding: 13,
                borderRadius: 10,
                border: "1px solid #34516e",
                background: "#081522",
                color: "#fff",
                outline: "none",
              }}
            />
          </label>

          <button
            type="submit"
            style={{
              padding: 13,
              border: 0,
              borderRadius: 10,
              background: "#18a0fb",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
              marginTop: 4,
            }}
          >
            Sign in with Email & Password
          </button>
        </form>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            margin: "20px 0",
            color: "#7189a0",
            fontSize: 13,
          }}
        >
          <span style={{ flex: 1, height: 1, background: "#24415f" }} />
          <span>OR</span>
          <span style={{ flex: 1, height: 1, background: "#24415f" }} />
        </div>

        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/admin" });
          }}
        >
          <button
            type="submit"
            style={{
              width: "100%",
              padding: 13,
              borderRadius: 10,
              border: "1px solid #34516e",
              background: "#fff",
              color: "#101820",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Continue with Google
          </button>
        </form>

        <p
          style={{
            margin: "22px 0 0",
            textAlign: "center",
            color: "#7189a0",
            fontSize: 12,
            lineHeight: 1.5,
          }}
        >
          Access is restricted to the configured administrator account.
        </p>
      </section>
    </main>
  );
}
