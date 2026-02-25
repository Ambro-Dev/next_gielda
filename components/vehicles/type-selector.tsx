"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Vehicle } from "@/lib/types/vehicles";
import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type Props = {
  vehicles: Vehicle;
  selectedVehicleId?: string;
  setSelectedVehicle: React.Dispatch<
    React.SetStateAction<{
      id: string;
      name: string;
      size: number[];
      model: ({
        args,
        ...props
      }: {
        args: [number, number, number];
      }) => React.JSX.Element;
      icon: string;
    }>
  >;
};

const TypeSelector = ({
  vehicles,
  selectedVehicleId,
  setSelectedVehicle,
}: Props) => {
  const [openCategory, setOpenCategory] = useState<string | null>("Naczepy");

  const categoryList = [
    {
      name: "Naczepy",
      vehicles: vehicles.trailers,
    },
    {
      name: "Samochody ciężarowe",
      vehicles: vehicles.medium,
    },
    {
      name: "Samochody dostawcze",
      vehicles: vehicles.small,
    },
    {
      name: "Dostawczy - bus",
      vehicles: vehicles.bus,
    },
    {
      name: "Przyczepki samochodowe",
      vehicles: vehicles.carTrailer,
    },
  ];

  const handleSelect = (vehicle: any) => {
    setSelectedVehicle(vehicle);
  };

  return (
    <div className="w-full space-y-2">
      {categoryList.map((category) => (
        <Collapsible
          key={category.name}
          open={openCategory === category.name}
          onOpenChange={(isOpen) =>
            setOpenCategory(isOpen ? category.name : null)
          }
          className="border rounded-lg bg-card overflow-hidden"
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 font-medium hover:bg-muted/50 transition-colors">
            <span>{category.name}</span>
            <ChevronDown
              className={cn(
                "h-5 w-5 text-muted-foreground transition-transform duration-200",
                openCategory === category.name ? "rotate-180" : "",
              )}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4 pt-0 border-t bg-muted/10">
            <div className="grid grid-cols-2 gap-3 mt-4">
              {category.vehicles.map((vehicle) => {
                const isSelected = selectedVehicleId === vehicle.id;
                return (
                  <div
                    key={vehicle.id}
                    onClick={() => handleSelect(vehicle)}
                    className={cn(
                      "relative flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-all hover:border-primary/50 hover:bg-primary/5",
                      isSelected
                        ? "border-primary bg-primary/10 ring-1 ring-primary"
                        : "bg-background",
                    )}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                    <div className="h-20 w-full relative mb-2 flex items-center justify-center">
                      <Image
                        src={vehicle.icon}
                        alt={vehicle.name}
                        width={120}
                        height={80}
                        className="object-contain max-h-full drop-shadow-sm"
                      />
                    </div>
                    <span className="text-xs font-medium text-center line-clamp-2 h-8 flex items-center">
                      {vehicle.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
};

export default TypeSelector;
