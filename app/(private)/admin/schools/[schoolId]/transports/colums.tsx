"use client";

import { ColumnDef } from "@tanstack/react-table";

import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { axiosInstance } from "@/lib/axios";
import { toast } from "@/components/ui/use-toast";

export type Transport = {
  id: string;
  description: string;
  createdAt: string;
  vehicle: string;
  category: string;
  creator: string;
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
          Użytkownik
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
          className="hidden md:flex"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Opis
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "description",
    cell: ({ row }) => {
      const desc = row.getValue("description") as string;
      if (!desc) return <span className="hidden md:block text-muted-foreground text-sm">—</span>;
      const truncated = desc.length > 50 ? desc.slice(0, 50) + "…" : desc;
      return (
        <span className="hidden md:block text-sm" title={desc}>
          {truncated}
        </span>
      );
    },
  },
  {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="hidden sm:flex"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Pojazd
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "vehicle",
    cell: ({ row }) => (
      <div className="hidden sm:block">
        <Badge variant="secondary">{row.getValue("vehicle")}</Badge>
      </div>
    ),
  },
  {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="hidden sm:flex"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Kategoria
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "category",
    cell: ({ row }) => (
      <div className="hidden sm:block">
        <Badge variant="outline">{row.getValue("category")}</Badge>
      </div>
    ),
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
          Przedmioty
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "objects",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("objects")}</span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const transport = row.original;

      return (
        <AlertDialog>
          <DropdownMenu>
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
                  Przejdź do transportu
                </Link>
              </DropdownMenuItem>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="font-bold text-red-500">
                  Usuń transport
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Czy na pewno chcesz usunąć transport?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Akcja ta usunie również wszystkie konwersacje i oferty związane z
                transportem, a po usunięciu transportu nie będzie można go
                przywrócić.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Anuluj</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => handleDelete(transport.id)}
              >
                Usuń transport
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    },
  },
];
