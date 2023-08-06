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
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ExtendedTransport } from "./page";
import Map from "@/components/Map";
import Directions from "@/components/Directions";
import { Badge } from "@/components/ui/badge";
import { GetExpireTimeLeft } from "@/app/lib/getExpireTimeLeft";
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

export function UserTransports({ data }: { data: ExtendedTransport[] }) {
  return (
    <Table>
      <TableCaption>Lista zleconych transportów</TableCaption>
      <TableBody>
        {data?.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              <div className="flex md:flex-row flex-col md:justify-between items-center gap-4">
                <div>
                  <Map
                    transport={item}
                    className="flex md:w-[200px] w-[300px] h-[200px]"
                  />
                </div>

                <div className="flex md:flex-col flex-row itmes-center md:gap-6 gap-3">
                  <Badge className="justify-center">{item.category.name}</Badge>
                  <Badge className="justify-center">{item.type.name}</Badge>
                  <Badge className="justify-center">{item.vehicle.name}</Badge>
                </div>
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-center">
                  <div className="flex flex-col md:gap-4 items-center justify-center">
                    <Badge variant="destructive">
                      Wygaśnie za:{" "}
                      {GetExpireTimeLeft(item.availableDate).daysLeft > 0
                        ? `${
                            GetExpireTimeLeft(item.availableDate).daysLeft
                          } dni`
                        : `${
                            GetExpireTimeLeft(item.availableDate).hoursLeft
                          } godzin`}{" "}
                    </Badge>
                    <div className="md:px-10 px-5">
                      <Directions transport={item} />
                    </div>
                    <span className="pt-4 md:pt-0">
                      Data załadunku: {formatDate(item.sendDate)} -{" "}
                      {formatDate(item.receiveDate)}
                    </span>
                  </div>

                  <div className="flex lg:flex-col flex-row gap-2 justify-center">
                    <Link href={`/transport/${item.id}/edit`}>
                      <Button className="w-full">Edytuj</Button>
                    </Link>
                    <Button variant="destructive">Zakończ</Button>
                  </div>
                </div>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
