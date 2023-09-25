"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useMessages } from "@/app/context/message-provider";
import { useSession } from "next-auth/react";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
  }[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname();
  const { offers, messages, offerMessages } = useMessages();
  const { data } = useSession();

  const myOffersMessages = offerMessages.filter(
    (message) => message.offer?.creator.id !== data?.user?.id
  );

  const sendOffersMessages = offerMessages.filter(
    (message) => message.offer?.creator.id === data?.user?.id
  );

  return (
    <nav
      className={cn("flex flex-col sm:space-x-0 lg:space-y-1", className)}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === item.href
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "justify-start relative"
          )}
        >
          {item.title}
          {item.href.endsWith("offers") &&
            offers.length + myOffersMessages.length > 0 && (
              <div className="ml-5 w-5 text-[10px] font-semibold h-5 flex justify-center text-white items-center bg-red-500 rounded-full">
                {offers.length + myOffersMessages.length}
              </div>
            )}
          {item.href.endsWith("send") && sendOffersMessages.length > 0 && (
            <div className="ml-5 w-5 text-[10px] font-semibold h-5 flex justify-center text-white items-center bg-red-500 rounded-full">
              {sendOffersMessages.length}
            </div>
          )}
          {item.href.endsWith("messages") && messages.length > 0 && (
            <div className="ml-5 w-5 text-[10px] font-semibold h-5 flex justify-center text-white items-center bg-red-500 rounded-full">
              {messages.length}
            </div>
          )}
        </Link>
      ))}
    </nav>
  );
}
