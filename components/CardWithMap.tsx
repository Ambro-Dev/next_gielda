"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Truck, Navigation, Clock, MapPin } from "lucide-react";
import { Transport } from "@/app/(private)/transport/page";
import { MAPBOX_TOKEN } from "@/lib/map-config";
import { simplifyEncodedPolyline } from "@/lib/simplify-polyline";
import { Badge } from "@/components/ui/badge";

function extractCity(address?: string | null): string {
  if (!address) return "";
  const parts = address.split(",");
  if (parts.length >= 2) {
    const cityPart = parts[1].trim();
    const withoutPostal = cityPart.replace(/\d{2}-\d{3}\s*/, "").trim();
    return withoutPostal || cityPart;
  }
  return parts[0].trim();
}

function extractStreet(address?: string | null): string {
  if (!address) return "";
  const parts = address.split(",");
  if (parts.length >= 1) {
    return parts[0].trim();
  }
  return "";
}

const CardWithMap = ({ transport, priority }: { transport: Transport; priority?: boolean }) => {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const date = new Date(transport.sendDate);
  const formattedDate = date.toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const start = transport.directions?.start;
  const finish = transport.directions?.finish;

  // Urgency: expiring within 24h
  const hoursUntilExpiry = (new Date(transport.sendDate).getTime() - Date.now()) / (1000 * 60 * 60);
  const isUrgent = hoursUntilExpiry > 0 && hoursUntilExpiry <= 24;

  // New: created within 24h
  const hoursAgo = (Date.now() - new Date(transport.createdAt).getTime()) / (1000 * 60 * 60);
  const isNew = hoursAgo <= 24;

  const startCity = extractCity(transport.start_address);
  const startStreet = extractStreet(transport.start_address);
  const endCity = extractCity(transport.end_address);
  const endStreet = extractStreet(transport.end_address);

  const getMapboxStaticUrl = () => {
    if (transport.mapImage) return transport.mapImage;
    if (!start || !finish || !MAPBOX_TOKEN) return null;
    const markers = `pin-s-a+D4850C(${start.lng},${start.lat}),pin-s-b+1A1A2E(${finish.lng},${finish.lat})`;
    const base = `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/`;
    const suffix = `/auto/500x320@2x?padding=50&access_token=${MAPBOX_TOKEN}`;

    if (transport.polyline) {
      const simplified = simplifyEncodedPolyline(transport.polyline);
      const path = `,path-5+D4850C-0.9(${encodeURIComponent(simplified)})`;
      const fullUrl = `${base}${markers}${path}${suffix}`;
      if (fullUrl.length <= 8192) return fullUrl;
    }
    return `${base}${markers}${suffix}`;
  };

  const mapUrl = !imgError ? getMapboxStaticUrl() : null;

  return (
    <Link
      href={`/transport/${transport.id}`}
      className="block group active:scale-[0.98] transition-transform"
    >
      <div className="rounded-xl overflow-hidden border border-border/30 border-t-[2px] border-t-brand dark:border-t-primary/60 bg-card shadow-card ring-1 ring-transparent group-hover:ring-brand/20 group-hover:shadow-card-hover group-hover:-translate-y-1 transition-[transform,box-shadow,ring-color] duration-200">
          {/* Map */}
          <div className="relative h-44 overflow-hidden">
            {mapUrl ? (
              <>
                {/* Shimmer loading */}
                {!imgLoaded && (
                  <div className="absolute inset-0 bg-gradient-to-r from-muted via-muted/60 to-muted bg-[length:200%_100%] animate-shimmer z-[1]" />
                )}
                <Image
                  src={mapUrl}
                  fill
                  priority={priority}
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                  alt="Mapa trasy"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  onError={() => setImgError(true)}
                  onLoad={() => setImgLoaded(true)}
                />
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-muted via-muted to-primary/5 flex flex-col items-center justify-center gap-2">
                <MapPin className="w-8 h-8 text-muted-foreground/20" />
                <span className="text-xs text-muted-foreground/40">
                  Brak podglądu trasy
                </span>
              </div>
            )}
            {/* Inset shadow for recessed map feel */}
            <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-t-xl pointer-events-none z-[5]" />
            {/* Category chip + badges */}
            <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5">
              {isNew && (
                <Badge variant="brand" className="text-[10px] px-2 py-0.5">
                  Nowe
                </Badge>
              )}
              <span className="bg-white/85 backdrop-blur-md border border-white/30 shadow-sm px-2.5 py-1 rounded-md text-[11px] font-medium uppercase tracking-wider text-foreground dark:bg-slate-900/80 dark:border-slate-700/30">
                {transport.category.name}
              </span>
            </div>
            {/* Urgency dot */}
            {isUrgent && (
              <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
              </div>
            )}
            {/* Bottom fade */}
            {mapUrl && (
              <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-card/80 to-transparent" />
            )}
          </div>

          {/* Content */}
          <div className="p-4 pt-4 flex flex-col">
            {/* Route */}
            <div className="space-y-0">
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 mt-0.5 w-3.5 h-3.5 rounded-full border-2 border-brand bg-transparent flex items-center justify-center group-hover:ring-2 group-hover:ring-primary/20 transition-shadow duration-200">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand" />
                </div>
                <div className="min-w-0">
                  <span className="text-sm font-semibold text-foreground line-clamp-1">
                    {startCity || transport.start_address?.split(",")[0] || "\u2014"}
                  </span>
                  {startStreet && startCity && (
                    <span className="text-xs text-muted-foreground line-clamp-1">
                      {startStreet}
                    </span>
                  )}
                </div>
              </div>
              <div className="ml-[6px] w-px h-2 border-l border-dashed border-border" />
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 mt-0.5 w-3.5 h-3.5 rounded-full border-2 border-navy bg-transparent flex items-center justify-center group-hover:ring-2 group-hover:ring-navy/20 transition-shadow duration-200">
                  <div className="w-1.5 h-1.5 rounded-full bg-navy" />
                </div>
                <div className="min-w-0">
                  <span className="text-sm font-semibold text-foreground line-clamp-1">
                    {endCity || transport.end_address?.split(",")[0] || "\u2014"}
                  </span>
                  {endStreet && endCity && (
                    <span className="text-xs text-muted-foreground line-clamp-1">
                      {endStreet}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span className="tabular-nums font-semibold text-foreground">{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Truck className="w-3 h-3" />
                  <span className="capitalize">{transport.vehicle.name}</span>
                </div>
                {transport.distance?.text && (
                  <>
                    <span className="w-0.5 h-0.5 rounded-full bg-muted-foreground/40" />
                    <div className="flex items-center gap-1">
                      <Navigation className="w-3 h-3" />
                      <span className="tabular-nums">{transport.distance.text}</span>
                    </div>
                  </>
                )}
                {transport.duration?.text && (
                  <>
                    <span className="w-0.5 h-0.5 rounded-full bg-muted-foreground/40" />
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span className="tabular-nums">{transport.duration.text}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="flex justify-end mt-3 pt-3 border-t border-border/50">
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-200 flex items-center gap-1">
                Zobacz szczegóły
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-300 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]" />
              </span>
            </div>
          </div>
        </div>
    </Link>
  );
};

export default CardWithMap;
