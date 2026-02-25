import { auth } from "@/auth";
import { Metadata } from "next";

import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Transport - fenilo.pl",
  description:
    "Giełda transportowa - fenilo.pl - zleć i znajdź transport szybko i przystępnie.",
};

export default async function OfferLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/signin");
  }
  return <>{children}</>;
}
