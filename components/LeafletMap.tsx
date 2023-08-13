"use client";

import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from "leaflet";
import "leaflet-routing-machine";
import { createControlComponent } from "@react-leaflet/core";

const createRoutingMachineLayer = () => {
  const instance = L.Routing.control({
    waypoints: [
      L.latLng(52.22977, 21.01178), // Start point
      L.latLng(52.2, 21.1), // End point
    ],
    lineOptions: {
      styles: [{ color: "#000", opacity: 0.8, weight: 2 }],
      extendToWaypoints: true,
      missingRouteTolerance: 0,
    },
    showAlternatives: false,
    addWaypoints: false,
    fitSelectedRoutes: false,
    show: false,
  });

  return instance;
};

const RoutingMachine = createControlComponent(createRoutingMachineLayer);

type Props = {};

const LeafletMap = (props: Props) => {
  return (
    <MapContainer
      center={[52.22977, 21.01178]}
      zoom={11}
      scrollWheelZoom={false}
      zoomControl={false}
      dragging={true}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker
        position={[52.22977, 21.01178]}
        draggable={false}
        icon={L.icon({
          iconUrl: "https://img.icons8.com/stickers/100/marker-b.png",
          iconSize: [48, 48],
          iconAnchor: [24, 48],
          popupAnchor: [0, -48],
        })}
      >
        <Popup>Hey! You found me</Popup>
      </Marker>
      <RoutingMachine />
    </MapContainer>
  );
};

export default LeafletMap;
