"use client";

import { VehicleVizualization } from "@/components/VehicleVisualization";
import React, { useEffect } from "react";

type Props = {};

const TrailersTypes = [
  {
    name: "Naczepa plandeka",
    size: [2.5, 2.7, 13.6],
  },
  {
    name: "Naczepa wywrotka",
    size: [2.5, 0.5, 13.6],
  },
  {
    name: "Naczepa custerna",
    size: [2.5, 1, 13.6],
  },
  {
    name: "Naczepa płaska",
    size: [2.5, 0.1, 13.6],
  },
];

const MediumTypes = [
  {
    name: "Dostawczy 12t - plandeka",
    size: [2.5, 2.7, 6.6],
  },
  {
    name: "Dostawczy 12t - wywrotka",
    size: [2.5, 0.5, 6.6],
  },
  {
    name: "Dostawczy 12t - custerna",
    size: [2.5, 1, 6.6],
  },
  {
    name: "Dostawczy 12t - płaska",
    size: [2.5, 0.1, 6.6],
  },
];

const SmallTypes = [
  {
    name: "Dostawczy 3.5t - plandeka",
    size: [2.1, 2.4, 3.5],
  },
  {
    name: "Dostawczy 3.5t - wywrotka",
    size: [2.1, 0.5, 3.5],
  },
  {
    name: "Dostawczy 3.5t - custerna",
    size: [2.1, 1, 3.5],
  },
  {
    name: "Dostawczy 3.5t - płaska",
    size: [2.1, 0.1, 3.5],
  },
  {
    name: "Dostawczy 3.5t - bus",
    size: [2.1, 1.8, 3.5],
  },
];

const CarTrailerTypes = [
  {
    name: "Przyczepa - plandeka",
    size: [1.8, 2, 2.8],
  },
  {
    name: "Przyczepa - wywrotka",
    size: [1.8, 0.5, 2.5],
  },
];

const Page = (props: Props) => {
  const [vehicleSize, setVehicleSize] = React.useState<
    [number, number, number]
  >([2, 1.7, 3]);

  return (
    <div className="w-full h-[600px] border-2 grid grid-cols-2 grid-rows-2">
      <div className="flex flex-col space-y-3">
        <label>
          <span>Szerokość</span>
          <input
            type="number"
            step={0.1}
            value={vehicleSize[0]}
            onChange={(e) =>
              setVehicleSize([
                Number(e.target.value),
                vehicleSize[1],
                vehicleSize[2],
              ])
            }
          />
        </label>
        <label>
          <span>Wysokość</span>
          <input
            type="number"
            step={0.1}
            value={vehicleSize[1]}
            onChange={(e) =>
              setVehicleSize([
                vehicleSize[0],
                Number(e.target.value),
                vehicleSize[2],
              ])
            }
          />
        </label>
        <label>
          <span>Długość</span>
          <input
            type="number"
            value={vehicleSize[2]}
            step={0.1}
            onChange={(e) =>
              setVehicleSize([
                vehicleSize[0],
                vehicleSize[1],
                Number(e.target.value),
              ])
            }
          />
        </label>
      </div>
      <div className="row-span-2">
        <VehicleVizualization
          className="rounded-xl"
          vehicleSize={vehicleSize}
        />
      </div>
    </div>
  );
};

export default Page;
