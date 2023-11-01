import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Card, CardContent } from "@/components/ui/card";
import { axiosInstance } from "@/lib/axios";
import { getServerSession } from "next-auth";
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
  params: {
    transportId: string;
  };
};

const getCategories = async () => {
  try {
    const res = await axiosInstance.get(`/api/settings/categories`);
    const data = res.data;
    return data.categories;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const getVehicles = async () => {
  try {
    const res = await axiosInstance.get(`/api/settings/vehicles`);
    const data = res.data;
    return data.vehicles;
  } catch (error) {
    console.error(error);
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
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect("/signin");

  const categoriesData = getCategories();
  const vehiclesData = getVehicles();
  const school = await getSchool(String(session?.user.id));
  const transport = await getTransport(String(props.params.transportId));

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
    <div className="flex w-full h-full pt-5 pb-10">
      <Card className="w-full h-full pt-5">
        <CardContent>
          <EditTransportForm
            user={String(session?.user.id)}
            school={school}
            transport={transport}
            vehicles={vehiclesNames}
            categories={categoriesNames}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EditTransport;
