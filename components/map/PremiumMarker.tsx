import React from "react";
import { Truck } from "lucide-react";

export const RouteMarker = ({ type }: { type: "start" | "end" }) => {
  const isStart = type === "start";
  const borderColor = isStart ? "border-[hsl(39,85%,50%)]" : "border-[hsl(225,30%,14%)]";
  const pulseColor = isStart ? "bg-[hsl(39,85%,50%)]" : "bg-[hsl(225,30%,14%)]";
  const label = isStart ? "A" : "B";

  return (
    <div className="relative flex flex-col items-center">
      {/* Pulse ring */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full ${pulseColor} animate-marker-pulse`}
      />
      {/* Main marker body */}
      <div
        className={`relative w-9 h-9 rounded-full bg-white shadow-lg ${borderColor} border-[3px] flex items-center justify-center`}
      >
        <span className="text-xs font-bold text-foreground">{label}</span>
      </div>
      {/* Drop indicator */}
      <div className="w-2 h-2 bg-white rotate-45 -mt-1.5 shadow-sm" />
    </div>
  );
};

export const VehicleMarker = () => {
  return (
    <div className="relative flex flex-col items-center">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[hsl(39,85%,50%)] animate-marker-pulse" />
      <div className="relative w-10 h-10 rounded-full bg-white shadow-lg border-[3px] border-[hsl(39,85%,50%)] flex items-center justify-center">
        <Truck className="w-4 h-4 text-foreground" />
      </div>
      <div className="w-2 h-2 bg-white rotate-45 -mt-1.5 shadow-sm" />
    </div>
  );
};
