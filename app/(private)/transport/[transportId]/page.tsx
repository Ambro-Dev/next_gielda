import React from "react";
import TransportMap from "./transport-map";
import TransportDetails from "./transport-details";
import TransportContactCard from "./contact-card";
import { Offer } from "@prisma/client";

type PageParams = {
  params: {
    transportId: string;
  };
};

export type Transport = {
  id: string;
  category: { id: string; name: string };
  creator: { id: string; username: string };
  createdAt: Date;
  vehicle: { id: string; name: string };
  description: string;
  directions: {
    start: { lat: number; lng: number };
    finish: { lat: number; lng: number };
  };
  objects: [
    {
      id: string;
      name: string;
      amount: number;
      description: string;
      height: number;
      width: number;
      length: number;
      weight: number;
    }
  ];
  sendDate: Date;
  receiveDate: Date;
  type: { id: string; name: string };
};

const getTransport = async (transportId: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/transports/transport?transportId=${transportId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-cache",
      }
    );
    const transport = await response.json();
    return transport;
  } catch (error) {
    console.error(error);
  }
};

const TransportInfo = async ({ params }: PageParams) => {
  const transport: Transport = await getTransport(params.transportId);
  return (
    <div className="flex w-full h-full flex-col gap-4 px-3 my-5">
      <TransportMap
        start={transport.directions.start}
        finish={transport.directions.finish}
      />
      <TransportDetails transport={transport} />
      <TransportContactCard transport={transport} />
    </div>
  );
};

export default TransportInfo;
