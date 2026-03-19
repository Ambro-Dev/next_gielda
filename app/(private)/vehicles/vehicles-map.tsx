"use client";

import React from "react";
import ReactMap, { Marker } from "react-map-gl/mapbox";
import { MAPBOX_TOKEN, MAP_STYLE, applyPremiumEffects } from "@/lib/map-config";
import { VehicleMarker } from "@/components/map/PremiumMarker";

const centerOfPoland = { lng: 19.480556, lat: 52.069167 };

interface DataTableProps<TData> {
  data: TData[];
}

function TransportMap<TData>({ data }: DataTableProps<TData>) {
  return (
    <ReactMap
      mapboxAccessToken={MAPBOX_TOKEN}
      initialViewState={{
        longitude: centerOfPoland.lng,
        latitude: centerOfPoland.lat,
        zoom: 5,
        pitch: 20,
      }}
      style={{ width: "100%", height: "100%", minHeight: "300px", borderRadius: "0.75rem" }}
      mapStyle={MAP_STYLE}
      onLoad={(e) => {
        const map = e.target;
        applyPremiumEffects(map, {
          terrain: true,
          buildings: false,
          fog: true,
          sky: false,
        });
      }}
    >
      {data.map((item: any) => (
        item.place_lat && item.place_lng ? (
          <Marker
            key={item.id}
            longitude={item.place_lng}
            latitude={item.place_lat}
            anchor="bottom"
          >
            <VehicleMarker />
          </Marker>
        ) : null
      ))}
    </ReactMap>
  );
}

export default TransportMap;
