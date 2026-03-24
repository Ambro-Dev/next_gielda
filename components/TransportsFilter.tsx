"use client";

import React, { useCallback, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import TransportsMap from "@/components/dashboard/transports-map";
import { Tags, Transport } from "@/app/(private)/transport/page";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

import noResults from "@/assets/animations/no-results.json";
import noOffers from "@/assets/animations/no-offers.json";
import SearchNearby from "./SearchNearby";
import {
  distanceToPolyline,
  calculateSearchRadius,
} from "@/lib/geo-utils";

type Props = {
  categories: Tags[];
  vehicles: Tags[];
  transports: Transport[];
};

const FilterDropdown = ({
  label,
  items,
  selectedIds,
  onToggle,
}: {
  label: string;
  items: Tags[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}) => {
  const activeCount = selectedIds.length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-sm font-normal"
        >
          {label}
          {activeCount > 0 && (
            <span className="ml-1 w-5 h-5 text-[10px] font-semibold flex items-center justify-center bg-primary text-white rounded-full">
              {activeCount}
            </span>
          )}
          <ChevronDown size={14} className="text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="start">
        <div className="flex flex-col gap-1">
          {items
            .filter((item) => item._count.transports > 0)
            .map((item) => (
              <label
                key={item.id}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-gray-50 cursor-pointer text-sm"
              >
                <Checkbox
                  checked={selectedIds.includes(item.id)}
                  onCheckedChange={() => onToggle(item.id)}
                />
                <span className="capitalize flex-1">{item.name}</span>
                <span className="text-xs text-muted-foreground">
                  {item._count.transports}
                </span>
              </label>
            ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

const TransportsFilter = (props: Props) => {
  const router = useRouter();
  const { categories, vehicles, transports } = props;

  const search = useMemo(() => {
    return new URLSearchParams({
      from: "",
      to: "",
    });
  }, []);

  const searchParams = useSearchParams() || search;

  const [searchString, setSearchString] = React.useState<string>(
    searchParams.toString()
  );

  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    searchParams.getAll("category")
  );
  const [selectedVehicles, setSelectedVehicles] = React.useState<string[]>(
    searchParams.getAll("vehicle")
  );

  const [routePolyline, setRoutePolyline] = React.useState<
    [number, number][] | null
  >(null);
  const [routeLengthKm, setRouteLengthKm] = React.useState<number>(0);

  const [filteredTransports, setFilteredTransports] =
    React.useState<Transport[]>(transports);

  useEffect(() => {
    setSearchString(searchParams.toString());
    setSelectedCategories(searchParams.getAll("category"));
    setSelectedVehicles(searchParams.getAll("vehicle"));
  }, [searchParams]);

  // Filter transports by category, vehicle, and route
  useEffect(() => {
    let filtered = transports.filter((transport) => {
      if (selectedCategories.length === 0 && selectedVehicles.length === 0) {
        return true;
      }

      if (selectedCategories.length === 0) {
        return selectedVehicles.includes(transport.vehicle.id);
      }

      if (selectedVehicles.length === 0) {
        return selectedCategories.includes(transport.category.id);
      }

      return (
        selectedCategories.includes(transport.category.id) &&
        selectedVehicles.includes(transport.vehicle.id)
      );
    });

    // Route proximity filter
    if (routePolyline && routePolyline.length > 0) {
      const radius = calculateSearchRadius(routeLengthKm);
      filtered = filtered
        .map((t) => {
          const start = t.directions?.start;
          if (!start) return { transport: t, distance: Infinity };
          const dist = distanceToPolyline(
            start.lat,
            start.lng,
            routePolyline
          );
          return { transport: t, distance: dist };
        })
        .filter((item) => item.distance <= radius)
        .sort((a, b) => a.distance - b.distance)
        .map((item) => item.transport);
    }

    setFilteredTransports(filtered);
  }, [searchParams, routePolyline, routeLengthKm, transports, selectedCategories, selectedVehicles]);

  useEffect(() => {
    if (selectedVehicles.length === 0) {
      setSearchString(`${searchString.replace("vehicle", "")}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVehicles]);

  useEffect(() => {
    if (selectedCategories.length === 0) {
      setSearchString(`${searchString.replace("category", "")}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategories]);

  function handleSearch() {
    router.push(`/transport?${searchString}`);
  }

  function handleCategoryChange(id: string) {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== id));
      setSearchString(`${searchString.replace(`category=${id}`, "")}`);
    } else {
      setSelectedCategories([...selectedCategories, id]);
      setSearchString(`${searchString}&category=${id}`);
    }
  }

  function handleVehicleChange(id: string) {
    if (selectedVehicles.includes(id)) {
      setSelectedVehicles(selectedVehicles.filter((c) => c !== id));
      setSearchString(`${searchString.replace(`vehicle=${id}`, "")}`);
    } else {
      setSelectedVehicles([...selectedVehicles, id]);
      setSearchString(`${searchString}&vehicle=${id}`);
    }
  }

  function clearFilters() {
    setSelectedCategories([]);
    setSelectedVehicles([]);
    setRoutePolyline(null);
    setRouteLengthKm(0);
    router.push("/transport");
  }

  const handleRouteFound = useCallback(
    (polylinePoints: [number, number][], lengthKm: number) => {
      setRoutePolyline(polylinePoints);
      setRouteLengthKm(lengthKm);
    },
    []
  );

  const handleRouteClear = useCallback(() => {
    setRoutePolyline(null);
    setRouteLengthKm(0);
  }, []);

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedVehicles.length > 0 ||
    routePolyline !== null;

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Search nearby */}
      <SearchNearby
        onRouteFound={handleRouteFound}
        onRouteClear={handleRouteClear}
      />

      {/* Sticky filter bar */}
      <div className="sticky top-20 z-10 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 bg-card border-t-2 border-t-primary border-b-2 border-b-border py-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {/* Filter icon with accent dot */}
          <div className="relative mr-1">
            <Filter size={15} className="text-muted-foreground" />
            {hasActiveFilters && (
              <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-primary" />
            )}
          </div>

          <FilterDropdown
            label="Kategoria"
            items={categories}
            selectedIds={selectedCategories}
            onToggle={handleCategoryChange}
          />

          <FilterDropdown
            label="Typ pojazdu"
            items={vehicles}
            selectedIds={selectedVehicles}
            onToggle={handleVehicleChange}
          />

          <Button
            variant="outline"
            size="sm"
            onClick={handleSearch}
            className={cn(
              "text-sm",
              hasActiveFilters && "border-primary/50 text-primary"
            )}
          >
            Szukaj
          </Button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors ml-1"
            >
              <X size={12} />
              Wyczyść filtry
            </button>
          )}

          {/* Count */}
          <div className="ml-auto text-sm text-muted-foreground">
            <span className="font-semibold text-foreground tabular-nums">
              {filteredTransports.length}
            </span>{" "}
            {filteredTransports.length === 1
              ? "ogłoszenie"
              : filteredTransports.length > 1 && filteredTransports.length < 5
                ? "ogłoszenia"
                : "ogłoszeń"}
          </div>
        </div>

        {/* Active filter pills */}
        {(selectedCategories.length > 0 || selectedVehicles.length > 0) && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {selectedCategories.map((id) => {
              const cat = categories.find((c) => c.id === id);
              return cat ? (
                <button
                  key={id}
                  onClick={() => handleCategoryChange(id)}
                  className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/60 transition-colors"
                >
                  {cat.name}
                  <X size={10} />
                </button>
              ) : null;
            })}
            {selectedVehicles.map((id) => {
              const veh = vehicles.find((v) => v.id === id);
              return veh ? (
                <button
                  key={id}
                  onClick={() => handleVehicleChange(id)}
                  className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/60 transition-colors"
                >
                  {veh.name}
                  <X size={10} />
                </button>
              ) : null;
            })}
          </div>
        )}
      </div>

      {/* Results */}
      <div className="pt-6">
        {transports.length === 0 ? (
          <div className="flex items-start gap-6 py-16">
            <Lottie
              animationData={noOffers}
              className="w-36 flex-shrink-0"
              loop={true}
            />
            <div className="pt-4">
              <p className="text-lg font-medium text-foreground tracking-tight">
                Brak ogłoszeń
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Nie ma jeszcze żadnych ogłoszeń do wyświetlenia.
              </p>
            </div>
          </div>
        ) : filteredTransports.length === 0 ? (
          <div className="flex items-start gap-6 py-16">
            <Lottie
              animationData={noResults}
              className="w-36 flex-shrink-0"
              loop={true}
            />
            <div className="pt-4">
              <p className="text-lg font-medium text-foreground tracking-tight">
                Brak wyników
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Spróbuj zmienić filtry lub poszukaj innej trasy.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="mt-4"
              >
                Wyczyść filtry
              </Button>
            </div>
          </div>
        ) : (
          <TransportsMap transports={filteredTransports} />
        )}
      </div>
    </div>
  );
};

export default TransportsFilter;
