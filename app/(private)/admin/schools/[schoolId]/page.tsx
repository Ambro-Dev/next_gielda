import { axiosInstance } from "@/lib/axios";
import { GetExpireTimeLeft } from "@/app/lib/getExpireTimeLeft";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { SchoolPageClient } from "./components/SchoolPageClient";

interface PageProps {
  params: Promise<{
    schoolId: string;
  }>;
}

type SchoolWithTransports = {
  school: {
    id: string;
    name: string;
    createdAt: Date;
    isActive: boolean;
    _count: {
      transports: number;
      students: number;
    };
    administrators: {
      id: string;
      username: string;
      email: string;
      name: string;
      surname: string;
    }[];
    accessExpires: Date;
  };
  latestTransports: {
    id: string;
    description: string;
    createdAt: Date;
    vehicle: { id: string; name: string };
    category: { id: string; name: string };
    creator: { id: string; username: string };
    _count: { objects: number };
  }[];
  offersCount: number;
};

const getSchool = async (schoolId: string): Promise<SchoolWithTransports> => {
  try {
    const res = await axiosInstance.get(
      `/api/schools/manage?schoolId=${schoolId}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
    notFound();
  }
};

export default async function SchoolPage({ params: paramsPromise }: PageProps) {
  const { schoolId } = await paramsPromise;
  const data = await getSchool(schoolId);

  const timeToExpire = GetExpireTimeLeft(data.school.accessExpires);

  return (
    <div className="space-y-6 p-8 pt-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold tracking-tight">
              {data.school.name}
            </h2>
            <Badge variant={data.school.isActive ? "success" : "destructive"}>
              {data.school.isActive ? "Aktywna" : "Nieaktywna"}
            </Badge>
          </div>
          {!timeToExpire.isExpired ? (
            <p className="text-sm text-muted-foreground">
              Dostęp wygaśnie za{" "}
              <span className="font-semibold text-foreground">
                {timeToExpire.daysLeft}
              </span>
              {timeToExpire.daysLeft === 1 ? " dzień" : " dni"}
            </p>
          ) : (
            <p className="text-sm font-medium text-red-500">
              Dostęp dla szkoły wygasł
            </p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <SchoolPageClient data={data} />
    </div>
  );
}
