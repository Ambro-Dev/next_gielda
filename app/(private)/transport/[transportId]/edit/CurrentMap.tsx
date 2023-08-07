"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { LatLngLiteral } from "leaflet";
import arrow_down from "@/assets/icons/arrow_down.png";
import { Transport } from "../page";
import Map from "@/components/Map";
import { ArrowDown } from "lucide-react";

const formatDate = (date: Date) => {
  const newDate = new Date(date);
  return newDate.toLocaleDateString("pl-PL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const CurrentTransportMap = ({ transport }: { transport: Transport }) => {
  const start = transport.directions.start;
  const finish = transport.directions.finish;

  const [directionsLeg, setDirectionsLeg] =
    useState<google.maps.DirectionsLeg>();

  useEffect(() => {
    if (!start || !finish) return;
    fetchDirections(start);
  }, [start, finish]);

  const fetchDirections = async (start: LatLngLiteral) => {
    if (!finish || !start) return;

    const service = new google.maps.DirectionsService();

    service.route(
      {
        origin: start,
        destination: finish,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirectionsLeg(result.routes[0].legs[0]);
        }
      }
    );
  };

  return (
    <>
      <div className="flex flex-row items-center justify-center space-y-8">
        <div className="grid md:grid-cols-2 grid-cols-1 w-full gap-8">
          <div className="flex flex-col pt-6 items-center gap-4">
            <div className="flex flex-col items-center justify-start">
              <span className="text-lg text-center">
                {directionsLeg?.start_address}
              </span>
            </div>
            <div className="flex items-center justify-center my-auto">
              <ArrowDown />
            </div>

            <div className="flex flex-col items-center justify-between">
              <span className="text-lg text-center ">
                {directionsLeg?.end_address}
              </span>
            </div>
          </div>
        </div>{" "}
      </div>
    </>
  );
};

export default CurrentTransportMap;
