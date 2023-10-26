"use client";

import Image from "next/image";
import logo from "../public/gielda-fenilo.webp";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import React, { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  User,
  Settings,
  LogOut,
  MessageSquare,
  PenBox,
  Menu,
  Facebook,
  Bug,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { axiosInstance } from "@/lib/axios";
import { School } from "@prisma/client";
import { SocketIndicator } from "./ui/socket-indicator";
import { useMessages } from "@/app/context/message-provider";

const menu: { title: string; href: string; description: string }[] = [
  {
    title: "Zarządzaj szkołami",
    href: "/admin/schools",
    description:
      "Zarządzaj szkołami, które są dostępne dla użytkowników aplikacji.",
  },
  {
    title: "Dostęp dla pracowników",
    href: "/admin/users",
    description:
      "Zarządzaj użytkownikami, którzy mają dostęp do panelu administratora.",
  },
  {
    title: "Ustawienia transportów",
    href: "/admin/transports",
    description: "Zarządzaj ustawieniami transportów.",
  },
  {
    title: "Zgłoszone uwagi",
    href: "/admin/reports",
    description:
      "Zarządzaj zgłoszonymi uwagami i problemami w działaniu aplikacji.",
  },
];

const schoolData = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`/api/school?userId=${userId}`);
    const data = response.data;
    return data.school;
  } catch (error) {}
};

const TopBar = () => {
  const router = useRouter();
  const { data, status } = useSession();
  const isAuth = status === "authenticated";
  const [school, setSchool] = React.useState<School | null>(null);
  const { offers, messages, offerMessages, reports } = useMessages();

  useEffect(() => {
    if (data?.user?.role === "student" || data?.user?.role === "school_admin") {
      schoolData(String(data?.user?.id)).then((data) => setSchool(data));
    }
  }, [data?.user?.id, data?.user?.role]);

  const untilExpire = () => {
    if (school?.accessExpires) {
      const date = new Date(school?.accessExpires);
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
      if (days === 0 && hours === 0 && minutes === 0) return "Wygasło";
    } else {
      return "Nieokreślony";
    }
  };

  const avatar = (
    <Avatar className="flex w-full">
      <AvatarFallback className=" px-2 text-sm">
        {data?.user.username}
      </AvatarFallback>
    </Avatar>
  );

  return (
    <div className="fixed w-full px-10 bg-white backdrop-blur-sm bg-opacity-80 shadow-md z-10">
      <div className="flex flex-col w-full h-full ">
        <div className="flex justify-start flex-row items-center w-full h-16  py-1">
          <Sheet>
            <SheetTrigger asChild>
              <div className="relative lg:hidden">
                {offers.length + messages.length + offerMessages.length > 0 && (
                  <div className="absolute z-10 top-0 right-3 w-5 text-[10px] font-semibold h-5 flex justify-center text-white items-center bg-red-500 rounded-full">
                    {offers.length + messages.length + offerMessages.length}
                  </div>
                )}
                <button className="w-10 h-10 mr-4">
                  <Menu size={36} />
                </button>
              </div>
            </SheetTrigger>
            <SheetContent side={"left"}>
              <SheetHeader>
                <SheetTitle>
                  <Link href="/" legacyBehavior passHref>
                    <SheetClose asChild>
                      <Image
                        src={logo}
                        priority
                        alt="fenilo-gielda"
                        className="hover:cursor-pointer"
                      />
                    </SheetClose>
                  </Link>
                </SheetTitle>
                <Separator />
                <div className="flex flex-col justify-center items-center gap-12 py-10">
                  <NavigationMenu>
                    <NavigationMenuList className="gap-4 flex-col">
                      {data?.user.role === "school_admin" && (
                        <NavigationMenuItem>
                          <Link href="/school" legacyBehavior passHref>
                            <NavigationMenuLink
                              className={navigationMenuTriggerStyle()}
                            >
                              <SheetClose asChild>
                                <Button>Zarządzaj szkołą</Button>
                              </SheetClose>
                            </NavigationMenuLink>
                          </Link>
                        </NavigationMenuItem>
                      )}
                      {data?.user?.role === "admin" && (
                        <NavigationMenuItem>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild className="relative">
                              <div>
                                {reports.length > 0 && (
                                  <div className="absolute z-10 -right-2 -top-2 w-5 text-[10px] font-semibold h-5 flex justify-center text-white items-center bg-red-500 rounded-full">
                                    {reports.length}
                                  </div>
                                )}
                                <Button>Panel administracyjny</Button>
                              </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                              <DropdownMenuGroup>
                                {menu.map((item) => (
                                  <div key={item.title}>
                                    <SheetClose asChild>
                                      <DropdownMenuItem
                                        className="flex flex-col w-full justify-center items-start gap-2"
                                        onClick={() =>
                                          router.replace(item.href)
                                        }
                                      >
                                        <div className="flex justify-between w-full">
                                          <span className="font-bold">
                                            {item.title}
                                          </span>
                                          {reports.length > 0 &&
                                            item.href === "/admin/reports" && (
                                              <div className="w-5 text-[10px] font-semibold h-5 flex justify-center text-white items-center bg-red-500 rounded-full">
                                                {reports.length}
                                              </div>
                                            )}
                                        </div>
                                        <span>{item.description}</span>
                                      </DropdownMenuItem>
                                    </SheetClose>
                                    <DropdownMenuSeparator />
                                  </div>
                                ))}
                              </DropdownMenuGroup>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </NavigationMenuItem>
                      )}
                      <NavigationMenuItem className="text-amber-500 font-bold hover:bg-amber-500 py-2 px-3 transition-all duration-500 rounded-md hover:text-black text-sm hover:font-semibold">
                        <Link href="/transport/add" legacyBehavior passHref>
                          <NavigationMenuLink>
                            <SheetClose asChild>
                              <p>Dodaj ogłoszenie</p>
                            </SheetClose>
                          </NavigationMenuLink>
                        </Link>
                      </NavigationMenuItem>
                      <NavigationMenuItem>
                        <Link href="/" legacyBehavior passHref>
                          <NavigationMenuLink
                            className={navigationMenuTriggerStyle()}
                          >
                            <SheetTrigger asChild>
                              <p>Giełda transportowa</p>
                            </SheetTrigger>
                          </NavigationMenuLink>
                        </Link>
                      </NavigationMenuItem>
                      {!isAuth ? (
                        <NavigationMenuItem>
                          <Link href="/signin" legacyBehavior passHref>
                            <SheetClose asChild>
                              <NavigationMenuLink
                                className={navigationMenuTriggerStyle()}
                              >
                                Zaloguj się
                              </NavigationMenuLink>
                            </SheetClose>
                          </Link>
                        </NavigationMenuItem>
                      ) : (
                        <>
                          <NavigationMenuItem>
                            <Link href="/user/market" legacyBehavior passHref>
                              <NavigationMenuLink
                                className={navigationMenuTriggerStyle()}
                              >
                                <SheetTrigger asChild>
                                  <span>Moja giełda</span>
                                </SheetTrigger>
                              </NavigationMenuLink>
                            </Link>
                          </NavigationMenuItem>
                          <NavigationMenuItem className="hover:cursor-pointer">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <div className="relative">
                                  {offers.length +
                                    messages.length +
                                    offerMessages.length >
                                    0 && (
                                    <div className="absolute z-10 -top-2 -right-2 w-5 text-[10px] font-semibold h-5 flex justify-center text-white items-center bg-red-500 rounded-full">
                                      {offers.length +
                                        messages.length +
                                        offerMessages.length}
                                    </div>
                                  )}
                                  {avatar}
                                </div>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel className="flex flex-wrap justify-between">
                                  Moje konto <SocketIndicator />
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                  <DropdownMenuItem
                                    className="hover:cursor-pointer hover:bg-amber-400"
                                    onClick={() =>
                                      router.replace("/user/profile/account")
                                    }
                                  >
                                    <User className="mr-2 h-4 w-4" />
                                    <SheetClose asChild>
                                      <span>Profil</span>
                                    </SheetClose>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="hover:cursor-pointer hover:bg-amber-400"
                                    onClick={() =>
                                      router.replace("/user/profile/settings")
                                    }
                                  >
                                    <Settings className="mr-2 h-4 w-4" />
                                    <SheetClose asChild>
                                      <span>Ustawienia</span>
                                    </SheetClose>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="hover:cursor-pointer relative hover:bg-amber-400"
                                    onClick={() =>
                                      router.replace("/user/market/messages")
                                    }
                                  >
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    {messages.length > 0 && (
                                      <div className="absolute z-10 right-2 w-5 text-[10px] font-semibold h-5 flex justify-center text-white items-center bg-red-500 rounded-full">
                                        {messages.length}
                                      </div>
                                    )}
                                    <SheetClose asChild>
                                      <span>Wiadomości</span>
                                    </SheetClose>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="hover:cursor-pointer relative hover:bg-amber-400"
                                    onClick={() =>
                                      router.replace("/user/market/offers")
                                    }
                                  >
                                    <PenBox className="mr-2 h-4 w-4" />
                                    {offers.length + offerMessages.length >
                                      0 && (
                                      <div className="absolute z-10 right-2 w-5 text-[10px] font-semibold h-5 flex justify-center text-white items-center bg-red-500 rounded-full">
                                        {offers.length + offerMessages.length}
                                      </div>
                                    )}
                                    <SheetClose asChild>
                                      <span>Oferty</span>
                                    </SheetClose>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="hover:cursor-pointer hover:bg-amber-400 text-red-600 font-semibold"
                                    onClick={() => router.replace("/report")}
                                  >
                                    <Bug className="mr-2 h-4 w-4 " />
                                    <SheetClose asChild>
                                      <span>Zgłoś uwagę</span>
                                    </SheetClose>
                                  </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => signOut()}
                                  className="hover:cursor-pointer hover:bg-neutral-200"
                                >
                                  <LogOut className="mr-2 h-4 w-4" />
                                  <SheetClose asChild>
                                    <span>Wyloguj</span>
                                  </SheetClose>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </NavigationMenuItem>
                          {school && (
                            <NavigationMenuItem className="text-sm">
                              Dostęp wygaśnie za:{" "}
                              <span className="font-semibold text-red-500">
                                {untilExpire()}
                              </span>
                            </NavigationMenuItem>
                          )}
                        </>
                      )}
                    </NavigationMenuList>
                  </NavigationMenu>
                  <div className="flex flex-row justify-center items-center gap-4">
                    <Link
                      href="https://www.facebook.com/fenilopl"
                      target="_blank"
                    >
                      <Facebook size={20} />
                    </Link>
                  </div>
                </div>
              </SheetHeader>
            </SheetContent>
          </Sheet>
          <Link href="/" legacyBehavior passHref>
            <Image
              src={logo}
              priority
              alt="gielda-fenilo"
              className="h-full w-auto hover:cursor-pointer"
            />
          </Link>
        </div>
      </div>
      <Separator />

      <div className="lg:flex flex-row justify-end gap-12 w-full py-3 hidden lg:visible bg-transparent">
        <NavigationMenu>
          <NavigationMenuList className="gap-4">
            {data?.user.role === "school_admin" && (
              <NavigationMenuItem>
                <Link href="/school" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <Button>Zarządzaj szkołą</Button>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )}
            {data?.user?.role === "admin" && (
              <NavigationMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="relative">
                    <div>
                      {reports.length > 0 && (
                        <div className="absolute z-10 -right-2 -top-2 w-5 text-[10px] font-semibold h-5 flex justify-center text-white items-center bg-red-500 rounded-full">
                          {reports.length}
                        </div>
                      )}
                      <Button>Panel administracyjny </Button>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuGroup>
                      {menu.map((item) => (
                        <div key={item.title}>
                          <DropdownMenuItem
                            className="flex flex-col w-full justify-center items-start gap-2"
                            onClick={() => router.replace(item.href)}
                          >
                            <div className="flex justify-between w-full">
                              <span className="font-bold">{item.title}</span>
                              {reports.length > 0 &&
                                item.href === "/admin/reports" && (
                                  <div className="w-5 text-[10px] font-semibold h-5 flex justify-center text-white items-center bg-red-500 rounded-full">
                                    {reports.length}
                                  </div>
                                )}
                            </div>
                            <span>{item.description}</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </div>
                      ))}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </NavigationMenuItem>
            )}
            <NavigationMenuItem className="text-amber-500 font-bold hover:bg-amber-500 py-2 px-3 transition-all duration-500 rounded-md hover:text-black text-sm hover:font-semibold">
              <Link href="/transport/add" legacyBehavior passHref>
                <NavigationMenuLink>Dodaj ogłoszenie</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Giełda transportowa
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            {!isAuth ? (
              <NavigationMenuItem>
                <Link href="/signin" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Zaloguj się
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ) : (
              <>
                <NavigationMenuItem>
                  <Link href="/user/market" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      Moja giełda
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                {school && (
                  <NavigationMenuItem className="text-sm">
                    Dostęp wygaśnie za:{" "}
                    <span className="font-semibold text-red-500">
                      {untilExpire()}
                    </span>
                  </NavigationMenuItem>
                )}
                <NavigationMenuItem className="hover:cursor-pointer">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="relative">
                        {offers.length +
                          messages.length +
                          offerMessages.length >
                          0 && (
                          <div className="absolute z-10 -top-2 -right-2 w-5 text-[10px] font-semibold h-5 flex justify-center text-white items-center bg-red-500 rounded-full">
                            {offers.length +
                              messages.length +
                              offerMessages.length}
                          </div>
                        )}

                        {avatar}
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel className="flex flex-wrap justify-between">
                        Moje konto <SocketIndicator />
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          className="hover:cursor-pointer hover:bg-amber-400"
                          onClick={() =>
                            router.replace("/user/profile/account")
                          }
                        >
                          <User className="mr-2 h-4 w-4" />
                          <span>Profil</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="hover:cursor-pointer hover:bg-amber-400"
                          onClick={() =>
                            router.replace("/user/profile/settings")
                          }
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Ustawienia</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="hover:cursor-pointer relative hover:bg-amber-400"
                          onClick={() =>
                            router.replace("/user/market/messages")
                          }
                        >
                          <MessageSquare className="mr-2 h-4 w-4" />
                          {messages.length > 0 && (
                            <div className="absolute z-10 right-2 w-5 text-[10px] font-semibold h-5 flex justify-center text-white items-center bg-red-500 rounded-full">
                              {messages.length}
                            </div>
                          )}
                          <span>Wiadomości</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="hover:cursor-pointer relative hover:bg-amber-400"
                          onClick={() => router.replace("/user/market/offers")}
                        >
                          <PenBox className="mr-2 h-4 w-4" />
                          {offers.length + offerMessages.length > 0 && (
                            <div className="absolute z-10 right-2 w-5 text-[10px] font-semibold h-5 flex justify-center text-white items-center bg-red-500 rounded-full">
                              {offers.length + offerMessages.length}
                            </div>
                          )}
                          <span>Oferty</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="hover:cursor-pointer hover:bg-amber-400 text-red-600 font-semibold"
                          onClick={() => router.replace("/report")}
                        >
                          <Bug className="mr-2 h-4 w-4 " />
                          <span>Zgłoś uwagę</span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => signOut()}
                        className="hover:cursor-pointer hover:bg-neutral-200"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Wyloguj</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </NavigationMenuItem>
              </>
            )}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex flex-row justify-center items-center gap-4">
          <Link href="https://www.facebook.com/fenilopl" target="_blank">
            <Facebook size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default TopBar;
