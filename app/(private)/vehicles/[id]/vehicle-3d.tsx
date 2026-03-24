"use client";

import dynamic from "next/dynamic";

const VehicleVizualization = dynamic(
  () => import("@/components/VehicleVisualization").then(mod => ({ default: mod.VehicleVizualization })),
  { ssr: false, loading: () => (
    <div className="flex items-center justify-center h-full text-muted-foreground animate-pulse">
      <p className="text-lg font-medium">Ładowanie podglądu 3D...</p>
    </div>
  )}
);

type Props = {
  vehicleType: string;
  vehicleSize: [number, number, number];
};

export default function Vehicle3D({ vehicleType, vehicleSize }: Props) {
  return <VehicleVizualization vehicleType={vehicleType} vehicleSize={vehicleSize} />;
}
