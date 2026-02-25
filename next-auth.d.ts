import { Role } from "@prisma/client";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      username: string;
      email?: string;
      schoolId?: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
    schoolId?: string;
    username: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role;
    id: string;
    username: string;
    email?: string;
    schoolId?: string;
  }
}
