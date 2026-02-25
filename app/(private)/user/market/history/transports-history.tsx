"use client";

import { ExtendedTransport } from "../page";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Truck,
  Navigation,
  Clock,
} from "lucide-react";
import Image from "next/image";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const formatDate = (date: Date) => {
  const d = new Date(date);
  return d.toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getMapUrl = (transport: ExtendedTransport) => {
  const start = transport.directions?.start;
  const finish = transport.directions?.finish;
  if (!start || !finish || !MAPBOX_TOKEN) return null;
  const markers = `pin-s-a+FCAC0C(${start.lng},${start.lat}),pin-s-b+1A1A2E(${finish.lng},${finish.lat})`;
  const path = transport.polyline
    ? `,path-5+FCAC0C-0.9(${encodeURIComponent(transport.polyline)})`
    : "";
  return `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${markers}${path}/auto/400x200@2x?language=pl&access_token=${MAPBOX_TOKEN}`;
};

export function TransportsHistory({ data }: { data: ExtendedTransport[] }) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Truck className="w-10 h-10 text-gray-300 mb-3" />
        <p className="text-gray-500">Brak zakończonych zleceń</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.map((item) => {
        const mapUrl = getMapUrl(item);
        return (
          <div
            key={item.id}
            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition-all"
          >
            <div className="flex flex-col sm:flex-row">
              {/* Map thumbnail */}
              <div className="relative sm:w-44 sm:min-h-[7rem] h-32 sm:h-auto flex-shrink-0">
                {mapUrl ? (
                  <Image
                    src={mapUrl}
                    fill
                    className="object-cover"
                    alt="Mapa trasy"
                    sizes="(max-width: 640px) 100vw, 176px"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <Navigation className="w-8 h-8 text-gray-300" />
                  </div>
                )}
                {/* Status overlay */}
                <div className="absolute top-2 left-2">
                  {item.isAccepted ? (
                    <Badge className="bg-green-600 hover:bg-green-600 text-white text-xs shadow-sm">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Zaakceptowano
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-white/90 text-gray-600 text-xs shadow-sm backdrop-blur-sm">
                      <XCircle className="w-3 h-3 mr-1" />
                      Wygasło
                    </Badge>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 space-y-2">
                  {/* Route A → B */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <span className="text-[8px] font-bold text-white">A</span>
                      </div>
                      <span className="line-clamp-1">
                        {item.start_address || "—"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-4 h-4 rounded-full bg-navy flex items-center justify-center flex-shrink-0">
                        <span className="text-[8px] font-bold text-white">B</span>
                      </div>
                      <span className="line-clamp-1">
                        {item.end_address || "—"}
                      </span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge variant="secondary" className="text-xs font-normal">
                      {item.category.name}
                    </Badge>
                    <Badge variant="secondary" className="text-xs font-normal capitalize">
                      {item.vehicle.name}
                    </Badge>
                  </div>

                  {/* Metadata row */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {formatDate(item.sendDate)} — {formatDate(item.receiveDate)}
                      </span>
                    </div>
                    {item.distance?.text && (
                      <div className="flex items-center gap-1">
                        <Navigation className="w-3 h-3" />
                        <span>{item.distance.text}</span>
                      </div>
                    )}
                    {item.duration?.text && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{item.duration.text}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 sm:flex-shrink-0">
                  <Link href={`/transport/${item.id}`}>
                    <Button variant="outline" size="sm">
                      Szczegóły
                    </Button>
                  </Link>
                  {!item.isAccepted && (
                    <Link href={`/transport/${item.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edytuj i zlec ponownie
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
