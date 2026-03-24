import { axiosInstance } from "@/lib/axios";
import React from "react";
import { TransportsTable } from "./transports-table";
import { columns } from "./colums";

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

type Props = {
  params: Promise<{
    schoolId: string;
  }>;
};

const getSchoolTransports = async (schoolId: string) => {
  try {
    const response = await axiosInstance.get(
      `/api/schools/school/transports?schoolId=${schoolId}`
    );
    const data = response.data;
    return data.transports;
  } catch (error) {
    return [];
  }
};

const SchoolTransports = async (props: Props) => {
  const { schoolId } = await props.params;
  const transportsData: Transport[] =
    (await getSchoolTransports(schoolId)) ?? [];

  const transports = transportsData.map((transport: Transport) => {
    const formatedDate = new Date(transport.createdAt).toLocaleDateString(
      "pl-PL"
    );
    return {
      id: transport.id,
      description: transport.description ?? "",
      vehicle: transport.vehicle.name,
      category: transport.category.name,
      creator: transport.creator.username,
      objects: transport._count.objects,
      createdAt: formatedDate,
    };
  });

  const totalObjects = transportsData.reduce(
    (sum, t) => sum + t._count.objects,
    0
  );

  const lastTransportDate = transportsData.length
    ? new Date(
        Math.max(
          ...transportsData.map((t) => new Date(t.createdAt).getTime())
        )
      ).toLocaleDateString("pl-PL")
    : "—";

  const categories = [
    ...new Set(transportsData.map((t) => t.category.name)),
  ];
  const vehicles = [...new Set(transportsData.map((t) => t.vehicle.name))];

  return (
    <TransportsTable
      columns={columns}
      transports={transports}
      school={schoolId}
      stats={{
        total: transportsData.length,
        totalObjects,
        lastTransportDate,
      }}
      filterOptions={{ categories, vehicles }}
    />
  );
};

export default SchoolTransports;
