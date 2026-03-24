"use client";

import { Card } from "@/components/ui/card";
import { Mail } from "lucide-react";
import AddSchoolAdmin from "../add-school-admin";

type Admin = {
  id: string;
  username: string;
  email: string;
  name: string;
  surname: string;
};

type Props = {
  administrators: Admin[];
  schoolId: string;
};

export function AdminsGrid({ administrators, schoolId }: Props) {
  if (administrators.length === 0) {
    return (
      <Card className="shadow-card transition-smooth hover:shadow-card-hover">
        <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
          <div className="rounded-full bg-primary/10 p-4">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">Brak administratorów</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Dodaj administratora, aby mógł zarządzać jednostką.
            </p>
          </div>
          <AddSchoolAdmin schoolId={schoolId} />
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium tracking-wide text-muted-foreground">
        Administratorzy
      </h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {administrators.map((admin) => {
          const initials =
            (admin.name?.[0] || "").toUpperCase() +
            (admin.surname?.[0] || "").toUpperCase();
          return (
            <Card
              key={admin.id}
              className="shadow-card transition-smooth hover:shadow-card-hover p-4"
            >
              <div className="flex items-center gap-3">
                <div className="fenilo-gradient flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white">
                  {initials || "A"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {admin.username}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {[admin.name, admin.surname].filter(Boolean).join(" ")}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {admin.email}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      <AddSchoolAdmin
        schoolId={schoolId}
        className="w-full"
        size="default"
        variant="secondary"
      />
    </div>
  );
}
