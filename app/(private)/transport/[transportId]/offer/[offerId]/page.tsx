import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { axiosInstance } from "@/lib/axios";
import { Offer } from "@prisma/client";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import React from "react";
import EditForm from "./edit-offer";
import GoBack from "../../../../../../components/ui/go-back";
import OfferAccept from "./accept-offer";
import Message from "./message";
import NewMessage from "./new-message";
import { redirect } from "next/navigation";
import { off } from "process";
import Messages from "./messages";

type Props = {
  params: {
    offerId: string;
    transportId: string;
  };
};

export type OfferWithCreator = Offer & {
  creator: { id: string; username: string; email: string };
  transport: {
    id: string;
  };
  messages: {
    id: string;
    text: string;
    createdAt: Date;
    sender: {
      id: string;
      username: string;
      email: string;
    };
    receiver: {
      id: string;
      username: string;
      email: string;
    };
  }[];
};

export type Transport = {
  id: string;
  category: { id: string; name: string };
  creator: { id: string; username: string };
  createdAt: Date;
  vehicle: { id: string; name: string };
  description: string;
  isAvailable: boolean;
  isAccepted: boolean;
  directions: {
    start: { lat: number; lng: number };
    finish: { lat: number; lng: number };
  };
  objects: [
    {
      id: string;
      name: string;
      amount: number;
      description: string;
      height: number;
      width: number;
      length: number;
      weight: number;
    }
  ];

  sendTime: string;
  receiveTime: string;
  sendDate: Date;
  receiveDate: Date;
};

const getTransport = async (transportId: string): Promise<Transport> => {
  try {
    const response = await axiosInstance.get(
      `/api/transports/transport?transportId=${transportId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return {} as Transport;
  }
};

const getOffer = async (offerId: string): Promise<OfferWithCreator> => {
  try {
    const response = await axiosInstance.get(
      `/api/offers/offer?offerId=${offerId}`
    );
    return response.data.offer;
  } catch (error) {
    console.error(error);
    return {} as OfferWithCreator;
  }
};

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("pl-PL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const OfferCard = async (props: Props) => {
  const offer: OfferWithCreator = await getOffer(props.params.offerId);
  const transport: Transport = await getTransport(props.params.transportId);
  const session = await getServerSession(authOptions);
  const receiver =
    offer.creator.id === session?.user?.id
      ? transport.creator.id
      : offer.creator.id;

  if (
    offer.creator.id !== session?.user?.id &&
    transport.creator.id !== session?.user?.id
  ) {
    redirect(`/transport/${transport.id}`);
  }
  return (
    <Card className="mb-5">
      <CardHeader className="sm:p-5 pb-5 sm:flex sm:flex-row sm:justify-between grid grid-cols-2 gap-2">
        <div className="flex flex-wrap items-center col-span-2">
          <GoBack />
          <CardTitle className="sm:text-2xl text-xl">
            Informacje o ofercie
          </CardTitle>
        </div>

        {!transport.isAccepted ? (
          <>
            {offer.creator.id === session?.user?.id && (
              <div className="flex flex-row gap-4 items-center">
                <EditForm transport={transport} offer={offer} />
                <Button variant="destructive">Usuń</Button>
              </div>
            )}
          </>
        ) : (
          <>
            {offer.isAccepted ? (
              <div className="flex flex-wrap col-span-2 justify-end items-center gap-4">
                <CheckCircle color="green" size={40} />
                <CardDescription className="text-green-600">
                  Oferta zaakceptowana
                </CardDescription>
              </div>
            ) : (
              <div className="flex flex-wrap col-span-2 justify-end items-center gap-4">
                <ArrowLeft size={40} color="red" />
                <CardDescription className="text-red-600">
                  Zaakceptowano inną ofertę
                </CardDescription>
              </div>
            )}
          </>
        )}
      </CardHeader>

      <CardContent className="flex flex-col gap-4 sm:p-5 p-2">
        <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
          <Card className="grid space-y-4">
            <CardHeader className="p-3">
              <CardTitle className="text-lg">Informacje kontaktowe</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <Label className="flex flex-wrap gap-2">
                  <span>Nazwa użytkownika:</span>
                  <span className="font-semibold">
                    {offer.creator.username}
                  </span>
                </Label>
                <Label className="flex flex-wrap gap-2">
                  <span>Numer telefonu:</span>
                  <span className="font-semibold">{offer.contactNumber}</span>
                </Label>
                <Label className="flex flex-wrap gap-2">
                  <span>Email:</span>
                  <span className="font-semibold">{offer.creator.email}</span>
                </Label>
              </div>
            </CardContent>
          </Card>
          <Card className="grid md:col-span-2 space-y-4">
            <CardHeader className="p-3">
              <CardTitle className="text-lg">Szczegóły oferty</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                <div className="grid space-y-4">
                  <Label className="flex flex-wrap gap-2">
                    <span>Data dodania:</span>
                    <span className="font-semibold">
                      {formatDate(offer.createdAt)}
                    </span>
                  </Label>
                  <Label className="flex flex-wrap gap-2">
                    <span>Data załadunku:</span>
                    <span className="font-semibold text-amber-500">
                      {formatDate(offer.loadDate)}
                    </span>
                  </Label>
                  <Label className="flex flex-wrap gap-2">
                    <span>Data rozaładunku:</span>
                    <span className="font-semibold text-amber-500">
                      {formatDate(offer.unloadDate)}
                    </span>
                  </Label>
                  <Label className="flex flex-wrap gap-2">
                    <span>Termin dostawy:</span>
                    <span className="font-semibold ">
                      w ciągu {offer.unloadTime} dni
                    </span>
                  </Label>
                </div>
                <div className="grid ">
                  <div className="flex flex-col space-y-2">
                    <Label className="flex flex-wrap gap-2">
                      <span className="text-2xl">{offer.brutto}</span>
                      <span className="font-semibold text-xl">
                        {offer.currency}
                      </span>
                      <span>brutto</span>
                    </Label>
                    <Label className="flex flex-wrap gap-2">
                      <span className="font-semibold text-lg">
                        {offer.netto}
                      </span>
                      <span className=" text-md">{offer.currency}</span>
                      <span>netto</span>
                    </Label>
                    <Label className="flex flex-wrap gap-2">
                      <span className="font-semibold text-lg">VAT:</span>
                      <span className="text-md">{offer.vat}%</span>
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {transport.creator.id === session?.user?.id && !offer.isAccepted && (
          <CardFooter className="justify-end">
            <OfferAccept offer={offer} transport={transport} />
          </CardFooter>
        )}
        <Card>
          <CardHeader className="p-3">
            <CardTitle className="text-lg">Wiadomości</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:p-4 p-2">
            <Messages messages={offer.messages} />
            <NewMessage offerId={offer.id} receiverId={receiver} />
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default OfferCard;
