"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

type MetricCardProps = {
  title: string;
  value: string | number;
  description?: string;
  trend?: { value: number; isPositive: boolean };
  icon: LucideIcon;
  className?: string;
  children?: React.ReactNode;
};

export function MetricCard({
  title,
  value,
  description,
  trend,
  icon: Icon,
  className,
  children,
}: MetricCardProps) {
  return (
    <Card
      className={cn(
        "shadow-card transition-smooth hover:shadow-card-hover",
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium tracking-wide text-muted-foreground">
          {title}
        </CardTitle>
        <div className="rounded-lg bg-primary/10 p-2">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        {trend && (
          <div className="mt-1 flex items-center gap-1">
            {trend.isPositive ? (
              <TrendingUp className="h-3 w-3 text-emerald-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
            <span
              className={cn(
                "text-xs font-medium",
                trend.isPositive ? "text-emerald-500" : "text-red-500"
              )}
            >
              {trend.isPositive ? "+" : ""}
              {trend.value}% vs poprz. miesiąc
            </span>
          </div>
        )}
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
        {children}
      </CardContent>
    </Card>
  );
}
