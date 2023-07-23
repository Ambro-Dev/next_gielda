"use client";

import { AddTransportForm } from "@/app/(private)/transport/add/AddTransportForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const AddTransportPage = () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/signin");
    },
  });

  if (!session?.user) return null;

  return (
    <div className="flex w-full h-full pt-5 pb-10">
      <Card className="w-full h-full pt-5">
        <CardContent>
          <AddTransportForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default AddTransportPage;
