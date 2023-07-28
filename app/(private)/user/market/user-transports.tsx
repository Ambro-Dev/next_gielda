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
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">Mapa</TableHead>
          <TableHead>Dane zlecenia</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">
              <Map height="200px" width="200px" transport={item} />
            </TableCell>
            <TableCell>
              <div className="flex md:flex-row flex-col justify-between items-center gap-4">
                <div className="flex flex-col itmes-center gap-6">
                  <Badge className="justify-center">{item.category.name}</Badge>
                  <Badge className="justify-center">{item.type.name}</Badge>
                  <Badge className="justify-center">{item.vehicle.name}</Badge>
                </div>
                <div className="flex flex-col gap-4 items-center justify-center">
                  <Badge variant="destructive">
                    Wygaśnie za: {item.timeAvailable} dni
                  </Badge>
                  <div className="px-10">
                    <Directions transport={item} />
                  </div>
                  <span>
                    Data załadunku: {formatDate(item.sendDate)} -{" "}
                    {formatDate(item.receiveDate)}
                  </span>
                </div>
                <div className="flex md:flex-col flex-row gap-2 justify-center">
                  <Button>Edytuj</Button>
                  <Button variant="destructive">Zakończ</Button>
                </div>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
