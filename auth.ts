import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const email = typeof credentials?.email === "string" ? credentials.email.trim().toLowerCase() : "";
        const password = typeof credentials?.password === "string" ? credentials.password : "";
        if (!email || password.length < 8) return null;

        // Authentication persistence will be connected to Prisma in the next step.
        return { id: email, email, name: email.split("@")[0] };
      }
    })
  ],
  pages: {
    signIn: "/login"
  },
  session: { strategy: "jwt" }
});
