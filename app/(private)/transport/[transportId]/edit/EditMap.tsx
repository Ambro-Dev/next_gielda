"use client";

import React, { useState, useEffect } from "react";
import ReactMap, { Layer, Source, Marker } from "react-map-gl/mapbox";
import { Transport } from "../page";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

interface RouteGeoJSON {
  type: "Feature";
  geometry: {
    type: "LineString";
    coordinates: number[][];
  };
  properties: Record<string, unknown>;
}

const EditMap = ({
  transport,
  className,
}: {
  transport: Transport;
  className: string;
}) => {
  const [routeData, setRouteData] = useState<RouteGeoJSON | null>(null);

  const start = transport.directions?.start;
  const finish = transport.directions?.finish;
  const centerLng = start && finish ? (start.lng + finish.lng) / 2 : 19.48;
  const centerLat = start && finish ? (start.lat + finish.lat) / 2 : 52.07;

  useEffect(() => {
    if (!start || !finish) return;

    const fetchRoute = async () => {
      try {
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start.lng},${start.lat};${finish.lng},${finish.lat}?geometries=geojson&access_token=${MAPBOX_TOKEN}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.routes?.[0]) {
          setRouteData({
            type: "Feature",
            geometry: data.routes[0].geometry,
            properties: {},
          });
        }
      } catch (error) {
        console.error("Error fetching Mapbox route:", error);
      }
    };

    fetchRoute();
  }, [start?.lat, start?.lng, finish?.lat, finish?.lng]);

  return (
    <div className={className}>
      <ReactMap
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{
          longitude: centerLng,
          latitude: centerLat,
          zoom: 7,
        }}
        style={{ width: "100%", height: "100%", borderRadius: "0.5rem" }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        interactive={false}
        onLoad={(e) => e.target.setLanguage("pl")}
      >
        {routeData && (
          <Source id="route" type="geojson" data={routeData}>
            <Layer
              id="route-line"
              type="line"
              paint={{
                "line-color": "#1976D2",
                "line-width": 5,
                "line-opacity": 0.9,
              }}
              layout={{
                "line-cap": "round",
                "line-join": "round",
              }}
            />
          </Source>
        )}
        {start && (
          <Marker longitude={start.lng} latitude={start.lat} anchor="bottom">
            <div className="flex items-center justify-center w-7 h-7 bg-blue-600 rounded-full border-2 border-white shadow-lg text-white text-xs font-bold">
              A
            </div>
          </Marker>
        )}
        {finish && (
          <Marker longitude={finish.lng} latitude={finish.lat} anchor="bottom">
            <div className="flex items-center justify-center w-7 h-7 bg-red-500 rounded-full border-2 border-white shadow-lg text-white text-xs font-bold">
              B
            </div>
          </Marker>
        )}
      </ReactMap>
    </div>
  );
};

export default EditMap;
