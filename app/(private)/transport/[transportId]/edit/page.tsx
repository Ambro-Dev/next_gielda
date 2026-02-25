import { auth } from "@/auth";
import { axiosInstance } from "@/lib/axios";

import { redirect } from "next/navigation";
import { EditTransportForm } from "./EditTransportForm";
import { Transport } from "../page";

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

type Props = {
  params: Promise<{
    transportId: string;
  }>;
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

const getTransport = async (transportId: string): Promise<Transport> => {
  try {
    const res = await axiosInstance.get(
      `/api/transports/transport?transportId=${transportId}`
    );
    const data = res.data;
    return data;
  } catch (error) {
    console.error(error);
    return {} as Transport;
  }
};

const EditTransport = async (props: Props) => {
  const { transportId } = await props.params;
  const session = await auth();

  if (!session?.user) redirect("/signin");

  const categoriesData = getCategories();
  const vehiclesData = getVehicles();
  const school = await getSchool(String(session?.user.id));
  const transport = await getTransport(transportId);

  if (!transport) redirect("/");
  if (transport.creator.id !== session?.user.id)
    redirect(`/transport/${transport.id}`);

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
    <div className="py-6 space-y-6 pb-10">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          Edytuj ogłoszenie
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Zaktualizuj dane zlecenia transportowego.
        </p>
      </div>
      <EditTransportForm
        user={String(session?.user.id)}
        school={school}
        transport={transport}
        vehicles={vehiclesNames}
        categories={categoriesNames}
      />
    </div>
  );
};

export default EditTransport;
