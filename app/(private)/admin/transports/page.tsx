import axios from "@/lib/axios";
import { Metadata } from "next";
import React from "react";
import { CategoryCard } from "./category-card";
import { TypeCard } from "./type-card";
import { VehicleCard } from "./vehicle-card";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app using the components.",
};

type Settings = {
  id: string;
  name: string;
};

async function getCategories(fetchType: string) {
  const { data } = await axios.get<Settings[]>(`/settings/${fetchType}`);
  return data;
}

export default async function DashboardPage() {
  const categories = await getCategories("category");
  const vehicles = await getCategories("vehicle");
  return (
    <>
      <h3 className="font-bold pt-5 pl-10 text-2xl">Opcje transportów</h3>
      <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8 p-5">
        <CategoryCard categories={categories} />
        <TypeCard />
        <VehicleCard vehicles={vehicles} />
      </div>
    </>
  );
}
