import React from "react";

import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { Delete, Edit, Hash } from "lucide-react";

import admin from "@/assets/icons/administrator.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type Props = {
  administrator: {
    id: string;
    email: string;
    username: string;
    createdAt: Date;
  };
};

const SchoolAdminCard = (props: Props) => {
  const administrator = props.administrator;
  return (
    <Card className="shadow-md">
      <CardContent className="p-5">
        <div className="flex flex-col items-center">
          <Image src={admin} width={48} height={48} alt="admin-image" />
          <p className="text-2xl font-semibold">{administrator?.username}</p>
          <p className="text-sm">{administrator?.email}</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button className="w-full" variant="outline">
          <Edit size={16} className="mr-2" /> Edytuj dane
        </Button>
        <Button className="w-full">
          <Hash size={16} className="mr-2" />
          Zmień hasło
        </Button>
        <Button className="w-full" variant="destructive">
          <Delete size={16} className="mr-2" /> Usuń administratora
        </Button>
        <p className="text-sm text-right">
          Administrator od{" "}
          <span className="font-semibold">
            {new Date(administrator?.createdAt).toLocaleDateString()}
          </span>
        </p>
      </CardFooter>
    </Card>
  );
};

export default SchoolAdminCard;
