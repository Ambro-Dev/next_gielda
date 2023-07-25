import React from "react";
import { StudentsTable } from "./students-table";
import { columns } from "./columns";

interface PageProps {
  params: {
    schoolId: string;
  };
}

async function getStudents(schoolId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/schools/students?schoolId=${schoolId}`,
    {
      method: "GET",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const json = await res.json();
  return json;
}

const Students = async (props: PageProps) => {
  const data = await getStudents(props.params.schoolId);
  return (
    <div>
      <StudentsTable columns={columns} data={data} />
    </div>
  );
};

export default Students;
