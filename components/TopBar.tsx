"use client";

import Image from "next/image";
const logo = "/gielda-fenilo.webp";
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

import { Menu } from "lucide-react";
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

  React.useEffect(() => {
    if (school) return;
    if (data?.user?.role === "student" || data?.user?.role === "school_admin")
      schoolData(String(data.user.id)).then((res) => setSchool(res));
  }, [data]);

  return (
    <header className="fixed w-full bg-navy z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Left: Mobile hamburger + Logo */}
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <Sheet>
              <SheetTrigger asChild>
                <div className="relative lg:hidden">
                  <OfferIndicatior />
                  <button className="p-1.5 -ml-1.5 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors">
                    <Menu size={20} />
                  </button>
                </div>
              </SheetTrigger>
              <SheetContent side={"left"} className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <SheetClose asChild>
                      <Link href="/transport">
                        <Image
                          src={logo}
                          priority
                          alt="fenilo-gielda"
                          width={140}
                          height={40}
                          className="hover:cursor-pointer"
                        />
                      </Link>
                    </SheetClose>
                  </SheetTitle>
                  <Separator />
                  <div className="flex flex-col justify-center items-center gap-8 py-6">
                    <MobileNavMenu data={data} school={school} menu={menu} />
                  </div>
                </SheetHeader>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link href="/transport">
              <Image
                src={logo}
                priority
                alt="gielda-fenilo"
                width={130}
                height={36}
                className="h-8 w-auto hover:opacity-90 transition-opacity brightness-0 invert"
              />
            </Link>
          </div>

          {/* Right: Desktop navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <DesktopNavMenu data={data} school={school} menu={menu} />
          </nav>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
