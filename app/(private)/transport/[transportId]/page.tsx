import React from "react";
import TransportMap from "./transport-map";
import TransportDetails from "./transport-details";
import TransportActions from "./transport-actions";
import TransportOffers from "./contact-card";
import { axiosInstance } from "@/lib/axios";
import GoBack from "@/components/ui/go-back";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { GetExpireTimeLeft } from "@/app/lib/getExpireTimeLeft";
import { ObjectsTable } from "@/components/ObjectsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Navigation, Clock } from "lucide-react";

type PageParams = {
  params: Promise<{
    transportId: string;
  }>;
};

export type Transport = {
  id: string;
  category: { id: string; name: string };
  creator: { id: string; username: string };
  createdAt: Date;
  isAccepted: boolean;
  vehicle: { id: string; name: string };
  description: string;
  isAvailable: boolean;
  directions: {
    start: { lat: number; lng: number };
    finish: { lat: number; lng: number };
  };
  objects: [
    {
      id: string;
      name: string;
      amount: number;
      description: string;
      height: number;
      width: number;
      length: number;
      weight: number;
    }
  ];
  sendTime: string;
  receiveTime: string;
  sendDate: Date;
  receiveDate: Date;
  start_address?: string;
  end_address?: string;
  distance?: { text: string; value: number };
  duration?: { text: string; value: number };
  polyline?: string;
};

const getTransport = async (transportId: string): Promise<Transport> => {
  try {
    const response = await axiosInstance.get(
      `/api/transports/transport?transportId=${transportId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    notFound();
  }
};

function StatusBadge({ transport }: { transport: Transport }) {
  if (transport.isAccepted) {
    return <Badge variant="success">Zaakceptowano</Badge>;
  }
  const { daysLeft, hoursLeft } = GetExpireTimeLeft(transport.sendDate);
  if (hoursLeft > 0 && transport.isAvailable) {
    return (
      <Badge variant="destructive">
        {daysLeft > 0 ? `${daysLeft} dni` : `${hoursLeft} godz.`}
      </Badge>
    );
  }
  return <Badge variant="destructive">Wygaslo</Badge>;
}

function extractCity(address?: string): string {
  if (!address) return "";
  // Try to extract city name from address like "Finska, 15-611 Bialystok, woj..."
  const parts = address.split(",");
  if (parts.length >= 2) {
    // Second part often contains postal code + city
    const cityPart = parts[1].trim();
    // Remove postal code if present
    const withoutPostal = cityPart.replace(/\d{2}-\d{3}\s*/, "").trim();
    return withoutPostal || cityPart;
  }
  return parts[0].trim();
}

const TransportInfo = async ({ params: paramsPromise }: PageParams) => {
  const params = await paramsPromise;
  const transport: Transport = await getTransport(params.transportId);

  const startCity = extractCity(transport.start_address);
  const endCity = extractCity(transport.end_address);

  return (
    <div className="relative flex w-full flex-col gap-10 lg:gap-12 py-6">
      {/* Map with overlays */}
      <div className="relative rounded-xl sm:rounded-2xl overflow-hidden h-[45vh] lg:h-[55vh] min-h-[350px] max-h-[650px] -mx-4 sm:-mx-6 lg:mx-0 ring-1 ring-inset ring-black/5 animate-fade-in">
        <TransportMap
          start={transport.directions.start}
          finish={transport.directions.finish}
          encodedPolyline={transport.polyline}
          startAddress={transport.start_address}
          endAddress={transport.end_address}
          sendDate={transport.sendDate}
          receiveDate={transport.receiveDate}
        />

        {/* GoBack */}
        <GoBack className="absolute top-3 left-3 z-20 bg-white/90 backdrop-blur-sm shadow-sm border border-gray-200" />

        {/* Badges on map */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
          <Badge variant="dark">{transport.category.name}</Badge>
          <StatusBadge transport={transport} />
        </div>

        {/* Bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />

        {/* Route summary bar — double-bezel */}
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <div className="p-1 bg-white/50 dark:bg-black/30 backdrop-blur-xl rounded-2xl shadow-card-lg animate-slide-up">
            <div className="bg-white/95 dark:bg-card/95 rounded-xl px-5 py-3.5 flex items-center justify-between gap-3">
              {/* Start */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-3.5 h-3.5 rounded-full bg-brand flex-shrink-0 ring-2 ring-brand/20" />
                <span className="text-base font-bold truncate">
                  {startCity || "Start"}
                </span>
              </div>
              {/* Connector */}
              <div className="flex-1 flex items-center gap-2 px-1 sm:px-3">
                <div className="flex-1 border-t-2 border-dashed border-brand/30" />
                <Truck className="w-5 h-5 text-brand flex-shrink-0" />
                <div className="flex-1 border-t-2 border-dashed border-brand/30" />
              </div>
              {/* End */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-3.5 h-3.5 rounded-full bg-navy flex-shrink-0 ring-2 ring-navy/20" />
                <span className="text-base font-bold truncate">
                  {endCity || "Cel"}
                </span>
              </div>
              {/* Stats */}
              {(transport.distance?.text || transport.duration?.text) && (
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-4 pl-3 sm:pl-4 border-l border-border">
                  {transport.distance?.text && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Navigation className="w-3.5 h-3.5" />
                      <span className="font-medium" style={{ fontVariantNumeric: "tabular-nums" }}>
                        {transport.distance.text}
                      </span>
                    </div>
                  )}
                  {transport.duration?.text && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="font-medium" style={{ fontVariantNumeric: "tabular-nums" }}>
                        {transport.duration.text}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent -mt-4" />

      {/* Two-column content */}
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Main content */}
        <div className="lg:col-span-7 space-y-10">
          <TransportDetails transport={transport} />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28 space-y-5">
            {/* Actions card - mobile: shown inline above on mobile via order */}
            <TransportActions transport={transport} />

            {/* Objects */}
            <Card className="animate-fade-in animate-stagger-3">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Przedmioty</CardTitle>
              </CardHeader>
              <CardContent>
                <ObjectsTable data={transport.objects} edit={false} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Offers - full width */}
      <TransportOffers transport={transport} />
    </div>
  );
};

export default TransportInfo;
