"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { title: "Profil", href: "/user/profile/account" },
  { title: "Ustawienia", href: "/user/profile/settings" },
];

export function ProfileTabs() {
  const pathname = usePathname();

  return (
    <div className="flex overflow-x-auto border-b border-gray-200 -mx-3 px-3">
      {tabs.map((tab) => {
        const isActive = pathname?.startsWith(tab.href);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 text-sm whitespace-nowrap border-b-2 transition-colors",
              isActive
                ? "border-gray-900 text-gray-900 font-medium"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}
          >
            {tab.title}
          </Link>
        );
      })}
    </div>
  );
}
