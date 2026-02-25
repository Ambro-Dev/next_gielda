import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Logowanie",
  description: "Strona logowania",
};

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (session) redirect("/transport");

  return <>{children}</>;
}
