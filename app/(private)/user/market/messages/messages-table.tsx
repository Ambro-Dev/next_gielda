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

export function MessagesTable({ data }: { data: ExtendedConversation[] }) {
  return (
    <Table>
      <TableCaption>Lista wiadomości</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[150px]">Mapa</TableHead>
          <TableHead>Wiadomości</TableHead>
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
                        Ostatnia wiadomość:{" "}
                        <span>({item.messages[0].sender.username})</span>
                      </span>
                      <span className="font-light text-ellipsis overflow-hidden line-clamp-1">
                        {item.messages[item.messages.length - 1].text} asdasd as
                        das asd asdf asd fas fa asdf asdf asdf asdf asdf asdf
                      </span>
                    </div>
                    <Button>Odpowiedz</Button>
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
