"use client";

import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Button } from "./ui/button";
import TransportMapSelector from "./TransportMapSelector";
import { Loader2, Navigation, X } from "lucide-react";
// @ts-expect-error - no type declarations for @mapbox/polyline
import * as polyline from "@mapbox/polyline";
import { Badge } from "./ui/badge";
import { calculateSearchRadius } from "@/lib/geo-utils";

type LatLng = { lat: number; lng: number };

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

type Props = {
  onRouteFound: (
    polylinePoints: [number, number][],
    routeLengthKm: number
  ) => void;
  onRouteClear: () => void;
};

const SearchNearby = ({ onRouteFound, onRouteClear }: Props) => {
  const [from, setFrom] = useState<LatLng | null>(null);
  const [to, setTo] = useState<LatLng | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeRoute, setActiveRoute] = useState<{
    radiusKm: number;
  } | null>(null);

  const handleSearch = async () => {
    if (!from || !to || !MAPBOX_TOKEN) return;

    setLoading(true);
    try {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${from.lng},${from.lat};${to.lng},${to.lat}?geometries=polyline&access_token=${MAPBOX_TOKEN}`;
      const res = await fetch(url);
      const data = await res.json();

      if (!data.routes || data.routes.length === 0) return;

      const route = data.routes[0];
      const decoded = polyline.decode(route.geometry) as [number, number][];
      const routeLengthKm = route.distance / 1000;
      const radiusKm = calculateSearchRadius(routeLengthKm);

      setActiveRoute({ radiusKm });
      onRouteFound(decoded, routeLengthKm);
    } catch (error) {
      console.error("Błąd pobierania trasy:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFrom(null);
    setTo(null);
    setActiveRoute(null);
    onRouteClear();
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row w-full gap-3 py-4">
        <div className="flex flex-1 flex-col sm:flex-row gap-3">
          <TransportMapSelector
            setPlace={(place) => setFrom(place)}
            placeholder="Skąd"
          />
          <TransportMapSelector
            setPlace={(place) => setTo(place)}
            placeholder="Dokąd"
          />
        </div>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={handleSearch}
                  disabled={!from || !to || loading}
                  className="sm:w-auto w-full gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Navigation className="w-4 h-4" />
                  )}
                  Szukaj przy trasie
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>
                  Wyszukaj ogłoszenia, których lokalizacje znajdują się w pobliżu
                  Twojej trasy. Wyszukane zostaną wyniki w odległości ok. 10%
                  długości Twojej trasy, jednak nie bliżej niż 5km i nie dalej
                  niż 50km od trasy.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {activeRoute && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="text-gray-500"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
      {activeRoute && (
        <Badge variant="secondary" className="text-xs font-normal gap-1.5">
          <Navigation className="w-3 h-3" />
          Szukanie w promieniu {Math.round(activeRoute.radiusKm)} km od trasy
        </Badge>
      )}
    </div>
  );
};

export default SearchNearby;
