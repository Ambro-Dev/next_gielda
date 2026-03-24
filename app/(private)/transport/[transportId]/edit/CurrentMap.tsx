"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Transport } from "../page";
import EditMap from "./EditMap";

const CurrentTransportMap = ({ transport }: { transport: Transport }) => {
  return (
    <div className="grid md:grid-cols-2 grid-cols-1 w-full gap-6">
      <div className="flex flex-col justify-center space-y-3">
        {/* Start address */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-brand" />
            <Label className="text-sm font-medium text-muted-foreground">
              Miejsce wysyłki
            </Label>
          </div>
          <Input
            type="text"
            value={transport.start_address || ""}
            readOnly
            className="bg-muted/50 border-brand/10 w-full"
          />
        </div>

        {/* Dashed connector */}
        <div className="flex items-center justify-center">
          <div className="w-px h-4 border-l border-dashed border-border" />
        </div>

        {/* End address */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-navy" />
            <Label className="text-sm font-medium text-muted-foreground">
              Miejsce odbioru
            </Label>
          </div>
          <Input
            type="text"
            value={transport.end_address || ""}
            readOnly
            className="bg-muted/50 border-navy/10 w-full"
          />
        </div>
      </div>

      <div className="rounded-lg overflow-hidden shadow-card">
        <EditMap transport={transport} className="h-[300px] w-full" />
      </div>
    </div>
  );
};

export default CurrentTransportMap;
