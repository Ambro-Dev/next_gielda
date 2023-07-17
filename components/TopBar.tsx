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

const TopBar = () => {
  const { data, status } = useSession();

  console.log(data, status);

  const isAuth = status === "authenticated";

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  return (
    <div className="fixed w-full px-10 bg-white shadow-md z-10">
      <div className="flex flex-col w-full h-full ">
        <div className="flex justify-start flex-row items-center w-full h-16 py-1">
          <Sheet>
            <SheetTrigger asChild>
              <button
                className="w-10 h-10 mr-4 lg:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
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
                      <NavigationMenuItem className="text-amber-500 font-bold hover:bg-amber-500 py-2 px-3 transition-none duration-500 rounded-md hover:text-black text-sm hover:font-semibold">
                        <Link href="/docs" legacyBehavior passHref>
                          <NavigationMenuLink>
                            Dodaj ogłoszenie
                          </NavigationMenuLink>
                        </Link>
                      </NavigationMenuItem>
                      <NavigationMenuItem>
                        <Link href="/" legacyBehavior passHref>
                          <NavigationMenuLink
                            className={navigationMenuTriggerStyle()}
                          >
                            Giełda transportowa
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
                            <div>{data?.user?.username}</div>
                          </NavigationMenuItem>
                          <NavigationMenuItem>
                            <NavigationMenuLink
                              className={navigationMenuTriggerStyle()}
                            >
                              <Button
                                className="bg-transparent hover:bg-transparent text-black bg:text-black"
                                onClick={() => signOut()}
                              >
                                Wyloguj się
                              </Button>
                            </NavigationMenuLink>
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

      <div className="lg:flex flex-row justify-end gap-12 w-full py-3 hidden lg:visible bg-white">
        <NavigationMenu>
          <NavigationMenuList className="gap-4">
            <NavigationMenuItem className="text-amber-500 font-bold hover:bg-amber-500 py-2 px-3 transition-none duration-500 rounded-md hover:text-black text-sm hover:font-semibold">
              <Link href="/docs" legacyBehavior passHref>
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
                  <div>{data?.user?.username}</div>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <Button
                      className="bg-transparent hover:bg-transparent text-black bg:text-black"
                      onClick={() => signOut()}
                    >
                      Wyloguj się
                    </Button>
                  </NavigationMenuLink>
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

export default TopBar;
