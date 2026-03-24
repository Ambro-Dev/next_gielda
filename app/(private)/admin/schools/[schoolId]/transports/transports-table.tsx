"use client";

import * as React from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/lib/axios";
import { toast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MetricCard } from "../components/MetricCard";
import {
  Truck,
  Package,
  Calendar,
  Search,
  X,
  Trash2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Card, CardContent } from "@/components/ui/card";
import type { Transport } from "./colums";

interface TransportsTableProps {
  columns: ColumnDef<Transport, unknown>[];
  transports: Transport[];
  school?: string;
  stats?: {
    total: number;
    totalObjects: number;
    lastTransportDate: string;
  };
  filterOptions?: {
    categories: string[];
    vehicles: string[];
  };
}

export function TransportsTable({
  columns,
  transports,
  school,
  stats,
  filterOptions,
}: TransportsTableProps) {
  const router = useRouter();

  const handleDeleteAll = async (id: string) => {
    const data = {
      adminId: id,
      schoolId: school,
    };
    try {
      await axiosInstance.put("/api/transports/delete", data).then((res) => {
        if (res.data.message) {
          toast({
            title: "Sukces",
            description: res.data.message,
          });
          router.refresh();
        } else {
          toast({
            title: "Błąd",
            variant: "destructive",
            description: res.data.error,
          });
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const { data: session } = useSession();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data: transports,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  const hasActiveFilters = columnFilters.length > 0;

  return (
    <div className="sm:p-5 p-0 space-y-6">
      {/* Metric Cards */}
      {stats && (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Wszystkie transporty"
          value={stats.total}
          icon={Truck}
          className="animate-stagger-1"
        />
        <MetricCard
          title="Łączna liczba przedmiotów"
          value={stats.totalObjects}
          icon={Package}
          className="animate-stagger-2"
        />
        <MetricCard
          title="Ostatni transport"
          value={stats.lastTransportDate}
          icon={Calendar}
          className="animate-stagger-3"
        />
      </div>
      )}

      {/* Toolbar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative max-w-sm flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Szukaj po użytkowniku..."
                  value={
                    (table
                      .getColumn("creator")
                      ?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table
                      .getColumn("creator")
                      ?.setFilterValue(event.target.value)
                  }
                  className="pl-9"
                />
              </div>
              {filterOptions && filterOptions.categories.length > 0 && (
                <Select
                  value={
                    (table
                      .getColumn("category")
                      ?.getFilterValue() as string) ?? ""
                  }
                  onValueChange={(value) =>
                    table
                      .getColumn("category")
                      ?.setFilterValue(value === "all" ? "" : value)
                  }
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Kategoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Wszystkie kategorie</SelectItem>
                    {filterOptions.categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {filterOptions && filterOptions.vehicles.length > 0 && (
                <Select
                  value={
                    (table
                      .getColumn("vehicle")
                      ?.getFilterValue() as string) ?? ""
                  }
                  onValueChange={(value) =>
                    table
                      .getColumn("vehicle")
                      ?.setFilterValue(value === "all" ? "" : value)
                  }
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Pojazd" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Wszystkie pojazdy</SelectItem>
                    {filterOptions.vehicles.map((v) => (
                      <SelectItem key={v} value={v}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => table.resetColumnFilters()}
                >
                  <X className="mr-1 h-4 w-4" />
                  Resetuj
                </Button>
              )}
              {transports.length > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="mr-1 h-4 w-4" />
                      <span className="hidden sm:inline">
                        Usuń wszystkie
                      </span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Czy na pewno chcesz usunąć wszystkie ogłoszenia?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Ta akcja jest nieodwracalna. Wszystkie transporty,
                        powiązane konwersacje i oferty zostaną trwale usunięte.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Anuluj</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={() =>
                          handleDeleteAll(String(session?.user?.id))
                        }
                      >
                        Usuń wszystkie
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer"
                  onClick={() =>
                    router.push(`/transport/${row.original.id}`)
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-5">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-40 text-center"
                >
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Truck className="h-10 w-10 opacity-40" />
                    <p className="text-sm font-medium">
                      Brak transportów do wyświetlenia
                    </p>
                    <p className="text-xs">
                      Transporty dodane przez uczniów pojawią się tutaj
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length > 0
            ? `Strona ${table.getState().pagination.pageIndex + 1} z ${table.getPageCount()}`
            : "Brak wyników"}
        </p>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Poprzednia
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Następna
          </Button>
        </div>
      </div>
    </div>
  );
}
