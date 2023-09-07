import React from "react";
import { OffersTable } from "../offers-table";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { axiosInstance } from "@/lib/axios";

type Props = {};

const getUserOffers = async (userId: string) => {
  try {
    const response = await axiosInstance.get(
      `/api/offers/send?userId=${userId}`
    );
    const data = response.data;
    return data.offers;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const Page = async (props: Props) => {
  const session = await getServerSession(authOptions);
  const offers = await getUserOffers(String(session?.user?.id));
  return (
    <div>
      <OffersTable data={offers} title="Lista wysłanych ofert" />
    </div>
  );
};

export default Page;
