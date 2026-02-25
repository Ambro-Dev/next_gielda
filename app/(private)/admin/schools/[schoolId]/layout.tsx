import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

import { MainNav } from "@/components/dashboard/main-nav";
import { Search } from "@/components/dashboard/search";
import TeamSwitcher from "@/components/dashboard/team-switcher";

export const metadata: Metadata = {
  title: "Zarządzanie szkołą",
  description: "Example dashboard app using the components.",
};

export default async function SchoolLayout({
  children,
  params: paramsPromise,
}: {
  children: React.ReactNode;
  params: Promise<{
    schoolId: string;
  }>;
}) {
  const { schoolId } = await paramsPromise;
  const session = await auth();

  if (!session) redirect("/signin");
  return (
    <div className="flex flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center justify-between px-4">
          <TeamSwitcher schoolId={schoolId} />
          <MainNav schoolId={schoolId} />
        </div>
      </div>
      <>{children}</>
    </div>
  );
}
