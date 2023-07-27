"use client";
import React, { useEffect, useState } from "react";
import { Transport } from "./page";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { LatLngLiteral } from "leaflet";

import distance_icon from "@/assets/icons/distance.png";
import time_icon from "@/assets/icons/time.png";
import date_icon from "@/assets/icons/date.png";
import user_icon from "@/assets/icons/user.png";
import view_icon from "@/assets/icons/view.png";
import vehicle_icon from "@/assets/icons/vehicle.png";
import arrow_down from "@/assets/icons/arrow_down.png";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ObjectsTable } from "@/components/ObjectsTable";

const formatDate = (date: Date) => {
  const newDate = new Date(date);
  return newDate.toLocaleDateString("pl-PL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const TransportDetails = ({ transport }: { transport: Transport }) => {
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
      <div className="flex flex-col items-start justify-center space-y-8">
        <div className="flex pb-6 flex-row items-center justify-start gap-2">
          <Badge>{transport.category.name}</Badge>
          <Badge className="uppercase">{transport.type.name}</Badge>
        </div>

        <div className="flex flex-row gap-8 px-5 items-center justify-around w-full flex-wrap">
          <div className="flex flex-row items-center gap-2">
            <Image src={user_icon} alt="user" width={24} height={24} />
            <span className="text-sm font-bold">
              {transport.creator.username}
            </span>
          </div>
          <div className="flex flex-row items-center gap-2">
            <Image src={view_icon} alt="distance" width={24} height={24} />
            <span className="text-sm font-bold">{8}</span>
          </div>
          <div className="flex flex-row items-center gap-2">
            <Image src={vehicle_icon} alt="date" width={24} height={24} />
            <span className="text-sm font-bold capitalize">
              {transport.vehicle.name}
            </span>
          </div>
          <div className="flex flex-row items-center gap-2">
            <Image src={date_icon} alt="date" width={24} height={24} />
            <span className="text-sm font-bold">
              {formatDate(transport.createdAt)}
            </span>
          </div>

          <div className="flex flex-row items-center gap-2">
            <Image src={distance_icon} alt="distance" width={24} height={24} />
            <span className="text-sm font-bold">
              {directionsLeg?.distance?.text}
            </span>
          </div>
          <div className="flex flex-row items-center gap-2">
            <Image src={time_icon} alt="time" width={24} height={24} />
            <span className="text-sm font-bold">
              {directionsLeg?.duration?.text}
            </span>
          </div>
        </div>
        <Card className="p-3 w-full">
          <CardHeader>
            <CardTitle>
              Opis
              <Separator className="h-[3px] mt-3 w-1/5 bg-amber-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-light">{transport.description}</p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 grid-cols-1 w-full gap-8">
          <Card className="p-3">
            <CardHeader>
              <CardTitle>
                Trasa
                <Separator className="h-[3px] mt-3 bg-amber-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col pt-6 items-center gap-4">
                <div className="flex flex-col items-center justify-start">
                  <span className="text-sm font-bold text-center">
                    Data wysyłki:{" "}
                    <span className="text-amber-500">
                      {formatDate(transport.sendDate)}
                    </span>
                  </span>
                  <span className="text-lg text-center">
                    {directionsLeg?.start_address}
                  </span>
                </div>
                <div className="flex items-center justify-center my-auto">
                  <Image src={arrow_down} alt="arrow" width={36} height={36} />
                </div>

                <div className="flex flex-col items-center justify-between">
                  <span className="text-sm font-bold text-center">
                    Data dostawy:{" "}
                    <span className="text-amber-500">
                      {formatDate(transport.receiveDate)}
                    </span>
                  </span>
                  <span className="text-lg text-center ">
                    {directionsLeg?.end_address}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="p-3">
            <CardHeader>
              <CardTitle>
                Przedmioty
                <Separator className="h-[3px] mt-3 bg-amber-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ObjectsTable data={transport.objects} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default TransportDetails;
