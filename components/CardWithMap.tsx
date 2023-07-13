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

type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
type MapOptions = google.maps.MapOptions;

type Props = {
  start: LatLngLiteral;
  finish: LatLngLiteral;
};

const CardWithMap = ({ start, finish }: Props) => {
  const mapRef = useRef<GoogleMap>();

  const [loaded, setLoaded] = useState(false);

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
    if (!start || !finish || !loaded) return;
    fetchDirections(start);
  }, [start, finish, loaded]);

  const fetchDirections = async (start: LatLngLiteral) => {
    if (!finish || !start) return;

    if (!loaded) return;
    const service = new google.maps.DirectionsService();

    service.route(
      {
        origin: start,
        destination: finish,
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
  };
  return (
    <Card className="flex flex-col">
      <CardHeader className="h-80 -p-2">
        <LoadScriptNext
          googleMapsApiKey="AIzaSyCyJ8vmWKxKxO6PCMnyijjuTger_SqNrgg"
          libraries={["places"]}
          onLoad={() => {
            setLoaded(true);
          }}
          loadingElement={<div className="h-full" />}
        >
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
        </LoadScriptNext>
      </CardHeader>
      <div className="grow">
        <CardContent>
          <div className="flex justify-between">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Odległość</span>
              <span className="text-sm font-bold">
                {directionsLeg?.distance?.text}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Czas</span>
              <span className="text-sm font-bold">
                {directionsLeg?.duration?.text}
              </span>
            </div>
          </div>

          <div className="flex justify-between">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Początek</span>
              <span className="text-sm font-bold">
                {directionsLeg?.start_address}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Koniec</span>
              <span className="text-sm font-bold">
                {directionsLeg?.end_address}
              </span>
            </div>
          </div>
        </CardContent>
      </div>

      <CardFooter>
        <Button className="w-full">Zobacz ogłoszenia</Button>
      </CardFooter>
    </Card>
  );
};

export default CardWithMap;
