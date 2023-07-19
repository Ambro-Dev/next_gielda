"use client";
import { LoadScriptNext } from "@react-google-maps/api";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";

import { GoogleMap, DirectionsRenderer } from "@react-google-maps/api";
import Image from "next/image";

import distance_icon from "@/assets/icons/distance.png";
import time_icon from "@/assets/icons/time.png";
import date_icon from "@/assets/icons/date.png";
import user_icon from "@/assets/icons/user.png";
import view_icon from "@/assets/icons/view.png";
import vehicle_icon from "@/assets/icons/vehicle.png";
import arrow_icon from "@/assets/icons/arrow.png";
import pin_a from "@/assets/icons/pin-A.png";
import pin_b from "@/assets/icons/pin-B.png";

import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Transports } from "@/app/interfaces/Transports";

type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
type MapOptions = google.maps.MapOptions;

type Props = {
  transport: Transports;
};

const googleApi: string | undefined =
  process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;

const CardWithMap = ({ transport }: Props) => {
  const date = new Date(transport.sendDate);
  const formatedDate = date.toLocaleDateString("pl-PL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const mapRef = useRef<GoogleMap>();

  const [directionsLeg, setDirectionsLeg] =
    useState<google.maps.DirectionsLeg>();

  const onLoad = useCallback((map: any) => (mapRef.current = map), []);

  const [directions, setDirections] = useState<DirectionsResult>();

  const options = useMemo<MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: false,
      zoomControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      mapTypeControl: false,
      disableDoubleClickZoom: true,
      scrollwheel: false,
      gestureHandling: "none",
    }),
    []
  );

  useEffect(() => {
    if (!transport.directions.start || !transport.directions.finish) return;
    fetchDirections(transport.directions.start);
  }, [transport.directions.start, transport.directions.finish]);

  const fetchDirections = async (start: LatLngLiteral) => {
    if (!transport.directions.finish || !start) return;

    const service = new google.maps.DirectionsService();

    service.route(
      {
        origin: start,
        destination: transport.directions.finish,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);
          setDirectionsLeg(result.routes[0].legs[0]);
        }
      }
    );
  };

  const containerStyle = {
    width: "100%",
    height: "300px",
    borderRadius: "0.5rem",
  };
  return (
    <Card className="flex flex-col">
      <CardHeader className="h-80">
        <GoogleMap
          zoom={11}
          mapContainerClassName="map-container"
          options={options}
          onLoad={onLoad}
          mapContainerStyle={containerStyle}
        >
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                polylineOptions: {
                  strokeColor: "#1976D2",
                  strokeWeight: 5,
                  clickable: false,
                },
                markerOptions: {
                  zIndex: 100,
                  cursor: "default",
                },
              }}
            />
          )}
        </GoogleMap>
      </CardHeader>
      <div className="grow">
        <CardContent>
          <div className="flex pb-6 flex-row items-center justify-between w-full gap-2">
            <div className="flex flex-row items-center gap-2">
              <Badge>{transport.category}</Badge>
              <Badge className="uppercase">{transport.type}</Badge>
            </div>
            <div className="flex flex-row items-center gap-2 w-1/5">
              <Image src={view_icon} alt="distance" width={24} height={24} />
              <span className="text-sm font-bold">{8}</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 px-5">
            <div className="flex flex-row items-center gap-2">
              <Image src={user_icon} alt="user" width={24} height={24} />
              <span className="text-sm font-bold">{transport.creator}</span>
            </div>
            <div className="flex flex-row items-center gap-2">
              <Image src={vehicle_icon} alt="date" width={24} height={24} />
              <span className="text-sm font-bold capitalize">
                {transport.transportVehicle}
              </span>
            </div>
            <div className="flex flex-row items-center gap-2">
              <Image src={date_icon} alt="date" width={24} height={24} />
              <span className="text-sm font-bold">{formatedDate}</span>
            </div>

            <div className="flex flex-row items-center gap-2">
              <Image
                src={distance_icon}
                alt="distance"
                width={24}
                height={24}
              />
              <span className="text-sm font-bold">
                {directionsLeg?.distance?.text}
              </span>
            </div>
            <div className="flex col-span-2 flex-row items-center gap-2">
              <Image src={time_icon} alt="time" width={24} height={24} />
              <span className="text-sm font-bold">
                {directionsLeg?.duration?.text}
              </span>
            </div>
          </div>
          <div className="flex flex-row pt-6 items-start">
            <div className="flex flex-col items-center justify-start h-full w-5/12">
              <Image
                src="https://img.icons8.com/stickers/100/marker-a.png"
                width={48}
                height={48}
                alt="start"
              />
              <span className="text-sm font-bold text-center">
                {directionsLeg?.start_address}
              </span>
            </div>
            <div className="flex items-center justify-center my-auto w-2/12">
              <Image src={arrow_icon} alt="arrow" width={36} height={36} />
            </div>

            <div className="flex flex-col items-center justify-between w-5/12">
              <Image
                src="https://img.icons8.com/stickers/100/marker-b.png"
                width={48}
                height={48}
                alt="start"
              />
              <span className="text-sm font-bold text-center">
                {directionsLeg?.end_address}
              </span>
            </div>
          </div>
        </CardContent>
      </div>

      <CardFooter>
        <Link href="/transport/1" className="w-full">
          <Button className="w-full">Zobacz ogłoszenie</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CardWithMap;
