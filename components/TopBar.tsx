import Image from "next/image";
import logo from "../public/gielda-fenilo.webp";
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
import React from "react";

import { Menu, Facebook } from "lucide-react";
import { axiosInstance } from "@/lib/axios";
import MobileNavMenu from "./MobileNavMenu";
import DesktopNavMenu from "./DesktopNavMenu";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import OfferIndicatior from "@/components/ui/offer-indicatior";
import { School } from "@prisma/client";

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

const schoolData = async (userId: string): Promise<School | undefined> => {
  try {
    const response = await axiosInstance.get(`/api/school?userId=${userId}`);
    const data = response.data;
    return data.school;
  } catch (error) {
    return undefined;
  }
};

const TopBar = async () => {
  const data = await getServerSession(authOptions);

  const school =
    data?.user?.role === "student" || data?.user?.role === "school_admin"
      ? await schoolData(String(data.user.id))
      : null;

  return (
    <div className="fixed w-full px-10 bg-white backdrop-blur-sm bg-opacity-80 shadow-md z-10">
      <div className="flex flex-col w-full h-full ">
        <div className="flex justify-start flex-row items-center w-full h-16  py-1">
          <Sheet>
            <SheetTrigger asChild>
              <div className="relative lg:hidden">
                <OfferIndicatior />
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
                  <MobileNavMenu data={data} school={school} menu={menu} />
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
      <div className="hidden lg:block">
        <div className="flex flex-row justify-end gap-12 w-full py-3 bg-transparent ">
          <DesktopNavMenu data={data} school={school} menu={menu} />
          <div className="flex flex-row justify-center items-center gap-4">
            <Link href="https://www.facebook.com/fenilopl" target="_blank">
              <Facebook size={20} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
