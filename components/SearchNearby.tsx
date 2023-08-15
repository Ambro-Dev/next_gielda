import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Button } from "./ui/button";
import TransportMapSelector from "./TransportMapSelector";
import { LatLng } from "use-places-autocomplete";

type Props = {};

const SearchNearby = (props: Props) => {
  const [from, setFrom] = useState<LatLng | null>(null);
  const [to, setTo] = useState<LatLng | null>(null);

  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 w-full gap-4 py-7 px-3">
      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex flex-row gap-4">
          <TransportMapSelector setPlace={setFrom} placeholder="Skąd" />
          <TransportMapSelector setPlace={setTo} placeholder="Dokąd" />
        </div>
      </div>

      <div className="flex justify-center flex-col items-center w-full gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="w-full hover:bg-neutral-800 bg-transparent border-2 hover:text-white border-neutral-800 text-black">
                Szukaj przy trasie
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>
                Wyszukaj ogłoszenia, których lokalizacje znajdują się w pobliżu
                Twojej trasy. Wyszukane zostaną wyniki w odległości ok. 10%
                długości Twojej trasy licząc w linii prostej, jednak nie bliżej
                niż 5km i nie dalej niż 50km od trasy.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default SearchNearby;
