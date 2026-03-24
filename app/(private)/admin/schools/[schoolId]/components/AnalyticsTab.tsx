"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MetricCard } from "./MetricCard";
import { axiosInstance } from "@/lib/axios";
import {
  Truck,
  Banknote,
  DollarSign,
  Users,
  UserCheck,
  UserPlus,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";

type AnalyticsData = {
  transportsByMonth: { month: string; count: number }[];
  categoryDistribution: { name: string; count: number }[];
  vehicleUsage: { name: string; count: number }[];
  studentActivity: {
    totalStudents: number;
    activeStudents: number;
    newStudentsThisMonth: number;
  };
  offersStats: {
    totalOffers: number;
    averageBrutto: number;
    offersByMonth: { month: string; count: number }[];
  };
  trends: {
    transportsThisMonth: number;
    transportsPrevMonth: number;
    offersThisMonth: number;
    offersPrevMonth: number;
  };
};

const CHART_COLORS = [
  "hsl(39, 85%, 50%)",
  "hsl(225, 30%, 30%)",
  "hsl(39, 85%, 65%)",
  "hsl(225, 30%, 50%)",
  "hsl(39, 60%, 40%)",
  "hsl(200, 40%, 50%)",
];

function calcTrend(current: number, previous: number) {
  if (previous === 0) return current > 0 ? { value: 100, isPositive: true } : undefined;
  const change = Math.round(((current - previous) / previous) * 100);
  return { value: Math.abs(change), isPositive: change >= 0 };
}

function ChartTooltipContent({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; name: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-card px-3 py-2 shadow-card">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-semibold">
          {entry.value}
        </p>
      ))}
    </div>
  );
}

export function AnalyticsTab({ schoolId }: { schoolId: string }) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get(`/api/schools/analytics?schoolId=${schoolId}`)
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [schoolId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        Nie udało się załadować danych analitycznych.
      </p>
    );
  }

  const transportTrend = calcTrend(
    data.trends.transportsThisMonth,
    data.trends.transportsPrevMonth
  );
  const offersTrend = calcTrend(
    data.trends.offersThisMonth,
    data.trends.offersPrevMonth
  );

  return (
    <div className="space-y-6">
      {/* Key metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Transporty w tym miesiącu"
          value={data.trends.transportsThisMonth}
          icon={Truck}
          trend={transportTrend}
          className="animate-stagger-1"
        />
        <MetricCard
          title="Oferty w tym miesiącu"
          value={data.trends.offersThisMonth}
          icon={Banknote}
          trend={offersTrend}
          className="animate-stagger-2"
        />
        <MetricCard
          title="Średnia wartość oferty"
          value={`${data.offersStats.averageBrutto} PLN`}
          icon={DollarSign}
          description="Średnia brutto ze wszystkich ofert"
          className="animate-stagger-3"
        />
        <MetricCard
          title="Aktywni uczniowie"
          value={data.studentActivity.activeStudents}
          icon={UserCheck}
          description={`${data.studentActivity.totalStudents} łącznie, ${data.studentActivity.newStudentsThisMonth} nowych w tym miesiącu`}
          className="animate-stagger-4"
        />
      </div>

      {/* Charts row 1 */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Transport volume */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Wolumen transportów
            </CardTitle>
            <p className="text-xs text-muted-foreground">Ostatnie 12 miesięcy</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={data.transportsByMonth}>
                <defs>
                  <linearGradient id="transportGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(39, 85%, 50%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(39, 85%, 50%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 90%)" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="hsl(39, 85%, 50%)"
                  strokeWidth={2}
                  fill="url(#transportGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category distribution */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Rozkład kategorii
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Podział transportów według kategorii
            </p>
          </CardHeader>
          <CardContent>
            {data.categoryDistribution.length === 0 ? (
              <p className="py-16 text-center text-sm text-muted-foreground">
                Brak danych
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={data.categoryDistribution}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="count"
                    nameKey="name"
                  >
                    {data.categoryDistribution.map((_, index) => (
                      <Cell
                        key={index}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    iconSize={8}
                    formatter={(value: string) => (
                      <span className="text-xs text-muted-foreground">
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts row 2 */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Vehicle usage */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Wykorzystanie pojazdów
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Typy pojazdów w transportach
            </p>
          </CardHeader>
          <CardContent>
            {data.vehicleUsage.length === 0 ? (
              <p className="py-16 text-center text-sm text-muted-foreground">
                Brak danych
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data.vehicleUsage} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(0, 0%, 90%)"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    width={120}
                  />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="count"
                    fill="hsl(225, 30%, 30%)"
                    radius={[0, 4, 4, 0]}
                    barSize={24}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Student activity */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Aktywność uczniów
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Przegląd kont uczniów
            </p>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Łącznie uczniów</p>
                <p className="text-2xl font-bold">
                  {data.studentActivity.totalStudents}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-emerald-500/10 p-3">
                <UserCheck className="h-5 w-5 text-emerald-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Aktywni uczniowie</p>
                <p className="text-2xl font-bold">
                  {data.studentActivity.activeStudents}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-500/10 p-3">
                <UserPlus className="h-5 w-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  Nowi w tym miesiącu
                </p>
                <p className="text-2xl font-bold">
                  {data.studentActivity.newStudentsThisMonth}
                </p>
              </div>
            </div>

            {data.studentActivity.totalStudents > 0 && (
              <div>
                <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                  <span>Wskaźnik aktywności</span>
                  <span>
                    {Math.round(
                      (data.studentActivity.activeStudents /
                        data.studentActivity.totalStudents) *
                        100
                    )}
                    %
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{
                      width: `${Math.round(
                        (data.studentActivity.activeStudents /
                          data.studentActivity.totalStudents) *
                          100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
