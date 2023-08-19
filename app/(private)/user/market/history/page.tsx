import React from "react";
import { Transport } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { axiosInstance } from "@/lib/axios";
import { UserTransports } from "../user-transports";
import { TransportsHistory } from "./transports-history";

type Props = {};

const getUserTransports = async (userId: string) => {
  try {
    const response = await axiosInstance.get(
      `/api/transports/user?userId=${userId}`
    );
    const data = response.data;
    return data.transports;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export type ExtendedTransport = Transport & {
  directions: {
    start: {
      lat: number;
      lng: number;
    };
    finish: {
      lat: number;
      lng: number;
    };
  };
  category: {
    id: string;
    name: string;
  };
  type: {
    id: string;
    name: string;
  };
  vehicle: {
    id: string;
    name: string;
  };
};

const MarketHistory = async (props: Props) => {
  const session = await getServerSession(authOptions);
  const transports: ExtendedTransport[] = await getUserTransports(
    String(session?.user?.id)
  );

  const unactiveTransports = transports
    ? transports.filter((transport) => transport.isAvailable === false)
    : [];

  return (
    <div className="w-full">
      <TransportsHistory data={unactiveTransports} />
    </div>
  );
};

export default MarketHistory;
