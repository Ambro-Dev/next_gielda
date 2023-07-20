import { Card } from "@/components/ui/card";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Profil administratora",
  description:
    "Giełda transportowa - fenilo.pl - zleć i znajdź transport szybko i przystępnie.",
};

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/signin");
  return (
    <Card className="flex flex-col space-y-8 ">
      <div>{children}</div>
    </Card>
  );
}
