import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import React from "react";
import MessageForm from "./message-form";
import OfferForm from "./offer-form";

type Props = {};

const TransportContactCard = (props: Props) => {
  return (
    <Card className="p-3">
      <CardHeader className="space-y-4">
        <CardTitle>
          <div className="flex sm:flex-row flex-col w-full items-end space-y-4">
            <div className="flex flex-col w-full h-full justify-end">
              <span>Oferty</span>
              <Separator className="h-[3px] mt-3 bg-amber-500 w-1/5" />
            </div>
            <div className="flex flex-row w-full sm:justify-end gap-8">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="rounded-full hover:bg-amber-500 transition-all duration-500"
                    size="lg"
                  >
                    Napisz wiadomość
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <MessageForm />
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="rounded-full hover:bg-amber-500 transition-all duration-500"
                    size="lg"
                  >
                    Złóż ofertę
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <OfferForm />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardTitle>
        <CardDescription className="sm:text-end">
          Oferty można składać od pojawienia się ogłoszenia do zakończenia
          ogłoszenia.
        </CardDescription>
        <Separator />
      </CardHeader>
    </Card>
  );
};

export default TransportContactCard;
