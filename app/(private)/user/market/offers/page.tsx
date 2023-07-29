import React from "react";
import { ExtendedTransport } from "../page";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { OffersTable } from "./offers-table";

type Props = {};

export type ExtendedOffer = {
  id: string;
  brutto: number;
  netto: number;
  creator: {
    id: string;
    username: string;
  };
  currency: string;
  transport: ExtendedTransport;
  createdAt: Date;
};

const getUserOffers = async (userId: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/offers/user?userId=${userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    }
  );
  if (response.ok) {
    const data = await response.json();
    return data;
  }
  return [];
};

const MarketOffers = async (props: Props) => {
  const session = await getServerSession(authOptions);
  const offers = await getUserOffers(String(session?.user?.id));
  console.log(offers);
  return (
    <div>
      <OffersTable data={offers} />
    </div>
  );
};

export default MarketOffers;
