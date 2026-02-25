import React from "react";
import TransportMap from "./transport-map";
import TransportDetails from "./transport-details";
import TransportContactCard from "./contact-card";
import { axiosInstance } from "@/lib/axios";
import GoBack from "@/components/ui/go-back";
import { notFound } from "next/navigation";

type PageParams = {
  params: Promise<{
    transportId: string;
  }>;
};

export type Transport = {
  id: string;
  category: { id: string; name: string };
  creator: { id: string; username: string };
  createdAt: Date;
  isAccepted: boolean;
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
  sendTime: string;
  receiveTime: string;
  sendDate: Date;
  receiveDate: Date;
  start_address?: string;
  end_address?: string;
  distance?: { text: string; value: number };
  duration?: { text: string; value: number };
  polyline?: string;
};

const getTransport = async (transportId: string): Promise<Transport> => {
  try {
    const response = await axiosInstance.get(
      `/api/transports/transport?transportId=${transportId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    notFound();
  }
};

const TransportInfo = async ({ params: paramsPromise }: PageParams) => {
  const params = await paramsPromise;
  const transport: Transport = await getTransport(params.transportId);
  return (
    <div className="relative flex w-full flex-col gap-6 py-6">
      {/* Map */}
      <div className="relative rounded-lg overflow-hidden h-[300px] lg:h-[400px]">
        <TransportMap
          start={transport.directions.start}
          finish={transport.directions.finish}
          encodedPolyline={transport.polyline}
          startAddress={transport.start_address}
          endAddress={transport.end_address}
          sendDate={transport.sendDate}
          receiveDate={transport.receiveDate}
        />
        <GoBack className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm shadow-sm border border-gray-200" />
      </div>

      {/* Details */}
      <TransportDetails transport={transport} />

      {/* Offers */}
      <TransportContactCard transport={transport} />
    </div>
  );
};

export default TransportInfo;
