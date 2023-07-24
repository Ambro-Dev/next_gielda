import React from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { AddUserForm } from "./add-user-form";
import { DataTable } from "./all-users-table";
import { User, columns } from "./columns";

type Props = {};

async function getUsers(): Promise<User[]> {
  const res = await fetch(`http://localhost:3000/api/auth/users`);
  const json = await res.json();
  return json;
}

async function UsersPage({}: Props) {
  const data = await getUsers();
  console.log(data);
  return (
    <div className="flex flex-col">
      <div className="flex p-5">
        <h3 className="text-3xl font-bold tracking-tight">Użytkownicy</h3>
      </div>
      <DataTable columns={columns} data={data} />
      <div className="w-full px-10 pb-10">
        <AddUserForm />
      </div>
    </div>
  );
}

export default UsersPage;
