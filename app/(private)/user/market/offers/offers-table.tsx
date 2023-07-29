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
import Map from "@/components/Map";
import Directions from "@/components/Directions";
import { Card } from "@/components/ui/card";
import { ExtendedOffer } from "./page";

export function OffersTable({ data }: { data: ExtendedOffer[] }) {
  return (
    <Table>
      <TableCaption>Lista ofert</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[150px]">Mapa</TableHead>
          <TableHead>Oferty</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">
              <Map height="150px" width="150px" transport={item.transport} />
            </TableCell>
            <TableCell>
              <div className="w-full flex flex-col items-center justify-center gap-4">
                <Directions transport={item.transport} />
                <Card className="w-full p-3">
                  <div className="w-full flex flex-row gap-8 justify-between items-center">
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-semibold">
                        Oferta od: <span>{item.creator.username}</span>
                      </span>
                      <span className="font-light text-ellipsis overflow-hidden line-clamp-1">
                        Kwota brutto: {item.brutto} {item.currency}
                      </span>
                    </div>
                    <Button>Zobacz</Button>
                  </div>
                </Card>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
