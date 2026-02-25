import { auth } from "@/auth";
import { MarketTabs } from "./market-tabs";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Moja giełda",
  description:
    "Moja giełda transportowa - zarządzaj swoimi zleceniami transportowymi.",
};

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) redirect("/signin");
  return (
    <div className="mb-5">
      <div className="space-y-4 py-6">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Moja giełda</h2>
          <p className="text-sm text-gray-500 mt-1">
            Zarządzaj swoimi zleceniami, wiadomościami i ofertami.
          </p>
        </div>
        <MarketTabs />
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}
