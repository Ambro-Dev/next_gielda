"use client";

import React from "react";
import { ExtendedTransport } from "@/app/(private)/user/market/page";
import { ArrowRight } from "lucide-react";

const Directions = ({ transport }: { transport: ExtendedTransport }) => {
  const startAddress = (transport as any).start_address || "";
  const endAddress = (transport as any).end_address || "";

  if (!startAddress && !endAddress) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <div className="flex items-center gap-1.5">
        <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
          <span className="text-[8px] font-bold text-white">A</span>
        </div>
        <span className="font-medium">{startAddress}</span>
      </div>
      <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
      <div className="flex items-center gap-1.5">
        <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
          <span className="text-[8px] font-bold text-white">B</span>
        </div>
        <span className="font-medium">{endAddress}</span>
      </div>
    </div>
  );
};

export default Directions;
