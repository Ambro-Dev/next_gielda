import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

import { MainNav } from "@/components/dashboard/main-nav";
import { Search } from "@/components/dashboard/search";
import TeamSwitcher from "@/components/dashboard/team-switcher";
import axios from "@/lib/axios";

export const metadata: Metadata = {
  title: "Profil administratora",
  description:
    "Giełda transportowa - fenilo.pl - zleć i znajdź transport szybko i przystępnie.",
};

export default async function SchoolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/signin");
  return <>{children}</>;
}
