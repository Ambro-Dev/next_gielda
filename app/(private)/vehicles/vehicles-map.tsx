"use client";

import React from "react";
import ReactMap, { Marker } from "react-map-gl/mapbox";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

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
      }}
      style={{ width: "100%", height: "100%", minHeight: "300px", borderRadius: "0.5rem" }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      onLoad={(e) => e.target.setLanguage("pl")}
    >
      {data.map((item: any) => (
        item.place_lat && item.place_lng ? (
          <Marker
            key={item.id}
            longitude={item.place_lng}
            latitude={item.place_lat}
            anchor="bottom"
          >
            <div className="w-5 h-5 bg-blue-600 rounded-full border-2 border-white shadow-md" />
          </Marker>
        ) : null
      ))}
    </ReactMap>
  );
}

export default TransportMap;
