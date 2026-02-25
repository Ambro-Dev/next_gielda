import { Metadata } from "next";

import { Search } from "@/components/dashboard/search";
import TeamSwitcher from "@/components/dashboard/team-switcher";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { School, Truck, Users } from "lucide-react";
import { axiosInstance } from "@/lib/axios";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app using the components.",
};

type Data = {
  transports: number;
  schools: number;
  students: number;
};

const getData = async (): Promise<Data> => {
  try {
    const response = await axiosInstance.get(`/api/admin/all`);
    return response.data;
  } catch (error) {
    return {
      transports: 0,
      schools: 0,
      students: 0,
    };
  }
};

export default async function SchoolManagement() {
  const data = await getData();
  return (
    <div className="py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Panel administratora
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Zarządzaj szkołami, transportami i użytkownikami.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <TeamSwitcher schoolId="" />
          <Search />
        </div>
      </div>
      <div className="grid lg:grid-cols-3 sm:grid-cols-3 grid-cols-1 gap-4">
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Szkoły
            </CardTitle>
            <School size={20} className="text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.schools}</div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Wszystkie transporty
            </CardTitle>
            <Truck size={20} className="text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.transports}</div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Wszystkich studentów
            </CardTitle>
            <Users size={20} className="text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.students}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
