export { auth as middleware } from "@/auth";

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
