"use client";
import React from "react";
import { ArrowDown } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Transport } from "../page";
import EditMap from "./EditMap";

const CurrentTransportMap = ({ transport }: { transport: Transport }) => {
  return (
    <>
      <div className="grid md:grid-cols-2 grid-cols-1 w-full gap-8">
        <div className="grid pt-6 items-start w-full space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Miejsce wysyłki</Label>
            <Input
              type="text"
              value={transport.start_address || ""}
              readOnly
              className="bg-gray-100 w-full"
            />
          </div>
          <div className="flex items-center justify-center my-auto">
            <ArrowDown />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold">Miejsce odbioru</Label>
            <Input
              type="text"
              value={transport.end_address || ""}
              readOnly
              className="bg-gray-100"
            />
          </div>
        </div>
        <div className="grid w-full">
          <EditMap transport={transport} className="h-[300px] w-full" />
        </div>
      </div>
    </>
  );
};

export default CurrentTransportMap;
