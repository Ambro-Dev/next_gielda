import React from "react";

import { axiosInstance } from "@/lib/axios";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import TransportsFilter from "@/components/TransportsFilter";

export type Tags = {
  id: string;
  name: string;
  _count: {
    transports: number;
  };
};

export type Transport = {
  id: string;
  sendDate: Date;
  receiveDate: Date;
  vehicle: { id: string; name: string };
  category: { id: string; name: string };
  type: { id: string; name: string };
  directions: {
    finish: {
      lat: number;
      lng: number;
    };
    start: {
      lat: number;
      lng: number;
    };
  };
  creator: { id: string; username: string };
};

const getCategories = async (): Promise<Tags[]> => {
  try {
    const res = await axiosInstance.get("/api/settings/categories");

    return res.data.categories;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getVehicles = async (): Promise<Tags[]> => {
  try {
    const res = await axiosInstance.get("/api/settings/vehicles");
    return res.data.vehicles;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const checkUserInfo = async (userId: string): Promise<number> => {
  try {
    const response = await axiosInstance.get(`/api/auth/user?userId=${userId}`);
    const data = response.data;
    if (data.status === 402) {
      return 402;
    }
  } catch (error) {
    console.log(error);
  }
  return 200;
};

const getTransports = async (): Promise<Transport[]> => {
  try {
    const res = await axiosInstance.get("/api/transports");
    return res.data.transports;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default async function Home() {
  const categoriesData = getCategories();
  const vehiclesData = getVehicles();
  const transports = await getTransports();
  const session = await getServerSession(authOptions);
  if (session) {
    const status = await checkUserInfo(String(session?.user?.id));
    if (status === 402) {
      redirect("/user/profile/settings");
    }
  }

  const [vehicles, categories] = await Promise.all<Tags[]>([
    vehiclesData,
    categoriesData,
  ]);

  return (
    <>
      <TransportsFilter
        categories={categories}
        vehicles={vehicles}
        transports={transports}
      />
    </>
  );
}
