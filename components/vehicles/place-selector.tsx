import React from "react";

import { ChevronsUpDown } from "lucide-react";
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

import NewPlaceSelector from "../NewPlaceSelector";

type Props = {
  setPlace: (place: {
    lat: number;
    lng: number;
    formatted_address: string;
  }) => void;
  placeholder?: string;
};

const PlaceSelector = ({ setPlace, placeholder }: Props) => {
  return (
    <NewPlaceSelector
      setPlace={setPlace}
      placeholder={placeholder}
    />
  );
};

export default PlaceSelector;
