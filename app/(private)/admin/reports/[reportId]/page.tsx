import GoBack from "@/components/ui/go-back";
import { axiosInstance } from "@/lib/axios";
import { notFound } from "next/navigation";
import React from "react";

type Props = {
  params: {
    reportId: string;
  };
};

type ReportWithUser = Report & {
  user: {
    id: string;
    name?: string;
    surname?: string;
    student?: {
      name: string;
      surname: string;
    };
    school?: {
      id: string;
      name: string;
    };
  };
};

const getReport = async (reportId: string): Promise<ReportWithUser> => {
  try {
    const response = await axiosInstance.get(
      `/api/report/details?reportId=${reportId}`
    );
    const report = response.data.report;
    return report;
  } catch (error) {
    console.error(error);
    return notFound();
  }
};

const Page = (props: Props) => {
  const { reportId } = props.params;

  if (reportId.length !== 24) return notFound();

  const report = getReport(reportId);

  return (
    <div>
      <GoBack />
      {reportId}
    </div>
  );
};

export default Page;
