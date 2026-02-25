"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { axiosInstance } from "@/lib/axios";
import React from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Report } from "@prisma/client";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileWarning } from "lucide-react";

const getReports = async (): Promise<Report[]> => {
  try {
    const response = await axiosInstance.get("/api/report");
    const reports = response.data.reports;
    return reports;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const Page = () => {
  const [reports, setReports] = React.useState<Report[]>([]);

  React.useEffect(() => {
    if (reports.length > 0) return;
    getReports().then((reports) => setReports(reports));
  }, [reports]);

  return (
    <div className="py-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          Uwagi i zgłoszenia
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Lista wszystkich zgłoszeń i uwag od użytkowników.
        </p>
      </div>
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="pt-6">
          {reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FileWarning className="w-10 h-10 text-gray-300 mb-3" />
              <p className="text-gray-500">Brak zgłoszeń</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
            <Table>
              <TableCaption>Lista wszystkich zgłoszeń i uwag</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Lp.</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Miejsce</TableHead>
                  <TableHead>Opis</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report, index) => {
                  const date = new Date(report.createdAt);
                  return (
                    <TableRow
                      key={report.id}
                      className={!report.seen ? "font-semibold" : ""}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        {date.toLocaleDateString("pl-PL")}
                      </TableCell>
                      <TableCell className="truncate sm:max-w-[200px] max-w-[100px]">
                        {report.place}
                      </TableCell>
                      <TableCell className="truncate sm:max-w-md max-w-[200px]">
                        {report.content}
                      </TableCell>
                      <TableCell>
                        {report.seen ? (
                          <Badge variant="secondary" className="text-xs">
                            Przeczytane
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="text-xs">
                            Nieprzeczytane
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/admin/reports/${report.id}`}>
                          <Button variant="outline" size="sm">
                            Wyświetl
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
