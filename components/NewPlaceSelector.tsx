"use client";

import React, { useState, useCallback } from "react";
import { ChevronsUpDown, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  setPlace: (place: {
    lat: number;
    lng: number;
    formatted_address: string;
  }) => void;
  placeholder?: string;
};

interface MapboxFeature {
  id: string;
  place_name: string;
  center: [number, number]; // [lng, lat]
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const EUROPEAN_COUNTRIES =
  "pl,de,fr,it,es,nl,be,at,ch,cz,sk,hu,si,hr,ba,rs,me,mk,al,bg,ro,md,ua,by,lt,lv,ee,fi,se,no,dk,is,ie,gb,pt,ad,mc,sm,mt,cy,gr,tr,lu";

const NewPlaceSelector = ({ setPlace, placeholder }: Props) => {
  const [open, setOpen] = useState(false);
  const [currentValue, setCurrentValue] = useState("");
  const [suggestions, setSuggestions] = useState<MapboxFeature[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = useCallback(async (value: string) => {
    if (!value.trim() || value.length < 2) {
      setSuggestions([]);
      return;
    }
    setIsLoading(true);
    try {
      const query = encodeURIComponent(value);
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${MAPBOX_TOKEN}&country=${EUROPEAN_COUNTRIES}&language=pl&limit=5&types=address,place,locality,neighborhood,region`;
      const res = await fetch(url);
      const data = await res.json();
      setSuggestions(data.features || []);
    } catch (error) {
      console.error("Geocoding error:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSelect = (feature: MapboxFeature) => {
    setCurrentValue(feature.place_name);
    setOpen(false);
    setSuggestions([]);
    const [lng, lat] = feature.center;
    setPlace({ lat, lng, formatted_address: feature.place_name });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <div className="flex items-center gap-2 truncate min-w-0">
            <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="truncate text-sm">
              {currentValue || placeholder || "Szukaj miejsca..."}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput
            placeholder="Wpisz adres, miasto..."
            onValueChange={handleInputChange}
          />
          <CommandList>
            <CommandEmpty>
              {isLoading ? "Wyszukiwanie..." : "Nie znaleziono miejsca."}
            </CommandEmpty>
            <CommandGroup>
              {suggestions.map((feature) => (
                <CommandItem
                  key={feature.id}
                  value={feature.place_name}
                  onSelect={() => handleSelect(feature)}
                  className="flex items-start gap-2 py-2"
                >
                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                  <span className="text-sm leading-tight">{feature.place_name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default NewPlaceSelector;
