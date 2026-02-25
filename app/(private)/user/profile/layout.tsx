import { auth } from "@/auth";
import { ProfileTabs } from "./profile-tabs";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Konto użytkownika",
  description:
    "Giełda transportowa - fenilo.pl - zleć i znajdź transport szybko i przystępnie.",
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
          <h2 className="text-xl font-semibold tracking-tight">
            Konto użytkownika
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Zarządzaj swoim profilem i ustawieniami konta.
          </p>
        </div>
        <ProfileTabs />
        <div className="max-w-2xl">{children}</div>
      </div>
    </div>
  );
}
