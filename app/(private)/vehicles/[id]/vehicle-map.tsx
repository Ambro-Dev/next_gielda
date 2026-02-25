"use client";

import React from "react";
import ReactMap, { Marker } from "react-map-gl/mapbox";
import { LatLng } from "@prisma/client";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

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
      }}
      style={{ width: "100%", height: "100%", minHeight: "300px", borderRadius: "0.5rem" }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      onLoad={(e) => e.target.setLanguage("pl")}
    >
      <Marker longitude={point.lng} latitude={point.lat} anchor="bottom">
        <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full border-2 border-white shadow-lg">
          <div className="w-3 h-3 bg-white rounded-full" />
        </div>
      </Marker>
    </ReactMap>
  );
}

export default VehicleMap;
