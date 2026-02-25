import { auth } from "@/auth";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { redirect } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zapomniałam/em hasła",
  description: "Strona zapomniałam/em hasła",
};

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (session) redirect("/");

  return <>{children}</>;
}
