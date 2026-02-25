import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prismadb";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const username = credentials?.username as string;
        const password = credentials?.password as string;

        if (!username || !password) throw new Error("Brakuje danych");

        const user = await prisma.user.findUnique({
          where: { username },
        });

        if (user?.role === "student" || user?.role === "school_admin") {
          const school = await prisma.school.findFirst({
            where: {
              students: {
                some: {
                  userId: user?.id,
                },
              },
            },
            select: {
              accessExpires: true,
            },
          });

          if (school?.accessExpires && school.accessExpires < new Date()) {
            throw new Error("Dostęp do szkoły wygasł");
          }
        }

        if (user?.isBlocked) throw new Error("Użytkownik zablokowany");

        if (!user || !user.hashedPassword) throw new Error("User not found");

        const passwordMatch = await bcrypt.compare(
          password,
          user.hashedPassword,
        );

        if (!passwordMatch) throw new Error("Invalid password");

        return { ...user };
      },
    }),
  ],
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Only on sign-in: store user data in token
        token.id = user.id;
        token.role = (user as any).role;
        token.username = (user as any).username;
        token.email = user.email;
      }
      return token;
    },
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as any;
        session.user.username = token.username as string;
        session.user.email = token.email!;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
});
