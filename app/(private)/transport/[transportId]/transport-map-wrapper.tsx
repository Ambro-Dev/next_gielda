"use client";

import dynamic from "next/dynamic";

const TransportMap = dynamic(
  () => import("./transport-map"),
  { ssr: false, loading: () => (
    <div className="flex items-center justify-center h-full bg-muted/30 animate-pulse">
      <p className="text-muted-foreground">Ładowanie mapy...</p>
    </div>
  )}
);

type Props = {
  start: { lat: number; lng: number };
  finish: { lat: number; lng: number };
  encodedPolyline?: string;
  startAddress?: string;
  endAddress?: string;
  sendDate: Date;
  receiveDate: Date;
};

export default function TransportMapWrapper(props: Props) {
  return <TransportMap {...props} />;
}
