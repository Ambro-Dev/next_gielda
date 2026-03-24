"use client";

import React from "react";
import { Truck, Tag, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MetricCard } from "@/app/(private)/admin/schools/[schoolId]/components/MetricCard";
import { OptionCard } from "./option-card";

type SettingsItem = {
  id: string;
  name: string;
};

type TransportOptionsClientProps = {
  vehicles: SettingsItem[];
  categories: SettingsItem[];
};

export function TransportOptionsClient({
  vehicles,
  categories,
}: TransportOptionsClientProps) {
  const totalOptions = vehicles.length + categories.length;

  const data = [
    {
      options: vehicles,
      route: "vehicles",
      title: "Pojazdy",
      description: "Dodaj, edytuj lub usuń pojazdy.",
      noData: "Brak pojazdów.",
      icon: Truck,
      className: "animate-stagger-4",
      dialog: {
        title: "Dodaj pojazd",
        description: "Dodaj nowy pojazd.",
        button: "Dodaj",
        formName: "Nazwa pojazdu",
        formDescription: "Nazwa nowego pojazdu.",
      },
    },
    {
      options: categories,
      route: "categories",
      title: "Kategorie",
      description: "Dodaj, edytuj lub usuń kategorie.",
      noData: "Brak kategorii.",
      icon: Tag,
      className: "animate-stagger-5",
      dialog: {
        title: "Dodaj kategorię",
        description: "Dodaj nową kategorię.",
        button: "Dodaj",
        formName: "Nazwa kategorii",
        formDescription: "Nazwa nowej kategorii.",
      },
    },
  ];

  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold tracking-tight">
              Opcje transportów
            </h2>
            <Badge variant="secondary">{totalOptions} opcji</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Zarządzaj pojazdami i kategoriami transportów.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Pojazdy"
          value={vehicles.length}
          icon={Truck}
          description="Zdefiniowanych typów pojazdów"
          className="animate-stagger-1"
        />
        <MetricCard
          title="Kategorie"
          value={categories.length}
          icon={Tag}
          description="Zdefiniowanych kategorii"
          className="animate-stagger-2"
        />
        <MetricCard
          title="Łącznie opcji"
          value={totalOptions}
          icon={Settings}
          description="Wszystkich dostępnych opcji"
          className="animate-stagger-3"
        />
      </div>

      <div className="grid sm:grid-cols-2 grid-cols-1 gap-6">
        {data.map((item) => (
          <React.Fragment key={item.title}>
            <OptionCard {...item} />
          </React.Fragment>
        ))}
      </div>
    </>
  );
}
