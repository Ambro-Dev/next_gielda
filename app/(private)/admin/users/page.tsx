import React from "react";

import { AddUserForm } from "./add-user-form";
import { DataTable } from "./all-users-table";
import { User, columns } from "./columns";
import { axiosInstance } from "@/lib/axios";

async function getUsers(): Promise<User[]> {
  try {
    const res = await axiosInstance.get(`/api/auth/users`);
    const json = res.data;
    return json;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function UsersPage() {
  const data = await getUsers();
  return (
    <div className="py-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Użytkownicy</h1>
        <p className="text-sm text-gray-500 mt-1">Zarządzaj kontami użytkowników.</p>
      </div>
      <DataTable columns={columns} data={data} />
      <div className="w-full pb-6">
        <AddUserForm />
      </div>
    </div>
  );
}

export default UsersPage;
