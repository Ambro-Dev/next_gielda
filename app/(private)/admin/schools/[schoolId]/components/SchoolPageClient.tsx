"use client";

import dynamic from "next/dynamic";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewTab } from "./OverviewTab";
import { useCallback } from "react";

const TabSkeleton = () => (
  <div className="space-y-4 p-4">
    <div className="h-8 w-48 bg-muted animate-pulse rounded" />
    <div className="h-64 bg-muted animate-pulse rounded" />
  </div>
);

const AnalyticsTab = dynamic(
  () => import("./AnalyticsTab").then(m => ({ default: m.AnalyticsTab })),
  { loading: () => <TabSkeleton /> }
);

const ReportsTab = dynamic(
  () => import("./ReportsTab").then(m => ({ default: m.ReportsTab })),
  { loading: () => <TabSkeleton /> }
);

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

export function SchoolPageClient({ data }: { data: SchoolData }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentTab = searchParams?.get("tab") || "overview";

  const handleTabChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams?.toString() || "");
      if (value === "overview") {
        params.delete("tab");
      } else {
        params.set("tab", value);
      }
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname ?? "", { scroll: false });
    },
    [searchParams, router, pathname]
  );

  return (
    <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-6">
      <TabsList>
        <TabsTrigger value="overview">Ogólne</TabsTrigger>
        <TabsTrigger value="analytics">Analityka</TabsTrigger>
        <TabsTrigger value="reports">Raporty</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <OverviewTab data={data} />
      </TabsContent>

      <TabsContent value="analytics">
        <AnalyticsTab schoolId={data.school.id} />
      </TabsContent>

      <TabsContent value="reports">
        <ReportsTab schoolId={data.school.id} />
      </TabsContent>
    </Tabs>
  );
}
