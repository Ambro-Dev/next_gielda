"use client";

import Image from "next/image";
import logo from "../public/gielda-fenilo.webp";
import {
  NavigationMenuContent,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
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
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  User,
  Settings,
  LogOut,
  MessageSquare,
  StickyNote,
  PenBox,
  Menu,
  Search,
  Facebook,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

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
];

const TopBar = () => {
  const router = useRouter();
  const { data, status } = useSession();

  const isAuth = status === "authenticated";
  return (
    <div className="fixed w-full px-10 bg-white backdrop-blur-sm bg-opacity-80 shadow-md z-10">
      <div className="flex flex-col w-full h-full ">
        <div className="flex justify-start flex-row items-center w-full h-16  py-1">
          <Sheet>
            <SheetTrigger asChild>
              <button className="w-10 h-10 mr-4 lg:hidden">
                <Menu size={36} />
              </button>
            </SheetTrigger>
            <SheetContent side={"left"}>
              <SheetHeader>
                <SheetTitle>
                  <Image src={logo} priority alt="fenilo-gielda" />
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
                            <DropdownMenuTrigger asChild>
                              <Button>Panel administracyjny</Button>
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
                                        <span className="font-bold">
                                          {item.title}
                                        </span>
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
                            <SheetClose asChild>
                              <p>Giełda transportowa</p>
                            </SheetClose>
                          </NavigationMenuLink>
                        </Link>
                      </NavigationMenuItem>
                      {!isAuth ? (
                        <NavigationMenuItem>
                          <Link href="/signin" legacyBehavior passHref>
                            <NavigationMenuLink
                              className={navigationMenuTriggerStyle()}
                            >
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
                                <SheetClose asChild>
                                  <span>Moja giełda</span>
                                </SheetClose>
                              </NavigationMenuLink>
                            </Link>
                          </NavigationMenuItem>
                          <NavigationMenuItem className="hover:cursor-pointer">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Avatar>
                                  <AvatarFallback className="capitalize">
                                    {data?.user.username.substring(0, 1)}
                                  </AvatarFallback>
                                </Avatar>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>
                                  Moje konto
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
                                    className="hover:cursor-pointer hover:bg-amber-400"
                                    onClick={() =>
                                      router.replace("/user/market/messages")
                                    }
                                  >
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    <SheetClose asChild>
                                      <span>Wiadomości</span>
                                    </SheetClose>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="hover:cursor-pointer hover:bg-amber-400"
                                    onClick={() =>
                                      router.replace("/user/market/offers")
                                    }
                                  >
                                    <PenBox className="mr-2 h-4 w-4" />
                                    <SheetClose asChild>
                                      <span>Oferty</span>
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
                        </>
                      )}
                    </NavigationMenuList>
                  </NavigationMenu>
                  <div className="flex flex-row justify-center items-center gap-4">
                    <Search size={20} />
                    <Facebook size={20} />
                  </div>
                </div>
              </SheetHeader>
            </SheetContent>
          </Sheet>

          <Image
            src={logo}
            priority
            alt="gielda-fenilo"
            className="h-full w-auto"
          />
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
                  <DropdownMenuTrigger asChild>
                    <Button>Panel administracyjny</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuGroup>
                      {menu.map((item) => (
                        <div key={item.title}>
                          <DropdownMenuItem
                            className="flex flex-col w-full justify-center items-start gap-2"
                            onClick={() => router.replace(item.href)}
                          >
                            <span className="font-bold">{item.title}</span>
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
                <NavigationMenuItem className="hover:cursor-pointer">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Avatar>
                        <AvatarFallback className="capitalize">
                          {data?.user.username.substring(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>Moje konto</DropdownMenuLabel>
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
                          className="hover:cursor-pointer hover:bg-amber-400"
                          onClick={() =>
                            router.replace("/user/market/messages")
                          }
                        >
                          <MessageSquare className="mr-2 h-4 w-4" />
                          <span>Wiadomości</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="hover:cursor-pointer hover:bg-amber-400"
                          onClick={() => router.replace("/user/market/offers")}
                        >
                          <PenBox className="mr-2 h-4 w-4" />
                          <span>Oferty</span>
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
          <Search size={20} />
          <Facebook size={20} />
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
