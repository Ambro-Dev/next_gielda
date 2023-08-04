import { AddTransportForm } from "@/app/(private)/transport/add/AddTransportForm";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Card, CardContent } from "@/components/ui/card";
import { axiosInstance } from "@/lib/axios";
import { getServerSession } from "next-auth";
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
  administrator: {
    id: string;
  };
};

const getCategories = async () => {
  try {
    const res = await axiosInstance.get(`/api/settings/categories`);
    const data = res.data;
    return data.categories;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getVehicles = async () => {
  try {
    const res = await axiosInstance.get(`/api/settings/vehicles`);
    const data = res.data;
    return data.vehicles;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getTypes = async () => {
  try {
    const res = await axiosInstance.get(`/api/settings/types`);
    const data = res.data;
    return data.types;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getSchool = async (userId: String) => {
  try {
    const res = await axiosInstance.get(`/api/schools/school?userId=${userId}`);
    const data = res.data;
    return data.school;
  } catch (error) {
    console.log(error);
    return "";
  }
};

const AddTransportPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect("/signin");

  const categoriesData = getCategories();
  const vehiclesData = getVehicles();
  const typesData = getTypes();
  const school = await getSchool(String(session?.user.id));

  const [vehicles, categories, types] = await Promise.all<Settings[]>([
    vehiclesData,
    categoriesData,
    typesData,
  ]);

  const vehiclesNames = vehicles.map((vehicle) => ({
    id: vehicle.id,
    name: vehicle.name,
  }));
  const categoriesNames = categories.map((category) => ({
    id: category.id,
    name: category.name,
  }));
  const typesNames = types.map((type) => ({ id: type.id, name: type.name }));

  return (
    <div className="flex w-full h-full pt-5 pb-10">
      <Card className="w-full h-full pt-5">
        <CardContent>
          <AddTransportForm
            school={school}
            vehicles={vehiclesNames}
            types={typesNames}
            categories={categoriesNames}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AddTransportPage;
