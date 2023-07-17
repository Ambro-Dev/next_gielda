import type { Metadata } from "next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Logowanie",
  description: "Strona logowania",
};

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (session?.user) redirect("/");
  return <>{children}</>;
}
