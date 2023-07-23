"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React from "react";

import { MoreHorizontal, DeleteIcon, EditIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Vehicle {
  vehicles: {
    id: string;
    name: string;
  }[];
}

export const VehicleCard = ({ vehicles }: Vehicle) => {
  return (
    <Card>
      <CardHeader className="p-5">
        <CardTitle>Pojazdy</CardTitle>
        <CardDescription>Dodaj, usuń lub edytuj pojazdy</CardDescription>
      </CardHeader>
      <CardContent className="pt-5">
        {vehicles?.length > 0 ? (
          <div className="flex flex-col space-y-4">
            {vehicles.map((vehicle) => (
              <React.Fragment key={vehicle.id}>
                <div className="text-sm flex justify-between items-center">
                  {vehicle.name}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Otwórz menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Akcje</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="gap-4">
                        <EditIcon className="w-4 h-4" />
                        <span>Edytuj</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className=" text-red-500 font-bold gap-4">
                        <DeleteIcon className="w-4 h-4" />
                        <span>Usuń</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Separator className="my-2" />
              </React.Fragment>
            ))}
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            <div className="text-sm">Brak pojazdów</div>
            <Separator className="my-2" />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full">Dodaj pojazd</Button>
      </CardFooter>
    </Card>
  );
};
