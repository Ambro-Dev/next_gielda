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
import Link from "next/link";

const formatDate = (date: Date) => {
  const d = new Date(date);
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  return `${day < 10 ? `0${day}` : day}.${
    month < 10 ? `0${month}` : month
  }.${year}`;
};

type Props = {
  transportId: string;
  data: OfferWithCreator[];
  user: string;
  owner: string;
};

export function OffersTable({ transportId, data, user, owner }: Props) {
  return (
    <div className="overflow-x-auto">
    <Table>
      <TableCaption>Lista złożonych ofert</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Nazwa użytkownika</TableHead>
          <TableHead>Dane oferty</TableHead>
          <TableHead className="text-right">Proponowana cena</TableHead>
          <TableHead className="w-[80px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">
              {item.creator.username}
            </TableCell>
            <TableCell>
              {owner === user || item.creator.id === user ? (
                <div className="flex flex-col gap-1 text-sm">
                  <span>
                    Załadunek: {formatDate(item.loadDate)} -{" "}
                    {formatDate(item.unloadDate)}
                  </span>
                  <span className="text-gray-500">
                    Dostawa: w ciągu {item.unloadTime} dni
                  </span>
                </div>
              ) : (
                <span className="text-gray-400">...</span>
              )}
            </TableCell>
            <TableCell className="text-right">
              {owner === user || item.creator.id === user ? (
                <div>
                  <span className="font-medium">
                    {item.brutto} {item.currency}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">brutto</span>
                </div>
              ) : (
                <span className="text-gray-400">...</span>
              )}
            </TableCell>
            <TableCell>
              {(owner === user || item.creator.id === user) && (
                <Link href={`/transport/${transportId}/offer/${item.id}`}>
                  <Button variant="outline" size="sm">
                    Wyświetl
                  </Button>
                </Link>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </div>
  );
}
