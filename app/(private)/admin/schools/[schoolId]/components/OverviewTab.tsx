"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, Users, Banknote, Clock, ArrowRight } from "lucide-react";
import { GetExpireTimeLeft } from "@/app/lib/getExpireTimeLeft";
import { MetricCard } from "./MetricCard";
import { AdminsGrid } from "./AdminsGrid";
import Link from "next/link";
import { cn } from "@/lib/utils";

type SchoolData = {
  school: {
    id: string;
    name: string;
    createdAt: Date;
    isActive: boolean;
    _count: {
      transports: number;
      students: number;
    };
    administrators: {
      id: string;
      username: string;
      email: string;
      name: string;
      surname: string;
    }[];
    accessExpires: Date;
  };
  latestTransports: {
    id: string;
    description: string;
    createdAt: Date;
    vehicle: { id: string; name: string };
    category: { id: string; name: string };
    creator: { id: string; username: string };
    _count: { objects: number };
  }[];
  offersCount: number;
};

function formatRelativeDate(dateStr: string | Date): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Dzisiaj";
  if (diffDays === 1) return "Wczoraj";
  if (diffDays < 7) return `${diffDays} dni temu`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} tyg. temu`;
  return date.toLocaleDateString("pl-PL", { day: "numeric", month: "short" });
}

export function OverviewTab({ data }: { data: SchoolData }) {
  const timeToExpire = GetExpireTimeLeft(data.school.accessExpires);

  const accessPercentage = timeToExpire.isExpired
    ? 0
    : Math.min(100, Math.round((timeToExpire.daysLeft / 365) * 100));

  const accessColor = timeToExpire.isExpired
    ? "bg-red-500"
    : timeToExpire.daysLeft > 60
      ? "bg-emerald-500"
      : timeToExpire.daysLeft > 15
        ? "bg-amber-500"
        : "bg-red-500";

  return (
    <div className="space-y-6">
      {/* Metrics row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Transporty"
          value={data.school._count.transports}
          icon={Truck}
          description="Łączna liczba transportów"
          className="animate-stagger-1"
        />
        <MetricCard
          title="Konta uczniów"
          value={data.school._count.students}
          icon={Users}
          description="Zarejestrowanych uczniów"
          className="animate-stagger-2"
        />
        <MetricCard
          title="Oferty"
          value={data.offersCount}
          icon={Banknote}
          description="Złożonych ofert na transporty"
          className="animate-stagger-3"
        />
        <MetricCard
          title="Status dostępu"
          value={
            timeToExpire.isExpired
              ? "Wygasł"
              : `${timeToExpire.daysLeft} dni`
          }
          icon={Clock}
          description={
            timeToExpire.isExpired
              ? "Dostęp wygasł — odnów subskrypcję"
              : "Do wygaśnięcia dostępu"
          }
          className="animate-stagger-4"
        >
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className={cn("h-full rounded-full transition-all", accessColor)}
              style={{ width: `${accessPercentage}%` }}
            />
          </div>
        </MetricCard>
      </div>

      {/* Administrators */}
      <div className="animate-stagger-5">
        <AdminsGrid
          administrators={data.school.administrators}
          schoolId={data.school.id}
        />
      </div>

      {/* Recent transports */}
      <Card className="shadow-card transition-smooth hover:shadow-card-hover">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              Ostatnie transporty
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Najnowsze zlecenia transportowe
            </p>
          </div>
          <Link
            href={`/admin/schools/${data.school.id}/transports`}
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Zobacz wszystkie
            <ArrowRight className="h-3 w-3" />
          </Link>
        </CardHeader>
        <CardContent>
          {data.latestTransports.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Brak transportów
            </p>
          ) : (
            <div className="space-y-1">
              {data.latestTransports.map((transport) => (
                <Link
                  key={transport.id}
                  href={`/transport/${transport.id}`}
                  className="flex items-center gap-4 rounded-lg p-3 transition-smooth hover:bg-accent"
                >
                  <div className="flex gap-2">
                    <Badge variant="brand" className="text-xs">
                      {transport.category.name}
                    </Badge>
                    <Badge variant="dark" className="text-xs">
                      {transport.vehicle.name}
                    </Badge>
                  </div>
                  <div className="ml-auto flex items-center gap-6 text-sm">
                    <span className="text-muted-foreground">
                      {transport.creator.username}
                    </span>
                    <span className="text-muted-foreground">
                      {transport._count.objects} obj.
                    </span>
                    <span className="min-w-[80px] text-right text-xs text-muted-foreground">
                      {formatRelativeDate(transport.createdAt)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
