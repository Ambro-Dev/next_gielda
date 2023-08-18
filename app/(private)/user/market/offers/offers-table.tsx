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
import Link from "next/link";

export function OffersTable({ data }: { data: ExtendedOffer[] }) {
  return (
    <Table>
      <TableCaption>Lista ofert dla aktywnych zleceń</TableCaption>
      <TableBody>
        {data?.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              <div className="flex md:flex-row flex-col md:justify-between items-center gap-4 md:px-0 px-5">
                <div>
                  <Map
                    transport={item.transport}
                    className="flex md:w-[200px] w-[300px] h-[200px]"
                  />
                </div>
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
                      <Link
                        href={`/transport/${item.transport.id}/offer/${item.id}`}
                      >
                        <Button>Zobacz</Button>
                      </Link>
                    </div>
                  </Card>
                </div>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
