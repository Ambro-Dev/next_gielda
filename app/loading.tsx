import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import React from "react";

export default function Loading() {
  return (
    <div className="flex w-full h-full lg:p-10 p-5 justify-center items-center backdrop-blur-md flex-col">
      <Loader2 className="animate-spin h-24 w-24 opacity-40" />
      <Label className="text-2xl ml-5 opacity-40">Ładowanie...</Label>
    </div>
  );
}
