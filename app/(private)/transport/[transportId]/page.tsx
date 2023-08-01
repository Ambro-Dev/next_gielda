import React from "react";
import TransportMap from "./transport-map";
import TransportDetails from "./transport-details";
import TransportContactCard from "./contact-card";
import { Offer } from "@prisma/client";
import { axiosInstance } from "@/lib/axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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

const addVisit = async (transportId: string, userId: string) => {
  try {
    await axiosInstance.post(`/api/transports/visit`, {
      transportId,
      userId,
    });
  } catch (error) {
    console.error(error);
  }
};

const TransportInfo = async ({ params }: PageParams) => {
  const session = await getServerSession(authOptions);
  const transport: Transport = await getTransport(params.transportId);
  await addVisit(params.transportId, String(session?.user?.id));
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
