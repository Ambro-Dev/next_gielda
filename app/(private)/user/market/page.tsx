import React from "react";
import { UserTransports } from "./user-transports";
import { Transport } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

type Props = {};

const getUserTransports = async (userId: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/transports/user?userId=${userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (response.ok) {
    const data = await response.json();
    return data;
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

const Market = async (props: Props) => {
  const session = await getServerSession(authOptions);
  const transports: ExtendedTransport[] = await getUserTransports(
    String(session?.user?.id)
  );

  console.log(transports);

  return (
    <div className="w-full">
      <UserTransports data={transports} />
    </div>
  );
};

export default Market;
