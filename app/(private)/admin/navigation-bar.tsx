"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const schoolsMenu: { title: string; href: string; description: string }[] = [
  {
    title: "Zarządzaj szkołami",
    href: "/admin/schools/all",
    description:
      "Zarządzaj szkołami, które są dostępne dla użytkowników aplikacji.",
  },
  {
    title: "Zarządzaj użytkownikami",
    href: "/admin/schools/users",
    description:
      "Zarządzaj użytkownikami, którzy mają dostęp do szkół w aplikacji.",
  },
];

const setting: { title: string; href: string; description: string }[] = [
  {
    title: "Dostęp dla pracowników",
    href: "/admin/setting/users",
    description:
      "Zarządzaj użytkownikami, którzy mają dostęp do panelu administratora.",
  },
  {
    title: "Ustawienia transportów",
    href: "/admin/setting/transport",
    description: "Zarządzaj ustawieniami transportów.",
  },
];

export function NavigationBar() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/admin" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Panel główny
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Szkoły</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {schoolsMenu.map((item) => (
                <ListItem key={item.title} title={item.title} href={item.href}>
                  {item.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Ustawienia aplikacji</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {setting.map((item) => (
                <ListItem key={item.title} title={item.title} href={item.href}>
                  {item.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

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
