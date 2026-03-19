"use client";

import React, { useState, useEffect, useCallback } from "react";
import ReactMap, { Layer, Source, Marker, Popup } from "react-map-gl/mapbox";
// @ts-ignore
import polyline from "@mapbox/polyline";
import {
  MAPBOX_TOKEN,
  MAP_STYLE,
  applyPremiumEffects,
  ROUTE_HERO_GLOW,
  ROUTE_HERO_LINE,
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

type LatLng = { lat: number; lng: number };

const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  try {
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?types=address,place&language=pl&access_token=${MAPBOX_TOKEN}`
    );
    const data = await res.json();
    return data.features?.[0]?.place_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
};

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const TransportMap = ({
  start,
  finish,
  encodedPolyline,
  startAddress,
  endAddress,
  sendDate,
  receiveDate,
}: {
  start: LatLng;
  finish: LatLng;
  encodedPolyline?: string;
  startAddress?: string;
  endAddress?: string;
  sendDate?: Date;
  receiveDate?: Date;
}) => {
  const [routeData, setRouteData] = useState<RouteGeoJSON | null>(null);
  const [startLabel, setStartLabel] = useState(startAddress || "");
  const [endLabel, setEndLabel] = useState(endAddress || "");

  const centerLng = (start.lng + finish.lng) / 2;
  const centerLat = (start.lat + finish.lat) / 2;

  // Reverse geocode if addresses not provided
  useEffect(() => {
    if (!startAddress) {
      reverseGeocode(start.lat, start.lng).then(setStartLabel);
    }
    if (!endAddress) {
      reverseGeocode(finish.lat, finish.lng).then(setEndLabel);
    }
  }, [start.lat, start.lng, finish.lat, finish.lng, startAddress, endAddress]);

  // Always fetch full-resolution route from Mapbox Directions API
  // Stored polyline uses overview=simplified (low-res), so we fetch fresh with overview=full
  useEffect(() => {
    if (!start || !finish || !MAPBOX_TOKEN) {
      // Fallback: decode stored polyline if API params missing
      if (encodedPolyline) {
        try {
          const decoded = polyline.toGeoJSON(encodedPolyline);
          setRouteData({
            type: "Feature",
            geometry: decoded,
            properties: {},
          });
        } catch (e) {
          console.error("Error decoding polyline:", e);
        }
      }
      return;
    }

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
          return;
        }
      } catch (error) {
        console.error("Error fetching Mapbox route:", error);
      }
      // Fallback to stored polyline if fetch fails
      if (encodedPolyline) {
        try {
          const decoded = polyline.toGeoJSON(encodedPolyline);
          setRouteData({
            type: "Feature",
            geometry: decoded,
            properties: {},
          });
        } catch (e) {
          console.error("Error decoding polyline:", e);
        }
      }
    };

    fetchRoute();
  }, [start.lat, start.lng, finish.lat, finish.lng, encodedPolyline]);

  // Fit bounds + apply premium effects + camera animation
  const onMapLoad = useCallback(
    (e: any) => {
      const map = e.target;

      applyPremiumEffects(map, {
        terrain: true,
        buildings: true,
        fog: true,
        sky: true,
      });

      const sw: [number, number] = [
        Math.min(start.lng, finish.lng),
        Math.min(start.lat, finish.lat),
      ];
      const ne: [number, number] = [
        Math.max(start.lng, finish.lng),
        Math.max(start.lat, finish.lat),
      ];

      map.fitBounds([sw, ne], {
        padding: { top: 100, bottom: 50, left: 70, right: 70 },
        maxZoom: 13,
        duration: 1500,
      });

      // Animate to 3D perspective after fitBounds
      setTimeout(() => {
        map.easeTo({
          pitch: 40,
          bearing: -15,
          duration: 2000,
        });
      }, 1600);
    },
    [start.lat, start.lng, finish.lat, finish.lng]
  );

  return (
    <ReactMap
      mapboxAccessToken={MAPBOX_TOKEN}
      initialViewState={{
        longitude: centerLng,
        latitude: centerLat,
        zoom: 6,
      }}
      style={{ width: "100%", height: "100%", borderRadius: "0.75rem" }}
      mapStyle={MAP_STYLE}
      onLoad={onMapLoad}
    >
      {routeData && (
        <Source id="route" type="geojson" data={routeData}>
          {/* Outer glow */}
          <Layer
            id="route-glow"
            type="line"
            paint={ROUTE_HERO_GLOW.paint}
            layout={ROUTE_HERO_GLOW.layout}
          />
          {/* Inner route line */}
          <Layer
            id="route-line"
            type="line"
            paint={ROUTE_HERO_LINE.paint}
            layout={ROUTE_HERO_LINE.layout}
          />
        </Source>
      )}

      {/* Start marker + popup */}
      <Marker longitude={start.lng} latitude={start.lat} anchor="bottom">
        <RouteMarker type="start" />
      </Marker>
      {startLabel && (
        <Popup
          longitude={start.lng}
          latitude={start.lat}
          anchor="bottom"
          offset={45}
          closeButton={false}
          closeOnClick={false}
          className="map-popup map-popup--start"
        >
          <div className="px-3 py-2">
            <p className="text-xs font-semibold text-[hsl(39,85%,50%)]">Wysyłka</p>
            <p className="text-xs font-medium text-gray-900">{startLabel}</p>
            {sendDate && (
              <p className="text-[10px] text-gray-500 mt-0.5">{formatDate(sendDate)}</p>
            )}
          </div>
        </Popup>
      )}

      {/* Finish marker + popup */}
      <Marker longitude={finish.lng} latitude={finish.lat} anchor="bottom">
        <RouteMarker type="end" />
      </Marker>
      {endLabel && (
        <Popup
          longitude={finish.lng}
          latitude={finish.lat}
          anchor="bottom"
          offset={45}
          closeButton={false}
          closeOnClick={false}
          className="map-popup map-popup--end"
        >
          <div className="px-3 py-2">
            <p className="text-xs font-semibold text-[hsl(225,30%,14%)]">Dostawa</p>
            <p className="text-xs font-medium text-gray-900">{endLabel}</p>
            {receiveDate && (
              <p className="text-[10px] text-gray-500 mt-0.5">
                {formatDate(receiveDate)}
              </p>
            )}
          </div>
        </Popup>
      )}
    </ReactMap>
  );
};

export default TransportMap;
