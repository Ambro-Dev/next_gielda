import React from "react";

import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import NewPlaceSelector from "./NewPlaceSelector";

type Props = {
  setPlace: (position: google.maps.LatLngLiteral) => void;
  placeholder?: string;
};

const TransportMapSelector = ({ setPlace, placeholder }: Props) => {
  const handlePlaceSelect = (place: {
    lat: number;
    lng: number;
    formatted_address: string;
  }) => {
    setPlace({ lat: place.lat, lng: place.lng });
  };

  return (
    <NewPlaceSelector
      setPlace={handlePlaceSelect}
      placeholder={placeholder}
    />
  );
};

export default TransportMapSelector;
