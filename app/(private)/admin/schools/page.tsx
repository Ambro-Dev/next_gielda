import { Metadata } from "next";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDateRangePicker } from "@/components/dashboard/date-range-picker";
import { RecentSales } from "@/components/dashboard/recent-sales";
import { Search } from "@/components/dashboard/search";
import { MainNav } from "@/components/dashboard/main-nav";
import TeamSwitcher from "@/components/dashboard/team-switcher";
import axios from "@/lib/axios";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app using the components.",
};

export default async function SchoolManagement() {
  return (
    <div className="flex flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <TeamSwitcher schoolId="" />
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <Search />
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6"></div>
    </div>
  );
}
