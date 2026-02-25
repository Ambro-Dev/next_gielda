"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import React from "react";
import Image from "next/image";
import { Truck, Calendar, Navigation, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Transport } from "@/app/(private)/transport/page";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const CardWithMap = ({ transport }: { transport: Transport }) => {
  const date = new Date(transport.sendDate);
  const formatedDate = date.toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const start = transport.directions?.start;
  const finish = transport.directions?.finish;

  const getMapboxStaticUrl = () => {
    if (!start || !finish || !MAPBOX_TOKEN) return null;
    const markers = `pin-s-a+FCAC0C(${start.lng},${start.lat}),pin-s-b+1A1A2E(${finish.lng},${finish.lat})`;
    const path = transport.polyline
      ? `,path-5+FCAC0C-0.9(${encodeURIComponent(transport.polyline)})`
      : "";
    return `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${markers}${path}/auto/500x350@2x?language=pl&access_token=${MAPBOX_TOKEN}`;
  };

  const mapUrl = getMapboxStaticUrl();

  return (
    <Link href={`/transport/${transport.id}`} className="block group">
      <Card className="flex flex-col overflow-hidden border border-border shadow-card transition-all duration-200 group-hover:shadow-card-hover group-hover:-translate-y-0.5">
        {/* Map Image */}
        <CardHeader className="p-0 h-48 relative overflow-hidden">
          {mapUrl ? (
            <Image
              src={mapUrl}
              fill
              className="object-cover"
              alt="Mapa trasy"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <Navigation className="w-10 h-10 text-muted-foreground/30" />
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge
              variant="secondary"
              className="bg-white/90 text-foreground shadow-sm backdrop-blur-sm text-xs font-medium"
            >
              {transport.category.name}
            </Badge>
          </div>
        </CardHeader>

        {/* Content */}
        <CardContent className="p-4 flex-grow space-y-3">
          {/* Route */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                <span className="text-[8px] font-bold text-white">A</span>
              </div>
              <span className="text-sm text-foreground line-clamp-1">
                {transport.start_address || "—"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0 w-4 h-4 rounded-full bg-navy flex items-center justify-center">
                <span className="text-[8px] font-bold text-white">B</span>
              </div>
              <span className="text-sm text-foreground line-clamp-1">
                {transport.end_address || "—"}
              </span>
            </div>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatedDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5" />
              <span className="capitalize">{transport.vehicle.name}</span>
            </div>
            {transport.distance?.text && (
              <div className="flex items-center gap-1">
                <Navigation className="w-3.5 h-3.5" />
                <span>{transport.distance.text}</span>
              </div>
            )}
            {transport.duration?.text && (
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{transport.duration.text}</span>
              </div>
            )}
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="px-4 pb-4 pt-0">
          <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1">
            Zobacz szczegóły
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default CardWithMap;
