import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OfferWithCreator } from "./contact-card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

const formatDate = (date: Date) => {
  const d = new Date(date);
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  return `${day < 10 ? `0${day}` : day}.${
    month < 10 ? `0${month}` : month
  }.${year}`;
};

export function OffersTable({ data }: { data: OfferWithCreator[] }) {
  return (
    <Table>
      <TableCaption>Lista złożonych ofert</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Nazwa użytkownika</TableHead>
          <TableHead>Dane oferty</TableHead>
          <TableHead className="text-right w-[100px]">
            Proponowana cena
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">
              {item.creator.username}
            </TableCell>
            <TableCell>
              <div className="flex flex-col gap-2">
                <span>
                  Data załadunku: {formatDate(item.loadDate)} -{" "}
                  {formatDate(item.unloadDate)}
                </span>
                <span>Termin dostawy: w ciągu {item.unloadTime} dni</span>
              </div>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex flex-col gap-2">
                <span>
                  {item.brutto} {item.currency}
                </span>
                <span className="text-xs text-gray-500">brutto</span>
                <Button>Wyświetl</Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
