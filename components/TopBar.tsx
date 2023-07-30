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
                <svg
                  className=""
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4 5C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H4ZM3 12C3 11.4477 3.44772 11 4 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H4C3.44772 13 3 12.5523 3 12ZM3 18C3 17.4477 3.44772 17 4 17H20C20.5523 17 21 17.4477 21 18C21 18.5523 20.5523 19 20 19H4C3.44772 19 3 18.5523 3 18Z"
                      fill="#000000"
                    ></path>{" "}
                  </g>
                </svg>
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
                                      router.replace("/user/settings/settings")
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
                                      router.replace("/user/settings/settings")
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
                                      router.replace("/user/market/messages")
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
                    <svg
                      className="h-6 w-6 group hover:cursor-pointer"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M17.0392 15.6244C18.2714 14.084 19.0082 12.1301 19.0082 10.0041C19.0082 5.03127 14.9769 1 10.0041 1C5.03127 1 1 5.03127 1 10.0041C1 14.9769 5.03127 19.0082 10.0041 19.0082C12.1301 19.0082 14.084 18.2714 15.6244 17.0392L21.2921 22.707C21.6828 23.0977 22.3163 23.0977 22.707 22.707C23.0977 22.3163 23.0977 21.6828 22.707 21.2921L17.0392 15.6244ZM10.0041 17.0173C6.1308 17.0173 2.99087 13.8774 2.99087 10.0041C2.99087 6.1308 6.1308 2.99087 10.0041 2.99087C13.8774 2.99087 17.0173 6.1308 17.0173 10.0041C17.0173 13.8774 13.8774 17.0173 10.0041 17.0173Z"
                          fill="#0F0F0F"
                          className="group-hover:fill-orange-400 transition-all duration-500"
                        ></path>{" "}
                      </g>
                    </svg>
                    <svg
                      className="h-6 w-6 group hover:cursor-pointer"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          className="group-hover:fill-orange-400 transition-all duration-500"
                          d="M2 6C2 3.79086 3.79086 2 6 2H18C20.2091 2 22 3.79086 22 6V18C22 20.2091 20.2091 22 18 22H6C3.79086 22 2 20.2091 2 18V6ZM6 4C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H12V13H11C10.4477 13 10 12.5523 10 12C10 11.4477 10.4477 11 11 11H12V9.5C12 7.567 13.567 6 15.5 6H16.1C16.6523 6 17.1 6.44772 17.1 7C17.1 7.55228 16.6523 8 16.1 8H15.5C14.6716 8 14 8.67157 14 9.5V11H16.1C16.6523 11 17.1 11.4477 17.1 12C17.1 12.5523 16.6523 13 16.1 13H14V20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6Z"
                          fill="#000000"
                        ></path>{" "}
                      </g>
                    </svg>
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
                            router.replace("/user/settings/settings")
                          }
                        >
                          <MessageSquare className="mr-2 h-4 w-4" />
                          <span>Wiadomości</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="hover:cursor-pointer hover:bg-amber-400"
                          onClick={() =>
                            router.replace("/user/market/messages")
                          }
                        >
                          <PenBox className="mr-2 h-4 w-4" />
                          <span>Oferty</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="hover:cursor-pointer hover:bg-amber-400"
                          onClick={() => router.replace("/user/market/offers")}
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Ustawienia</span>
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
          <svg
            className="h-6 w-6 group hover:cursor-pointer"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17.0392 15.6244C18.2714 14.084 19.0082 12.1301 19.0082 10.0041C19.0082 5.03127 14.9769 1 10.0041 1C5.03127 1 1 5.03127 1 10.0041C1 14.9769 5.03127 19.0082 10.0041 19.0082C12.1301 19.0082 14.084 18.2714 15.6244 17.0392L21.2921 22.707C21.6828 23.0977 22.3163 23.0977 22.707 22.707C23.0977 22.3163 23.0977 21.6828 22.707 21.2921L17.0392 15.6244ZM10.0041 17.0173C6.1308 17.0173 2.99087 13.8774 2.99087 10.0041C2.99087 6.1308 6.1308 2.99087 10.0041 2.99087C13.8774 2.99087 17.0173 6.1308 17.0173 10.0041C17.0173 13.8774 13.8774 17.0173 10.0041 17.0173Z"
                fill="#0F0F0F"
                className="group-hover:fill-orange-400 transition-all duration-500"
              ></path>{" "}
            </g>
          </svg>
          <svg
            className="h-6 w-6 group hover:cursor-pointer"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                className="group-hover:fill-orange-400 transition-all duration-500"
                d="M2 6C2 3.79086 3.79086 2 6 2H18C20.2091 2 22 3.79086 22 6V18C22 20.2091 20.2091 22 18 22H6C3.79086 22 2 20.2091 2 18V6ZM6 4C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H12V13H11C10.4477 13 10 12.5523 10 12C10 11.4477 10.4477 11 11 11H12V9.5C12 7.567 13.567 6 15.5 6H16.1C16.6523 6 17.1 6.44772 17.1 7C17.1 7.55228 16.6523 8 16.1 8H15.5C14.6716 8 14 8.67157 14 9.5V11H16.1C16.6523 11 17.1 11.4477 17.1 12C17.1 12.5523 16.6523 13 16.1 13H14V20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6Z"
                fill="#000000"
              ></path>{" "}
            </g>
          </svg>
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
