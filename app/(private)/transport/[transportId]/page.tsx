import React from "react";
import TransportMap from "./transport-map";
import TransportDetails from "./transport-details";
import TransportContactCard from "./contact-card";
import { axiosInstance } from "@/lib/axios";

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
  isAvailable: boolean;
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
  availableDate: Date;
  sendDate: Date;
  receiveDate: Date;
  type: { id: string; name: string };
};

const getTransport = async (transportId: string): Promise<Transport> => {
  try {
    const response = await axiosInstance.get(
      `/api/transports/transport?transportId=${transportId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return {} as Transport;
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
