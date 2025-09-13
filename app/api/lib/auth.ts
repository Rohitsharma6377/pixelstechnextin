import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "./mongodb";
import { compare } from "bcrypt";
import { MongoClient } from "mongodb";

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        const client = await clientPromise;
        const db = client.db();
        const user = await db.collection("users").findOne({ email: credentials.email });
        if (!user || !user.password) return null;
        const isValid = await compare(credentials.password, user.password);
        if (!isValid) return null;
        return {
          id: user._id.toString(),
          name: user.name as string,
          email: user.email as string,
          role: (user.role as string) || "USER",
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role || "USER";
      } else if (token?.email) {
        // ensure token role is synced from DB
        try {
          const client: MongoClient = await clientPromise;
          const db = client.db();
          const found = await db.collection("users").findOne({ email: token.email as string });
          if (found?.role) token.role = found.role;
        } catch {
          // ignore
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = (token as any).role || "USER";
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
