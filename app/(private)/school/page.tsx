import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Truck, Users } from "lucide-react";
import { axiosInstance } from "@/lib/axios";
import { GetExpireTimeLeft } from "@/app/lib/getExpireTimeLeft";
import { auth } from "@/auth";
import { RecentTransports } from "@/components/dashboard/recent-transports";
import { School } from "@prisma/client";
import { StudentsTable } from "../admin/schools/[schoolId]/students/students-table";
import { columns } from "../admin/schools/[schoolId]/students/columns";
import { columns as transportColumns } from "../admin/schools/[schoolId]/transports/colums";
import { columns as offerColumns } from "./components/columns";
import { AddStudentForm } from "../admin/schools/[schoolId]/students/add-student-form";
import { TransportsTable } from "../admin/schools/[schoolId]/transports/transports-table";
import { OffersTable } from "./components/offers-table";

type SchoolWithTransports = {
  school: {
    id: string;
    name: string;
    _count: {
      transports: number;
      students: number;
    };
    administrators: {
      id: string;
      username: string;
      email: string;
    }[];
    accessExpires: Date;
  };
  latestTransports: {
    id: string;
    description: string;
    createdAt: Date;
    vehicle: {
      id: string;
      name: string;
    };
    category: {
      id: string;
      name: string;
    };
    creator: {
      id: string;
      username: string;
    };
    _count: {
      objects: number;
    };
  }[];
};

type Transport = {
  id: string;
  description: string;
  createdAt: Date;
  vehicle: {
    id: string;
    name: string;
  };
  category: {
    id: string;
    name: string;
  };
  creator: {
    id: string;
    username: string;
  };
  _count: {
    objects: number;
  };
};

type Offer = {
  id: string;
  creator: {
    id: string;
    username: string;
    name?: string;
    surname?: string;
    student?: {
      name: string;
      surname: string;
    };
  };
  createdAt: Date;
  transport: {
    id: string;
  };
  brutto: number;
};

type columnOffer = {
  id: string;
  creator: string;
  name_surname: string;
  createdAt: Date;
  transportId: string;
  brutto: number;
};

type Props = {
  params: {
    schoolId: string;
  };
};

const getSchoolTransports = async (schoolId: string) => {
  try {
    const response = await axiosInstance.get(
      `/api/schools/school/transports?schoolId=${schoolId}`
    );
    const data = response.data;
    return data.transports;
  } catch (error) {}
};

const getSchool = async (schoolId: string): Promise<SchoolWithTransports> => {
  try {
    const res = await axiosInstance.get(
      `/api/schools/manage?schoolId=${schoolId}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
    return {} as SchoolWithTransports;
  }
};

const getOffers = async (schoolId: string): Promise<Offer[]> => {
  try {
    const res = await axiosInstance.get(
      `/api/schools/offers?schoolId=${schoolId}`
    );
    const offers = res.data.map((offer: Offer) => {
      const formatedDate = new Date(offer.createdAt).toLocaleDateString(
        "pl-PL"
      );
      return {
        id: offer.id,
        creator: offer.creator.username,
        name_surname: offer.creator.name
          ? `${offer.creator.name} ${offer.creator.surname}`
          : `${offer.creator.student?.name} ${offer.creator.student?.surname}`,
        createdAt: formatedDate,
        transportId: offer.transport.id,
        brutto: offer.brutto,
      };
    });
    return offers;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const getSchoolId = async (userId: string): Promise<School> => {
  try {
    const res = await axiosInstance.get(
      `/api/schools/manage/school?userId=${userId}`
    );
    return res.data.school;
  } catch (error) {
    console.error(error);
    return {} as School;
  }
};

async function getStudents(schoolId: string) {
  try {
    const res = await axiosInstance.get(
      `/api/schools/students?schoolId=${schoolId}`
    );
    const data = res.data;
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function SchoolManagement() {
  const session = await auth();
  const school = await getSchoolId(String(session?.user.id));
  const data = await getSchool(school.id);
  const students = await getStudents(school.id);
  const offers = await getOffers(school.id);

  const transportsData = await getSchoolTransports(String(school.id));

  const timeToExpire = GetExpireTimeLeft(data.school.accessExpires);

  const transports = await transportsData.map((transport: Transport) => {
    const formatedDate = new Date(transport.createdAt).toLocaleDateString(
      "pl-PL"
    );
    return {
      id: transport.id,
      vehicle: transport.vehicle.name,
      category: transport.category.name,
      creator: transport.creator.username,
      objects: transport._count.objects,
      createdAt: formatedDate,
    };
  });

  return (
    <div className="py-6 space-y-6">
      <Tabs defaultValue="overview" className="space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold tracking-tight">
                {data.school.name}
              </h1>
              {!timeToExpire.isExpired ? (
                <p className="text-sm text-gray-500 mt-1">
                  Dostęp wygaśnie za:{" "}
                  <span className="font-medium text-gray-700">
                    {timeToExpire.daysLeft}
                  </span>
                  {timeToExpire.daysLeft === 1 ? " dzień" : " dni"}
                </p>
              ) : (
                <p className="text-sm text-red-500 mt-1">
                  Dostęp dla szkoły wygasł
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
                  <CardTitle className="text-xs font-medium text-gray-500">
                    Transporty
                  </CardTitle>
                  <Truck size={16} className="text-gray-400" />
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="text-xl font-bold">
                    {data.school._count.transports}
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
                  <CardTitle className="text-xs font-medium text-gray-500">
                    Konta uczniów
                  </CardTitle>
                  <Users size={16} className="text-gray-400" />
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="text-xl font-bold">
                    {data.school._count.students}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="overflow-auto">
            <TabsList>
              <TabsTrigger value="overview">Ogólne</TabsTrigger>
              <TabsTrigger value="users">Użytkownicy</TabsTrigger>
              <TabsTrigger value="transports">Transporty</TabsTrigger>
              <TabsTrigger value="offers">Oferty</TabsTrigger>
            </TabsList>
          </div>
        </div>

          <TabsContent value="overview" className="space-y-4">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Ostatnie transporty</CardTitle>
                <CardDescription>Transporty ostatnio dodane</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentTransports transports={data.latestTransports} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="users">
            <StudentsTable
              columns={columns}
              data={students}
              schoolId={school.id}
            />
            <AddStudentForm schoolId={school.id} />
          </TabsContent>
          <TabsContent value="transports">
            <TransportsTable
              columns={transportColumns}
              transports={transports}
            />
          </TabsContent>
          <TabsContent value="offers">
            <OffersTable
              columns={offerColumns}
              offers={offers as unknown as columnOffer[]}
            />
          </TabsContent>
        </Tabs>
    </div>
  );
}
