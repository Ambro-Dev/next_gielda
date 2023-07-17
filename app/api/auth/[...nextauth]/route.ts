import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { type Adapter } from "@auth/core/adapters";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/UserModel";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials, req) {
        const { username, password } = credentials as {
          username: string;
          password: string;
        };

        await dbConnect();

        const user = await User.findOne({ username });
        if (!user) throw new Error("User not found");

        const isValid = await user.comparePassword(password);
        if (!isValid) throw new Error("Invalid password");

        return {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt(params: any) {
      if (params.user?.role) {
        params.token.role = params.user.role;
        params.token.id = params.user.id;
      }
      return params.token;
    },
    // If you want to use the role in client components
    async session({ session, token }) {
      if (session?.user) {
        (session.user as { id: string }).id = token.id as string;
        (session.user as { role: string }).role = token.role as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
