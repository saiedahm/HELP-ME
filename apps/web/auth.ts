import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const adminPassword = process.env.ADMIN_PASSWORD;

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Admin password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").trim().toLowerCase();
        const password = String(credentials?.password ?? "");

        if (!adminEmail || !adminPassword) return null;
        if (email !== adminEmail || password !== adminPassword) return null;

        return {
          id: "admin",
          name: "Administrator",
          email: adminEmail,
          role: "admin",
        };
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID ?? "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!adminEmail || user.email?.trim().toLowerCase() !== adminEmail) {
        return false;
      }

      return account?.provider === "google" || account?.provider === "credentials";
    },
    async jwt({ token, user }) {
      if (user?.email?.trim().toLowerCase() === adminEmail) {
        token.role = "admin";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.role) {
        session.user.role = String(token.role);
      }
      return session;
    },
    authorized({ auth: session, request }) {
      if (request.nextUrl.pathname.startsWith("/admin")) {
        return Boolean(session?.user?.email && session.user.role === "admin");
      }
      return true;
    },
  },
  pages: { signIn: "/admin/login" },
});
