"use client";
import { LoadScriptNext } from "@react-google-maps/api";

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

const start = {
  lat: 51.22977,
  lng: 25.01178,
};
const finish = {
  lat: 42.22977,
  lng: 19.01178,
};

const googleApi: string | undefined =
  process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;

const TransportInfo = () => {
  const mapRef = useRef<GoogleMap>();

  const [loaded, setLoaded] = useState(false);

  const [directionsLeg, setDirectionsLeg] =
    useState<google.maps.DirectionsLeg>();

  const onLoad = useCallback((map: any) => (mapRef.current = map), []);

  const [directions, setDirections] = useState<DirectionsResult>();

  const options = useMemo<MapOptions>(
    () => ({
      streetViewControl: false,
      mapTypeControl: false,
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
    borderRadius: "0.5rem",
  };
  return (
    <div className="flex w-full h-full flex-col gap-4 px-3">
      <LoadScriptNext
        googleMapsApiKey={googleApi as string}
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
    </div>
  );
};

export default TransportInfo;
