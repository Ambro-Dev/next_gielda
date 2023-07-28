import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { SidebarNav } from "@/components/SidebarNav";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { Inter } from "next/font/google";
import { redirect } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Moja giełda",
  description:
    "Moja giełda transportowa - zarządzaj swoimi zleceniami transportowymi.",
};

const sidebarNavItems = [
  {
    title: "Aktywne zlecenia",
    href: "/user/market",
  },
  {
    title: "Zakończone zlecenia",
    href: "/user/market/history",
  },
  {
    title: "Wiadomości",
    href: "/user/market/messages",
  },
  {
    title: "Oferty",
    href: "/user/market/offers",
  },
];

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/signin");
  return (
    <Card className="mb-5">
      <div className="space-y-6 p-10 pb-16 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Moja giełda</h2>
          <p className="text-muted-foreground">
            Zarządzaj swoimi zleceniami transportowymi, wiadomościami i
            ofertami.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="w-full">{children}</div>
        </div>
      </div>
    </Card>
  );
}
