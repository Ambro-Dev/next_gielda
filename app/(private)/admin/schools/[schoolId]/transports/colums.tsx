"use client";

import { ColumnDef } from "@tanstack/react-table";

import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { axiosInstance } from "@/lib/axios";
import { toast } from "@/components/ui/use-toast";

type Transport = {
  id: string;
  createdAt: Date;
  vehicle: string;
  category: string;
  creator: string;
  type: string;
  objects: number;
};

const handleDelete = async (id: string) => {
  try {
    await axiosInstance
      .put("/api/transports/transport/delete", {
        transportId: id,
      })
      .then((res) => {
        if (res.data.message) {
          toast({
            title: "Sukces",
            description: res.data.message,
          });
        } else {
          toast({
            title: "Błąd",
            variant: "destructive",
            description: res.data.error,
          });
        }
      });
  } catch (error) {
    toast({
      title: "Błąd",
      description: "Nie udało się usunąć transportu, spróbuj ponownie",
    });
  }
};

export const columns: ColumnDef<Transport>[] = [
  {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nazwa użytkownika
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "creator",
  },
  {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Pojazd
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "vehicle",
  },
  {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Kategoria
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "category",
  },
  {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Typ
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "type",
  },
  {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Data dodania
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "createdAt",
  },
  {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ilość przedmiotów
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "objects",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const transport = row.original;

      return (
        <DropdownMenu>
          <Dialog>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Otwórz menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Akcje</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(transport.creator)}
              >
                Kopiuj nazwę użytkownika
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/transport/${transport.id}`}>
                  Przejdż do transportu
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="font-bold text-red-500" asChild>
                <DialogTrigger className="w-full">Usuń transport</DialogTrigger>
              </DropdownMenuItem>
            </DropdownMenuContent>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Czy na pewno chcesz usunąć transport?</DialogTitle>
                <DialogDescription>
                  Akcja ta usunie również wszystkie konwersacje i oferty
                  związane z transportem, a po usunięciu transportu nie będzie
                  można go przywrócić.
                </DialogDescription>
              </DialogHeader>
              <div className="space-x-4">
                <DialogTrigger asChild>
                  <Button variant="ghost">Anuluj</Button>
                </DialogTrigger>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(transport.id)}
                >
                  Usuń transport
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </DropdownMenu>
      );
    },
  },
];
