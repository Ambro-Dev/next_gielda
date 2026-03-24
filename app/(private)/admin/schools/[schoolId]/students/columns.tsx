"use client";

import { ColumnDef } from "@tanstack/react-table";

import {
  ArrowUpDown,
  MoreHorizontal,
  Copy,
  ShieldOff,
  ShieldCheck,
} from "lucide-react";

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
import { EditUserForm } from "../../../users/edit-user-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ResetPassword } from "../../../users/reset-password";
import { blockUser, unblockUser } from "../../../users/columns";

export type User = {
  id: string;
  username: string;
  name_and_surname: string;
  email: string;
  isBlocked: boolean;
  role: "admin" | "user";
};

export const columns: ColumnDef<User>[] = [
  {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-xs font-medium text-muted-foreground hover:text-foreground -ml-3"
        >
          Nazwa użytkownika
          <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      );
    },
    accessorKey: "username",
    cell: ({ row }) => (
      <span className="font-medium text-foreground">
        {row.getValue("username")}
      </span>
    ),
  },
  {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-xs font-medium text-muted-foreground hover:text-foreground -ml-3"
        >
          Imię i nazwisko
          <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      );
    },
    accessorKey: "name_and_surname",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.getValue("name_and_surname")}
      </span>
    ),
  },
  {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-xs font-medium text-muted-foreground hover:text-foreground -ml-3"
        >
          Email
          <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      );
    },
    accessorKey: "email",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.getValue("email")}
      </span>
    ),
  },
  {
    header: "Status",
    accessorKey: "isBlocked",
    cell: ({ row }) => {
      const isBlocked = row.getValue("isBlocked") as boolean;
      return isBlocked ? (
        <Badge variant="destructive" className="text-[11px] font-medium">
          Zablokowany
        </Badge>
      ) : (
        <Badge variant="success" className="text-[11px] font-medium">
          Aktywny
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <Dialog>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted">
                <span className="sr-only">Otwórz menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                Akcje
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(user.email)}
              >
                <Copy className="mr-2 h-3.5 w-3.5" />
                Kopiuj email
              </DropdownMenuItem>
              <EditUserForm user={user} />
              <DropdownMenuItem
                className={`font-medium ${
                  user.isBlocked ? "text-emerald-600" : "text-destructive"
                }`}
                asChild
              >
                <DialogTrigger className="w-full">
                  {user.isBlocked ? (
                    <>
                      <ShieldCheck className="mr-2 h-3.5 w-3.5" /> Odblokuj
                      użytkownika
                    </>
                  ) : (
                    <>
                      <ShieldOff className="mr-2 h-3.5 w-3.5" /> Zablokuj
                      użytkownika
                    </>
                  )}
                </DialogTrigger>
              </DropdownMenuItem>
              <ResetPassword userId={user.id} />
            </DropdownMenuContent>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Czy chcesz {user.isBlocked ? "odblokować" : "zablokować"}{" "}
                  użytkownika {user.username}?
                </DialogTitle>
              </DialogHeader>
              <div className="flex justify-end gap-2">
                <DialogTrigger asChild>
                  <Button variant="outline">Anuluj</Button>
                </DialogTrigger>
                <DialogTrigger asChild>
                  <Button
                    variant={user.isBlocked ? "default" : "destructive"}
                    onClick={() => {
                      user.isBlocked
                        ? unblockUser(user.id)
                        : blockUser(user.id);
                    }}
                  >
                    {user.isBlocked ? "Odblokuj" : "Zablokuj"}
                  </Button>
                </DialogTrigger>
              </div>
            </DialogContent>
          </Dialog>
        </DropdownMenu>
      );
    },
  },
];
