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
  }, [selectedVehicles]);

  useEffect(() => {
    if (selectedCategories.length === 0) {
      setSearchString(`${searchString.replace("category", "")}`);
    }
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

      {/* Horizontal filter bar */}
      <div className="flex flex-wrap items-center gap-2 py-4 border-b border-gray-100">
        <Filter size={16} className="text-muted-foreground" />

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

        <Button variant="brand" size="sm" onClick={handleSearch}>
          Szukaj
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-gray-500 gap-1"
          >
            <X size={14} />
            Wyczyść filtry
          </Button>
        )}

        <span className="ml-auto text-sm text-muted-foreground">
          {filteredTransports.length}{" "}
          {filteredTransports.length === 1 ? "ogłoszenie" : "ogłoszeń"}
        </span>
      </div>

      {/* Results */}
      <div className="pt-6">
        {transports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Lottie
              animationData={noOffers}
              className="w-48"
              loop={true}
            />
            <p className="mt-4 text-muted-foreground">
              Brak ogłoszeń do wyświetlenia
            </p>
          </div>
        ) : filteredTransports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Lottie
              animationData={noResults}
              className="w-48"
              loop={true}
            />
            <p className="mt-4 text-muted-foreground">
              Brak ogłoszeń dla wybranych filtrów
            </p>
          </div>
        ) : (
          <TransportsMap transports={filteredTransports} />
        )}
      </div>
    </div>
  );
};

export default TransportsFilter;
