"use client";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const notSelected =
  "text-sm font-medium text-muted-foreground transition-colors hover:text-primary";

const selected = "text-sm font-medium transition-colors hover:text-primary";

export function MainNav({
  schoolId,
  ...props
}: {
  schoolId: string | undefined;
}) {
  const pathname = usePathname();

  if (pathname === "/admin/schools") return null;

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6 mx-6")}
      {...props}
    >
      <Link
        href={`/admin/schools/${schoolId}`}
        className={
          pathname === `/admin/schools/${schoolId}` ? selected : notSelected
        }
      >
        Panel gówny
      </Link>
      <Link
        href={`/admin/schools/${schoolId}/students`}
        className={
          pathname === `/admin/schools/${schoolId}/students`
            ? selected
            : notSelected
        }
      >
        Użytkownicy
      </Link>
      <Link
        href={`/admin/schools/${schoolId}/transports`}
        className={
          pathname === `/admin/schools/${schoolId}/transports`
            ? selected
            : notSelected
        }
      >
        Transporty
      </Link>
      <Link
        href="/examples/dashboard"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Ustawienia
      </Link>
    </nav>
  );
}
