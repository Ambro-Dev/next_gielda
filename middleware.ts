import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);
export default auth;

export const config = {
  matcher: [
    // Protect API routes (except auth, health, uploadthing, socket)
    "/api/((?!auth|health|uploadthing|socket).*)",
    // Protect private pages
    "/transport/:path*",
    "/admin/:path*",
    "/user/:path*",
  ],
};
