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
import { RecentTransports } from "../[schoolId]/recent-transports";

import admin from "@/assets/icons/administrator.png";
import Image from "next/image";

interface PageProps {
  params: {
    schoolId: string;
  };
}

const getSchool = async (schoolId: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/schools/manage?schoolId=${schoolId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    }
  );
  const data = await res.json();
  return data;
};

export default async function SchoolPage({ params }: PageProps) {
  const data = await getSchool(params.schoolId);
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          {data.school.name}
        </h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Ogólne</TabsTrigger>
          <TabsTrigger value="analytics" disabled>
            Analityka
          </TabsTrigger>
          <TabsTrigger value="reports" disabled>
            Raporty
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="col-span-2 gap-4 flex flex-row">
              <div className="w-3/4">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Administrator szkoły
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {data.school.administrator.username}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {data.school.administrator.email}
                  </p>
                </CardContent>
              </div>
              <div className="flex items-center justify-center w-1/4">
                <Image src={admin} alt="admin" width={48} height={48} />
              </div>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Transporty
                </CardTitle>
                <svg
                  fill="#000000"
                  viewBox="-3 0 32 32"
                  version="1.1"
                  className="h-6 w-6 text-muted-foreground"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <title>truck</title>{" "}
                    <path d="M23.64 6.64h-13c-1.4 0-2.56 1.16-2.56 2.56v0.64h-1.32c-1.040 0-2.040 0.48-2.68 1.32l-2.56 3.32c-0.12 0.16-0.16 0.32-0.16 0.52v5.84h-0.48c-0.44 0-0.84 0.32-0.88 0.76-0.040 0.52 0.36 0.92 0.84 0.92h3.32c0.4 1.64 1.84 2.84 3.6 2.84s3.2-1.2 3.6-2.84h4.84c0.4 1.64 1.84 2.84 3.6 2.84s3.2-1.2 3.6-2.84h2c0.48 0 0.84-0.4 0.84-0.84v-12.48c-0.040-1.44-1.2-2.56-2.6-2.56zM5.44 12.2c0.32-0.4 0.8-0.64 1.32-0.64h1.32v2.56h-4.12l1.48-1.92zM7.76 23.68c-1.080 0-2-0.88-2-2s0.88-2 2-2 2 0.88 2 2-0.92 2-2 2zM19.76 23.68c-1.080 0-2-0.88-2-2s0.88-2 2-2 2 0.88 2 2-0.92 2-2 2zM24.48 20.84h-1.12c-0.4-1.64-1.84-2.84-3.6-2.84s-3.2 1.2-3.6 2.84h-4.8c-0.4-1.64-1.84-2.84-3.6-2.84s-3.2 1.2-3.6 2.84h-1.080v-5.040h5.84c0.48 0 0.84-0.4 0.84-0.84v-5.76c0-0.48 0.36-0.84 0.84-0.84h13c0.48 0 0.84 0.36 0.84 0.84v11.64z"></path>{" "}
                  </g>
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.school._count.transports}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Konta uczniów
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.school._count.students}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Ostatnie transporty</CardTitle>
                <CardDescription>Transporty ostatnio dodane</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentTransports transports={data.latestTransports} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
