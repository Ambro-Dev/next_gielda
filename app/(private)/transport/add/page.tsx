// Force dynamic rendering to prevent static generation
export const dynamic = 'force-dynamic';

import { AddTransportForm } from "@/app/(private)/transport/add/AddTransportForm";
import { auth } from "@/auth";
import { axiosInstance } from "@/lib/axios";

import { redirect } from "next/navigation";

type Settings = {
  id: string;
  name: string;
  _count: {
    transports: number;
  };
};

type School = {
  id: string;
  administrators: {
    id: string;
  }[];
};

const getCategories = async () => {
  try {
    const res = await axiosInstance.get(`/api/settings/categories`);
    const data = res.data;
    return data.categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    // Return empty array during build or on error
    return [];
  }
};

const getVehicles = async () => {
  try {
    const res = await axiosInstance.get(`/api/settings/vehicles`);
    const data = res.data;
    return data.vehicles;
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    // Return empty array during build or on error
    return [];
  }
};

const getSchool = async (userId: String) => {
  try {
    const res = await axiosInstance.get(`/api/schools/school?userId=${userId}`);
    const data = res.data;
    return data.school;
  } catch (error) {
    console.error(error);
    return "";
  }
};

const AddTransportPage = async () => {
  const session = await auth();

  if (!session?.user) redirect("/signin");

  const categoriesData = getCategories();
  const vehiclesData = getVehicles();
  const school = await getSchool(String(session?.user.id));

  const [vehicles, categories] = await Promise.all<Settings[]>([
    vehiclesData,
    categoriesData,
  ]);

  const vehiclesNames = vehicles.map((vehicle) => ({
    id: vehicle.id,
    name: vehicle.name,
  }));
  const categoriesNames = categories.map((category) => ({
    id: category.id,
    name: category.name,
  }));

  return (
    <div className="py-6 space-y-8 pb-24">
      <div className="space-y-1 animate-fade-in animate-stagger-1">
        <p className="text-xs font-medium text-brand tracking-widest uppercase">
          Nowe zlecenie
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tighter text-foreground">
          Dodaj transport
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-[65ch] mt-1">
          Wypełnij formularz, aby dodać nowe zlecenie transportowe.
          Pola oznaczone <span className="text-brand">*</span> są wymagane.
        </p>

        <div className="flex items-center gap-3 text-xs text-muted-foreground pt-3">
          <span className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-brand/10 text-brand font-semibold flex items-center justify-center text-[10px]">1</span>
            Informacje
          </span>
          <span className="w-4 h-px bg-border" />
          <span className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-brand/10 text-brand font-semibold flex items-center justify-center text-[10px]">2</span>
            Terminy
          </span>
          <span className="w-4 h-px bg-border" />
          <span className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-brand/10 text-brand font-semibold flex items-center justify-center text-[10px]">3</span>
            Trasa
          </span>
          <span className="w-4 h-px bg-border" />
          <span className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-brand/10 text-brand font-semibold flex items-center justify-center text-[10px]">4</span>
            Ładunek
          </span>
        </div>
      </div>
      <AddTransportForm
        school={school}
        vehicles={vehiclesNames}
        categories={categoriesNames}
      />
    </div>
  );
};

export default AddTransportPage;
