"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useMessages } from "@/app/context/message-provider";

const tabs = [
  { title: "Aktywne", href: "/user/market" },
  { title: "Zakończone", href: "/user/market/history" },
  { title: "Wiadomości", href: "/user/market/messages", badgeKey: "messages" as const },
  { title: "Otrzymane", href: "/user/market/offers", badgeKey: "offers" as const },
  { title: "Wysłane", href: "/user/market/offers/send" },
  { title: "Zaakceptowane", href: "/user/market/offers/accepted" },
];

export function MarketTabs() {
  const pathname = usePathname();
  const { offers, messages, offerMessages } = useMessages();

  const getBadge = (badgeKey?: "messages" | "offers") => {
    if (badgeKey === "messages" && messages.length > 0) return messages.length;
    if (badgeKey === "offers" && offers.length + offerMessages.length > 0)
      return offers.length + offerMessages.length;
    return 0;
  };

  return (
    <div className="flex overflow-x-auto border-b border-gray-200 -mx-3 px-3">
      {tabs.map((tab) => {
        const isActive =
          tab.href === "/user/market"
            ? pathname === "/user/market"
            : pathname?.startsWith(tab.href);
        const badge = getBadge(tab.badgeKey);

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
            {badge > 0 && (
              <span className="w-5 h-5 text-[10px] font-semibold flex items-center justify-center text-white bg-red-500 rounded-full">
                {badge}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
