import { Metadata } from "next";
import { axiosInstance } from "@/lib/axios";
import { TransportOptionsClient } from "./transport-options-client";

export const metadata: Metadata = {
  title: "Opcje transportów",
  description: "Zarządzaj pojazdami i kategoriami transportów.",
};

const getVehicles = async () => {
  try {
    const res = await axiosInstance.get(`/api/settings/vehicles`);
    const data = res.data;
    return data.vehicles;
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return [];
  }
};

const getCategories = async () => {
  try {
    const res = await axiosInstance.get(`/api/settings/categories`);
    const data = res.data;
    return data.categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export default async function DashboardPage() {
  const [vehicles, categories] = await Promise.all([
    getVehicles(),
    getCategories(),
  ]);

  return (
    <div className="space-y-8 p-8 pt-6">
      <TransportOptionsClient vehicles={vehicles} categories={categories} />
    </div>
  );
}
