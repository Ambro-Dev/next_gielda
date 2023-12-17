"use client";

import { VehicleVizualization } from "@/components/VehicleVisualization";
import React, { useEffect } from "react";

type Props = {};

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
