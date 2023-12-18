"use client";

import React, { useEffect } from "react";

import {
  LargeBoxy,
  LargeFlat,
  LargeLow,
  LargeTanker,
} from "@/components/models/large-truck";
import {
  MediumBoxy,
  MediumLow,
  MediumTanker,
  MediumFlat,
} from "@/components/models/medium-truck";
import {
  SmallBoxy,
  SmallFlat,
  SmallLow,
  SmallTanker,
} from "@/components/models/small-truck";
import Bus from "@/components/models/bus";
import { CarTrailerBox, CarTrailerLow } from "@/components/models/car-trailer";
import TypeSelector from "@/components/vehicles/type-selector";
import { VehicleVizualization } from "@/components/VehicleVisualization";

type Props = {};

const TrailersTypes = [
  {
    id: "large-box",
    name: "Naczepa plandeka",
    size: [2.5, 2.7, 13.6],
    model: LargeBoxy,
    icon: "/vehicles/large-box.svg",
  },
  {
    id: "large-low",
    name: "Naczepa burtowa",
    size: [2.5, 0.5, 13.6],
    model: LargeLow,
    icon: "/vehicles/large-low.svg",
  },
  {
    id: "large-tanker",
    name: "Naczepa cysterna",
    size: [13.6, 1, 2.5],
    model: LargeTanker,
    icon: "/vehicles/large-tanker.svg",
  },
  {
    id: "large-flat",
    name: "Naczepa płaska",
    size: [2.5, 0.1, 13.6],
    model: LargeFlat,
    icon: "/vehicles/large-flat.svg",
  },
];

const MediumTypes = [
  {
    id: "medium-box",
    name: "Dostawczy od 12t - plandeka",
    size: [2.5, 2.7, 6.6],
    model: MediumBoxy,
    icon: "/vehicles/medium-box.svg",
  },
  {
    id: "medium-low",
    name: "Dostawczy od 12t - burtowa",
    size: [2.5, 0.5, 6.6],
    model: MediumLow,
    icon: "/vehicles/medium-low.svg",
  },
  {
    id: "medium-tanker",
    name: "Dostawczy od 12t - cysterna",
    size: [2.5, 1, 6.6],
    model: MediumTanker,
    icon: "/vehicles/medium-tanker.svg",
  },
  {
    id: "medium-flat",
    name: "Dostawczy od 12t - płaska",
    size: [2.5, 0.1, 6.6],
    model: MediumFlat,
    icon: "/vehicles/medium-flat.svg",
  },
];

const SmallTypes = [
  {
    id: "small-box",
    name: "Dostawczy do 12t - plandeka",
    size: [2.1, 2.4, 3.5],
    model: SmallBoxy,
    icon: "/vehicles/small-box.svg",
  },
  {
    id: "small-low",
    name: "Dostawczy do 12t - burtowa",
    size: [2.1, 0.5, 3.5],
    model: SmallLow,
    icon: "/vehicles/small-low.svg",
  },
  {
    id: "small-flat",
    name: "Dostawczy do 12t - płaska",
    size: [2.1, 0.1, 3.5],
    model: SmallFlat,
    icon: "/vehicles/small-flat.svg",
  },
];

const BusTypes = [
  {
    id: "bus",
    name: "Dostawczy do 3.5t - bus",
    size: [2.1, 1.8, 3.5],
    model: Bus,
    icon: "/vehicles/bus.svg",
  },
];

const CarTrailerTypes = [
  {
    id: "car-trailer-box",
    name: "Przyczepka samochodowa - plandeka",
    size: [1.8, 2, 2.8],
    model: CarTrailerBox,
    icon: "/vehicles/car-trailer-box.svg",
  },
  {
    id: "car-trailer-low",
    name: "Przyczepka samochodowa - burtowa",
    size: [1.8, 0.5, 2.5],
    model: CarTrailerLow,
    icon: "/vehicles/car-trailer-low.svg",
  },
];

const Vehicles = {
  trailers: TrailersTypes,
  medium: MediumTypes,
  small: SmallTypes,
  bus: BusTypes,
  carTrailer: CarTrailerTypes,
};

export type Vehicle = typeof Vehicles;

const Page = (props: Props) => {
  const [selectedVehicle, setSelectedVehicle] = React.useState<
    | {
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
      }
    | null
    | undefined
  >(null);

  return (
    <div className="w-full h-[600px] border-2 grid grid-cols-2 grid-rows-2">
      <div className="p-5">
        <TypeSelector
          vehicles={Vehicles}
          setSelectedVehicle={setSelectedVehicle}
        />
      </div>
      <div className="py-16 px-5 row-span-2">
        {selectedVehicle && (
          <VehicleVizualization
            vehicleSize={selectedVehicle?.size as [number, number, number]}
            VehicleModel={
              selectedVehicle?.model as ({
                args,
                ...props
              }: {
                args: [number, number, number];
              }) => React.JSX.Element
            }
          />
        )}
      </div>
    </div>
  );
};

export default Page;
