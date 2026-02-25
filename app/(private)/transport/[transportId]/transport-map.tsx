"use client";

import React, { useState, useEffect, useCallback } from "react";
import ReactMap, { Layer, Source, Marker, Popup } from "react-map-gl/mapbox";
// @ts-ignore
import polyline from "@mapbox/polyline";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

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

  // Decode stored polyline or fetch from API
  useEffect(() => {
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
      return;
    }

    if (!start || !finish || !MAPBOX_TOKEN) return;

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
  }, [start.lat, start.lng, finish.lat, finish.lng, encodedPolyline]);

  // Fit bounds to show both markers + popups
  const onMapLoad = useCallback(
    (e: any) => {
      const map = e.target;
      map.setLanguage("pl");

      const sw: [number, number] = [
        Math.min(start.lng, finish.lng),
        Math.min(start.lat, finish.lat),
      ];
      const ne: [number, number] = [
        Math.max(start.lng, finish.lng),
        Math.max(start.lat, finish.lat),
      ];

      map.fitBounds([sw, ne], {
        padding: { top: 80, bottom: 40, left: 60, right: 60 },
        maxZoom: 12,
      });
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
      style={{ width: "100%", height: "100%", borderRadius: "0.5rem" }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      onLoad={onMapLoad}
    >
      {routeData && (
        <Source id="route" type="geojson" data={routeData}>
          <Layer
            id="route-line"
            type="line"
            paint={{
              "line-color": "#1976D2",
              "line-width": 4,
              "line-opacity": 0.85,
            }}
            layout={{
              "line-cap": "round",
              "line-join": "round",
            }}
          />
        </Source>
      )}

      {/* Start marker + popup */}
      <Marker longitude={start.lng} latitude={start.lat} anchor="center">
        <div className="flex items-center justify-center w-7 h-7 bg-blue-600 rounded-full border-2 border-white shadow-lg text-white text-xs font-bold">
          A
        </div>
      </Marker>
      {startLabel && (
        <Popup
          longitude={start.lng}
          latitude={start.lat}
          anchor="bottom"
          offset={20}
          closeButton={false}
          closeOnClick={false}
          className="map-popup"
        >
          <div className="px-1 py-0.5">
            <p className="text-xs font-semibold text-blue-600">Wysyłka</p>
            <p className="text-xs font-medium text-gray-900">{startLabel}</p>
            {sendDate && (
              <p className="text-[10px] text-gray-500">{formatDate(sendDate)}</p>
            )}
          </div>
        </Popup>
      )}

      {/* Finish marker + popup */}
      <Marker longitude={finish.lng} latitude={finish.lat} anchor="center">
        <div className="flex items-center justify-center w-7 h-7 bg-red-500 rounded-full border-2 border-white shadow-lg text-white text-xs font-bold">
          B
        </div>
      </Marker>
      {endLabel && (
        <Popup
          longitude={finish.lng}
          latitude={finish.lat}
          anchor="bottom"
          offset={20}
          closeButton={false}
          closeOnClick={false}
          className="map-popup"
        >
          <div className="px-1 py-0.5">
            <p className="text-xs font-semibold text-red-500">Dostawa</p>
            <p className="text-xs font-medium text-gray-900">{endLabel}</p>
            {receiveDate && (
              <p className="text-[10px] text-gray-500">
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
