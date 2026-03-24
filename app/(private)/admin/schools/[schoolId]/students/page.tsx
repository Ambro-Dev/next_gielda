import React from "react";
import { StudentsTable } from "./students-table";
import { columns } from "./columns";
import { axiosInstance } from "@/lib/axios";
import { AddStudentForm } from "./add-student-form";
import ImportStudents from "./ImportStudents";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, UserCheck, ShieldOff } from "lucide-react";
import { User } from "./columns";

interface PageProps {
  params: Promise<{
    schoolId: string;
  }>;
}

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

const Students = async (props: PageProps) => {
  const { schoolId } = await props.params;
  const data: User[] = await getStudents(schoolId);

  const totalCount = data.length;
  const activeCount = data.filter((s) => !s.isBlocked).length;
  const blockedCount = data.filter((s) => s.isBlocked).length;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Uczniowie
        </h1>
        <p className="text-sm text-muted-foreground">
          Zarządzaj kontami uczniów przypisanych do szkoły.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-semibold tracking-tight tabular-nums">
                {totalCount}
              </p>
              <p className="text-xs text-muted-foreground">
                Wszystkich uczniów
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <UserCheck className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold tracking-tight tabular-nums">
                {activeCount}
              </p>
              <p className="text-xs text-muted-foreground">Aktywnych</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <ShieldOff className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-semibold tracking-tight tabular-nums">
                {blockedCount}
              </p>
              <p className="text-xs text-muted-foreground">Zablokowanych</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-lg">Lista uczniów</CardTitle>
            <CardDescription>
              {totalCount > 0
                ? `Wyświetlanie ${totalCount} uczniów`
                : "Nie dodano jeszcze żadnych uczniów"}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <ImportStudents schoolId={schoolId} />
            <AddStudentForm schoolId={schoolId} />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <StudentsTable columns={columns} data={data} schoolId={schoolId} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Students;
