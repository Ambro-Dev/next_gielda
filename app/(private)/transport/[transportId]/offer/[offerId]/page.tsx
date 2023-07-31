import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { axiosInstance } from "@/lib/axios";
import { Offer } from "@prisma/client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {
  params: {
    offerId: string;
  };
};

type OfferWithCreator = Offer & {
  creator: { id: string; username: string; email: string };
  transport: {
    id: string;
  };
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
  return (
    <Card>
      <CardHeader className="p-5">
        <div className="flex flex-row space-x-4 items-center">
          <Link href={`/transport/${offer.transport.id}`}>
            <Button variant="ghost">
              <ArrowLeft width={36} />
              <span>Powrót</span>
            </Button>
          </Link>
          <CardTitle>Informacje o ofercie</CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
          <Card className="grid space-y-4">
            <CardHeader className="p-3">
              <CardTitle className="text-lg">Informacje kontaktowe</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <Label className="flex-1 space-x-2">
                  <span>Nazwa użytkownika:</span>
                  <span className="font-semibold">
                    {offer.creator.username}
                  </span>
                </Label>
                <Label className="flex-1 space-x-2">
                  <span>Numer telefonu</span>
                  <span className="font-semibold">{offer.contactNumber}</span>
                </Label>
                <Label className="flex-1 space-x-2">
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
                  <Label className="flex-1 space-x-2">
                    <span>Data dodania:</span>
                    <span className="font-semibold">
                      {formatDate(offer.createdAt)}
                    </span>
                  </Label>
                  <Label className="flex-1 space-x-2">
                    <span>Data załadunku:</span>
                    <span className="font-semibold text-amber-500">
                      {formatDate(offer.loadDate)}
                    </span>
                  </Label>
                  <Label className="flex-1 space-x-2">
                    <span>Data rozaładunku:</span>
                    <span className="font-semibold text-amber-500">
                      {formatDate(offer.unloadDate)}
                    </span>
                  </Label>
                  <Label className="flex-1 space-x-2">
                    <span>Termin dostawy:</span>
                    <span className="font-semibold ">
                      w ciągu {offer.unloadTime} dni
                    </span>
                  </Label>
                </div>
                <div className="grid ">
                  <div className="flex flex-col space-y-2">
                    <Label className="flex-1 space-x-2">
                      <span className="text-2xl">{offer.brutto}</span>
                      <span className="font-semibold text-xl">
                        {offer.currency}
                      </span>
                      <span>brutto</span>
                    </Label>
                    <Label className="flex-1 space-x-2">
                      <span className="font-semibold text-lg">
                        {offer.netto}
                      </span>
                      <span className=" text-md">{offer.currency}</span>
                      <span>netto</span>
                    </Label>
                    <Label className="flex-1 space-x-2">
                      <span className="font-semibold text-lg">VAT:</span>
                      <span className="text-md">{offer.vat}%</span>
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default OfferCard;
