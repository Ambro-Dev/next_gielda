import { AddTransportForm } from "@/app/(private)/transport/add/AddTransportForm";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Card, CardContent } from "@/components/ui/card";
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
  const res = await fetch(`http://localhost:3000/api/settings/categories`, {
    method: "GET",
    cache: "no-cache",
  });
  const data = await res.json();

  return data.categories;
};

const getVehicles = async () => {
  const res = await fetch(`http://localhost:3000/api/settings/vehicles`, {
    method: "GET",
    cache: "no-cache",
  });
  const data = await res.json();

  return data.vehicles;
};

const getTypes = async () => {
  const res = await fetch(`http://localhost:3000/api/settings/types`, {
    method: "GET",
    cache: "no-cache",
  });
  const data = await res.json();

  return data.types;
};

const getSchool = async (userId: String) => {
  const res = await fetch(
    `http://localhost:3000/api/schools/school?userId=${userId}`,
    {
      method: "GET",
      cache: "no-cache",
    }
  );
  const school = await res.json();

  return school.data.school;
};

const AddTransportPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect("/signin");

  const categoriesData = getCategories();
  const vehiclesData = getVehicles();
  const typesData = getTypes();
  const school: School = await getSchool(session.user.id);

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
