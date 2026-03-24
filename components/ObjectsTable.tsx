"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PackageOpen, Trash2 } from "lucide-react";

type Props = {
  data:
    | {
        id: string;
        name: string;
        amount: number;
        weight: number;
        width: number;
        length: number;
        height: number;
      }[]
    | null;
  edit?: boolean;
  handleDelete?: (id: string) => void;
};

export function ObjectsTable({ data, edit, handleDelete }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <PackageOpen className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">Brak przedmiotów</p>
        <p className="text-sm text-muted-foreground mt-1 max-w-[30ch]">
          {edit
            ? "Dodaj przedmioty, ktore maja zostac przetransportowane."
            : "Brak dodanych przedmiotow do tego transportu."}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-[100px]">Nazwa</TableHead>
            <TableHead>Ilość</TableHead>
            <TableHead>Waga</TableHead>
            <TableHead className="text-right">Wymiary</TableHead>
            {edit && <TableHead className="w-[80px] text-right"></TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id} className="group">
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell className="tabular-nums">{item.amount}</TableCell>
              <TableCell className="tabular-nums">{item.weight} kg</TableCell>
              <TableCell className="text-right tabular-nums">
                {item.width}m x {item.length}m x {item.height}m
              </TableCell>
              {edit && (
                <TableCell className="text-right">
                  {handleDelete && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
