import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Delete } from "lucide-react";

type Props = {
  data:
    | {
        name: string;
        amount: number;
        weight: number;
        width: number;
        length: number;
        height: number;
      }[]
    | null;
};

export function ObjectsTable({ data }: Props) {
  return (
    <Table>
      <TableCaption>Lista dodanych przedmiotów</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Nazwa</TableHead>
          <TableHead>Ilość</TableHead>
          <TableHead>Waga</TableHead>
          <TableHead className="text-right">Wymiary</TableHead>
          <TableHead className="w-[80px] text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((item) => (
          <TableRow key={item.name}>
            <TableCell className="font-medium">{item.name}</TableCell>
            <TableCell>{item.amount}</TableCell>
            <TableCell>{item.weight}kg</TableCell>
            <TableCell className="text-right">
              {item.width}m x {item.length}m x {item.height}m
            </TableCell>
            <TableCell className="text-right">
              <Button size="icon" variant="ghost">
                <Delete color="#FF0000" size={20} />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
