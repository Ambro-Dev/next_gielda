"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SocketIndicator } from "@/components/ui/socket-indicator";
import {
  Bell,
  Bug,
  LogOut,
  MessageSquare,
  Paperclip,
  PenBox,
  Plus,
  Settings,
  Truck,
  User,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { School } from "@prisma/client";
import { Session } from "next-auth";
import { useMessages } from "@/app/context/message-provider";
import { useRouter } from "next/navigation";

type Props = {
  school: School | null | undefined;
  data: Session | null;
  menu: { title: string; href: string; description: string }[];
};

const DesktopNavMenu = (props: Props) => {
  const { school, data, menu } = props;
  const { offers, messages, offerMessages, reports } = useMessages();
  const router = useRouter();
  const isAuth = data?.user ? true : false;

  const totalNotifications =
    offers.length + messages.length + offerMessages.length;

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

  if (!isAuth) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/transport"
          className="px-3 py-1.5 text-sm text-white/70 hover:text-white rounded-md hover:bg-white/10 transition-colors"
        >
          Giełda
        </Link>
        <Link href="/signin">
          <Button variant="brand" size="sm">
            Zaloguj się
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {/* Main nav links */}
      <Link
        href="/transport"
        className="px-3 py-1.5 text-sm text-white/70 hover:text-white rounded-md hover:bg-white/10 transition-colors"
      >
        Giełda
      </Link>
      <Link
        href="/vehicles"
        className="px-3 py-1.5 text-sm text-white/70 hover:text-white rounded-md hover:bg-white/10 transition-colors"
      >
        Pojazdy
      </Link>
      <Link
        href="/user/market"
        className="px-3 py-1.5 text-sm text-white/70 hover:text-white rounded-md hover:bg-white/10 transition-colors"
      >
        Moja giełda
      </Link>
      <Link
        href="/documents"
        className="px-3 py-1.5 text-sm text-white/70 hover:text-white rounded-md hover:bg-white/10 transition-colors"
      >
        Dokumenty
      </Link>

      {/* School admin */}
      {data?.user.role === "school_admin" && (
        <Link
          href="/school"
          className="px-3 py-1.5 text-sm text-white/70 hover:text-white rounded-md hover:bg-white/10 transition-colors"
        >
          Zarządzaj szkołą
        </Link>
      )}

      {/* Admin panel dropdown */}
      {data?.user?.role === "admin" && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative px-3 py-1.5 text-sm text-white/70 hover:text-white rounded-md hover:bg-white/10 transition-colors">
              Admin
              {reports.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 text-[9px] font-semibold flex items-center justify-center text-white bg-red-500 rounded-full">
                  {reports.length}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuGroup>
              {menu.map((item) => (
                <DropdownMenuItem
                  key={item.title}
                  className="flex flex-col items-start gap-1 cursor-pointer"
                  onClick={() => router.replace(item.href)}
                >
                  <div className="flex justify-between w-full">
                    <span className="font-medium">{item.title}</span>
                    {reports.length > 0 && item.href === "/admin/reports" && (
                      <span className="w-4 h-4 text-[9px] font-semibold flex items-center justify-center text-white bg-red-500 rounded-full">
                        {reports.length}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {item.description}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Access expiry */}
      {school && (
        <span className="px-2 text-xs text-white/50">
          Dostęp:{" "}
          <span className="font-medium text-red-500">{untilExpire()}</span>
        </span>
      )}

      <div className="w-px h-5 bg-white/20 mx-2" />

      {/* Add transport button */}
      <Link href="/transport/add">
        <Button variant="brand" size="sm" className="gap-1.5">
          <Plus size={14} />
          Dodaj ogłoszenie
        </Button>
      </Link>

      {/* Notifications bell */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="relative p-2 text-white/70 hover:text-white rounded-md hover:bg-white/10 transition-colors">
            <Bell size={18} />
            {totalNotifications > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 text-[9px] font-semibold flex items-center justify-center text-white bg-red-500 rounded-full">
                {totalNotifications}
              </span>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48" align="end">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => router.replace("/user/market/messages")}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>Wiadomości</span>
            {messages.length > 0 && (
              <span className="ml-auto text-xs font-medium text-red-500">
                {messages.length}
              </span>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => router.replace("/user/market/offers")}
          >
            <PenBox className="mr-2 h-4 w-4" />
            <span>Oferty</span>
            {offers.length + offerMessages.length > 0 && (
              <span className="ml-auto text-xs font-medium text-red-500">
                {offers.length + offerMessages.length}
              </span>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* User avatar dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 p-1 rounded-md hover:bg-white/10 transition-colors">
            <Avatar className="h-7 w-7 ring-2 ring-primary/50">
              <AvatarFallback className="text-xs bg-primary/20 text-white font-semibold">
                {data?.user.username?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-52" align="end">
          <DropdownMenuLabel className="flex items-center justify-between">
            <span className="truncate">{data?.user.username}</span>
            <SocketIndicator />
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => router.replace("/user/profile/account")}
            >
              <User className="mr-2 h-4 w-4" />
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => router.replace("/user/profile/settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Ustawienia
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => router.replace("/vehicles")}
            >
              <Truck className="mr-2 h-4 w-4" />
              Dostępne pojazdy
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => router.replace("/documents")}
            >
              <Paperclip className="mr-2 h-4 w-4" />
              Dokumenty
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer text-red-600"
            onClick={() => router.replace("/report")}
          >
            <Bug className="mr-2 h-4 w-4" />
            Zgłoś uwagę
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => signOut()}
            className="cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Wyloguj
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DesktopNavMenu;
