"use client";

import React, { useState, useEffect } from "react";
import ReactMap, { Layer, Source, Marker } from "react-map-gl/mapbox";
import { ExtendedTransport } from "@/app/(private)/user/market/page";
import {
  MAPBOX_TOKEN,
  MAP_STYLE,
  applyPremiumEffects,
  ROUTE_SIMPLE,
} from "@/lib/map-config";
import { RouteMarker } from "@/components/map/PremiumMarker";

interface RouteGeoJSON {
  type: "Feature";
  geometry: {
    type: "LineString";
    coordinates: number[][];
  };
  properties: Record<string, unknown>;
}

const Map = ({
  transport,
  className,
}: {
  transport: ExtendedTransport;
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
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start.lng},${start.lat};${finish.lng},${finish.lat}?geometries=geojson&overview=full&access_token=${MAPBOX_TOKEN}`;
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
          pitch: 20,
        }}
        style={{ width: "100%", height: "100%", borderRadius: "0.75rem" }}
        mapStyle={MAP_STYLE}
        interactive={false}
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
        {routeData && (
          <Source id="route" type="geojson" data={routeData}>
            <Layer
              id="route-line"
              type="line"
              paint={ROUTE_SIMPLE.paint}
              layout={ROUTE_SIMPLE.layout}
            />
          </Source>
        )}
        {start && (
          <Marker longitude={start.lng} latitude={start.lat} anchor="bottom">
            <RouteMarker type="start" />
          </Marker>
        )}
        {finish && (
          <Marker longitude={finish.lng} latitude={finish.lat} anchor="bottom">
            <RouteMarker type="end" />
          </Marker>
        )}
      </ReactMap>
    </div>
  );
};

export default Map;
