"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDateRangePicker } from "@/components/dashboard/date-range-picker";
import { Download, FileSpreadsheet, Users, Banknote } from "lucide-react";
import { DateRange } from "react-day-picker";

function downloadFile(url: string, filename: string) {
  fetch(url)
    .then((res) => res.blob())
    .then((blob) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      URL.revokeObjectURL(link.href);
    });
}

export function ReportsTab({ schoolId }: { schoolId: string }) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  });

  const buildUrl = (type: string, format: string) => {
    const params = new URLSearchParams({
      schoolId,
      type,
      format,
    });
    if (dateRange?.from) params.set("from", dateRange.from.toISOString());
    if (dateRange?.to) params.set("to", dateRange.to.toISOString());
    return `/api/schools/reports?${params.toString()}`;
  };

  const reports = [
    {
      title: "Raport transportów",
      description:
        "Eksportuj listę wszystkich transportów z kategoriami, pojazdami, adresami i statusami.",
      icon: FileSpreadsheet,
      type: "transports",
      hasJson: true,
    },
    {
      title: "Lista uczniów",
      description:
        "Eksportuj listę uczniów z danymi kontaktowymi, loginami i statusami kont.",
      icon: Users,
      type: "students",
      hasJson: true,
    },
    {
      title: "Raport ofert",
      description:
        "Eksportuj wszystkie oferty z kwotami, walutami i statusami akceptacji.",
      icon: Banknote,
      type: "offers",
      hasJson: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Date filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold">Eksport danych</h3>
          <p className="text-sm text-muted-foreground">
            Wybierz zakres dat i pobierz raporty
          </p>
        </div>
        <CalendarDateRangePicker
          onDateChange={setDateRange}
          defaultFrom={dateRange?.from}
          defaultTo={dateRange?.to}
        />
      </div>

      {/* Report cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <Card
              key={report.type}
              className="shadow-card transition-smooth hover:shadow-card-hover"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base font-semibold">
                    {report.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {report.description}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="brand"
                    size="sm"
                    className="flex-1"
                    onClick={() =>
                      downloadFile(
                        buildUrl(report.type, "csv"),
                        `${report.type}_${schoolId}.csv`
                      )
                    }
                  >
                    <Download className="mr-2 h-3 w-3" />
                    CSV
                  </Button>
                  {report.hasJson && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        downloadFile(
                          buildUrl(report.type, "json"),
                          `${report.type}_${schoolId}.json`
                        )
                      }
                    >
                      <Download className="mr-2 h-3 w-3" />
                      JSON
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
