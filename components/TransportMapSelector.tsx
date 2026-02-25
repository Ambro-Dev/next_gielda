import React from "react";
import NewPlaceSelector from "./NewPlaceSelector";

type LatLng = { lat: number; lng: number };

type Props = {
  setPlace: (position: LatLng) => void;
  setAddress?: (address: string) => void;
  placeholder?: string;
};

const TransportMapSelector = ({ setPlace, setAddress, placeholder }: Props) => {
  const handlePlaceSelect = (place: {
    lat: number;
    lng: number;
    formatted_address: string;
  }) => {
    setPlace({ lat: place.lat, lng: place.lng });
    setAddress?.(place.formatted_address);
  };

  return (
    <NewPlaceSelector
      setPlace={handlePlaceSelect}
      placeholder={placeholder}
    />
  );
};

export default TransportMapSelector;
