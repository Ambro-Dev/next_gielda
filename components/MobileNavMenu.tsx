"use client";

import React from "react";
import Link from "next/link";
import { SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SocketIndicator } from "@/components/ui/socket-indicator";
import {
  Bug,
  ChevronRight,
  LogOut,
  MessageSquare,
  PenBox,
  Plus,
  Settings,
  User,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { School } from "@prisma/client";
import { Session } from "next-auth";
import { useMessages } from "@/app/context/message-provider";
import { Separator } from "./ui/separator";

type Props = {
  school: School | null | undefined;
  data: Session | null;
  menu: { title: string; href: string; description: string }[];
};

const NavLink = ({
  href,
  children,
  badge,
}: {
  href: string;
  children: React.ReactNode;
  badge?: number;
}) => (
  <SheetClose asChild>
    <Link
      href={href}
      className="flex items-center justify-between w-full px-3 py-2.5 text-sm text-gray-700 hover:text-gray-900 rounded-md hover:bg-gray-50 transition-colors"
    >
      <span>{children}</span>
      <div className="flex items-center gap-2">
        {badge !== undefined && badge > 0 && (
          <span className="w-5 h-5 text-[10px] font-semibold flex items-center justify-center text-white bg-red-500 rounded-full">
            {badge}
          </span>
        )}
        <ChevronRight size={14} className="text-gray-400" />
      </div>
    </Link>
  </SheetClose>
);

const MobileNavMenu = (props: Props) => {
  const { school, data, menu } = props;
  const { offers, messages, offerMessages, reports } = useMessages();
  const isAuth = data?.user ? true : false;

  const untilExpire = () => {
    if (school?.accessExpires) {
      const date = new Date(school.accessExpires);
      const now = new Date();
      const diff = date.getTime() - now.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      if (days > 0) return `${days} dni`;
      if (days === 0 && hours > 0) return `${hours} godz.`;
      if (days === 0 && hours === 0 && minutes > 0) return `${minutes} min.`;
      return "Wygasło";
    }
    return "Nieokreślony";
  };

  return (
    <nav className="flex flex-col w-full gap-1">
      {/* User info */}
      {isAuth && (
        <>
          <div className="flex items-center gap-3 px-3 py-3">
            <Avatar className="h-10 w-10 ring-2 ring-primary/30">
              <AvatarFallback className="text-sm bg-primary/10 text-primary font-semibold">
                {data?.user.username?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{data?.user.username}</span>
              <div className="flex items-center gap-1.5">
                <SocketIndicator />
                {school && (
                  <span className="text-xs text-gray-500">
                    Dostęp:{" "}
                    <span className="font-medium text-red-500">
                      {untilExpire()}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* Add transport CTA */}
      {isAuth && (
        <div className="px-3 py-2">
          <SheetClose asChild>
            <Link href="/transport/add" className="block">
              <Button variant="brand" size="sm" className="w-full gap-1.5">
                <Plus size={14} />
                Dodaj ogłoszenie
              </Button>
            </Link>
          </SheetClose>
        </div>
      )}

      {/* Navigation links */}
      <div className="flex flex-col">
        <NavLink href="/transport">Giełda transportowa</NavLink>
        {isAuth && (
          <>
            <NavLink href="/vehicles">Dostępne pojazdy</NavLink>
            <NavLink href="/user/market">Moja giełda</NavLink>
            <NavLink href="/documents">Dokumenty do pobrania</NavLink>
            <NavLink
              href="/user/market/messages"
              badge={messages.length}
            >
              Wiadomości
            </NavLink>
            <NavLink
              href="/user/market/offers"
              badge={offers.length + offerMessages.length}
            >
              Oferty
            </NavLink>
          </>
        )}
      </div>

      {/* Admin / School admin */}
      {data?.user.role === "school_admin" && (
        <>
          <Separator />
          <NavLink href="/school">Zarządzaj szkołą</NavLink>
        </>
      )}

      {data?.user?.role === "admin" && (
        <>
          <Separator />
          <div className="px-3 py-1.5">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Administracja
            </span>
          </div>
          {menu.map((item) => (
            <NavLink
              key={item.title}
              href={item.href}
              badge={
                item.href === "/admin/reports" ? reports.length : undefined
              }
            >
              {item.title}
            </NavLink>
          ))}
        </>
      )}

      {/* User actions */}
      {isAuth && (
        <>
          <Separator />
          <NavLink href="/user/profile/account">Profil</NavLink>
          <NavLink href="/user/profile/settings">Ustawienia</NavLink>
          <SheetClose asChild>
            <Link
              href="/report"
              className="flex items-center w-full px-3 py-2.5 text-sm text-red-600 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Bug className="mr-2 h-4 w-4" />
              Zgłoś uwagę
            </Link>
          </SheetClose>
          <Separator />
          <button
            onClick={() => signOut()}
            className="flex items-center w-full px-3 py-2.5 text-sm text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Wyloguj
          </button>
        </>
      )}

      {/* Sign in for unauthenticated */}
      {!isAuth && (
        <>
          <Separator />
          <div className="px-3 py-2">
            <SheetClose asChild>
              <Link href="/signin" className="block">
                <Button variant="outline" size="sm" className="w-full">
                  Zaloguj się
                </Button>
              </Link>
            </SheetClose>
          </div>
        </>
      )}
    </nav>
  );
};

export default MobileNavMenu;
