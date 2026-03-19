"use client";

import React from "react";
import ReactMap, { Marker } from "react-map-gl/mapbox";
import { LatLng } from "@prisma/client";
import { MAPBOX_TOKEN, MAP_STYLE, applyPremiumEffects } from "@/lib/map-config";
import { VehicleMarker } from "@/components/map/PremiumMarker";

interface Props {
  point: LatLng;
}

function VehicleMap({ point }: Props) {
  return (
    <ReactMap
      mapboxAccessToken={MAPBOX_TOKEN}
      initialViewState={{
        longitude: point.lng,
        latitude: point.lat,
        zoom: 10,
        pitch: 30,
      }}
      style={{ width: "100%", height: "100%", minHeight: "300px", borderRadius: "0.75rem" }}
      mapStyle={MAP_STYLE}
      onLoad={(e) => {
        const map = e.target;
        applyPremiumEffects(map, {
          terrain: true,
          buildings: true,
          fog: true,
          sky: false,
        });
      }}
    >
      <Marker longitude={point.lng} latitude={point.lat} anchor="bottom">
        <VehicleMarker />
      </Marker>
    </ReactMap>
  );
}

export default VehicleMap;
