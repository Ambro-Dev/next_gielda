"use client";

import { LoadScriptProps, useLoadScript } from "@react-google-maps/api";

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

  if (!isLoaded)
    return (
      <div className="lg:pt-36 pt-20 flex-grow mx-auto max-w-6xl w-full"></div>
    );
  return <>{children}</>;
};
