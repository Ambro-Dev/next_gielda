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
import { ExtendedConversation } from "./page";
import Directions from "@/components/Directions";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export function MessagesTable({ data }: { data: ExtendedConversation[] }) {
  return (
    <Table>
      <TableCaption>Lista wiadomości</TableCaption>
      <TableBody>
        {data?.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              <div className="flex md:flex-row flex-col gap-4 md:justify-between items-center md:px-0 px-5">
                <div>
                  <Map
                    transport={item.transport}
                    className="flex w-[300px] h-[200px] md:w-[200px]"
                  />
                </div>
                <div className="w-full flex flex-col items-center justify-center gap-4">
                  <Directions transport={item.transport} />
                  <Card className="w-full p-3">
                    <div className="w-full flex flex-row gap-8 h-full justify-between items-end">
                      <div className="flex flex-col gap-2">
                        <span className="text-sm font-semibold">
                          Ostatnia wiadomość:{" "}
                          <span>({item.messages[0].sender.username})</span>
                        </span>
                        <span className="font-light text-ellipsis overflow-hidden md:line-clamp-1 line-clamp-3">
                          {item.messages[item.messages.length - 1].text}
                        </span>
                      </div>
                      <Link href={`/user/market/messages/${item.id}`}>
                        <Button>Odpowiedz</Button>
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
