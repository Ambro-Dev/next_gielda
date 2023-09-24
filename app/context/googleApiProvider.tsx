"use client";

import { LoadScriptProps, useLoadScript } from "@react-google-maps/api";
import Loading from "../loading";

const libraries: LoadScriptProps["libraries"] = ["places"];

export const GoogleApiProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY as string,
    libraries,
  });

  if (!isLoaded) return <Loading />;
  return <>{children}</>;
};
