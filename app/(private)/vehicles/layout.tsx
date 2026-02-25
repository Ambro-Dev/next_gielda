import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Dostępne pojazdy",
  description:
    "Giełda transportowa - fenilo.pl - zleć i znajdź transport szybko i przystępnie.",
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) redirect("/signin");
  return <>{children}</>;
}
