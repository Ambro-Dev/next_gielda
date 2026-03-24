import React from "react";
import { Offer } from "@prisma/client";
import { OffersTable } from "./offers-table";
import { Transport } from "./page";
import { axiosInstance } from "@/lib/axios";
import { auth } from "@/auth";
import { FileText } from "lucide-react";

const getTransportOffers = async (transportId: string) => {
  try {
    const response = await axiosInstance.get(
      `/api/transports/transport/offers?transportId=${transportId}`
    );
    const data = response.data;
    return data.offers;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export type OfferWithCreator = Offer & {
  creator: { id: string; username: string };
};

const TransportOffers = async ({
  transport,
}: {
  transport: Transport;
}) => {
  const offers: OfferWithCreator[] = await getTransportOffers(transport.id);
  const session = await auth();

  return (
    <div className="animate-fade-in animate-stagger-4">
      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />

      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 rounded-full bg-brand" />
          <h2 className="text-lg font-semibold tracking-tight">
            Oferty
            {offers.length > 0 && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({offers.length})
              </span>
            )}
          </h2>
        </div>
      </div>

      {/* Content */}
      {offers.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-12 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <FileText className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">Brak ofert</p>
          <p className="text-sm text-muted-foreground max-w-[35ch]">
            Nikt jeszcze nie zlozyl oferty na ten transport.
          </p>
        </div>
      ) : (
        <OffersTable
          data={offers}
          transportId={transport.id}
          user={String(session?.user.id)}
          owner={transport.creator.id}
        />
      )}
    </div>
  );
};

export default TransportOffers;
