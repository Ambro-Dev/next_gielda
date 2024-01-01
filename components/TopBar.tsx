"use client";

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
import OfferIndicatior from "@/components/ui/offer-indicatior";
import { School } from "@prisma/client";
import { useSession } from "next-auth/react";

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

const TopBar = () => {
  const { data } = useSession();
  const [school, setSchool] = React.useState<School | undefined>(undefined);

  const [isMobile, setIsMobile] = React.useState<boolean>(false);
  const handleResize = () => {
    if (window.innerWidth < 1024) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  React.useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    if (school) return;
    if (data?.user?.role === "student" || data?.user?.role === "school_admin")
      schoolData(String(data.user.id)).then((res) => setSchool(res));
  }, [data]);

  return (
    <div className="fixed w-full sm:px-10 px-5 bg-white backdrop-blur-sm bg-opacity-80 shadow-md z-10">
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
            <SheetContent side={"left"} className="overflow-y-auto">
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
      <div
        style={
          isMobile
            ? { display: "none" }
            : { display: "flex", flexDirection: "row" }
        }
      >
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
