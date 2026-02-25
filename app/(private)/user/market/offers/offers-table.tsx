"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Directions from "@/components/Directions";
import { ExtendedOffer } from "./page";
import Link from "next/link";
import { useMessages } from "@/app/context/message-provider";
import { Package } from "lucide-react";

export function OffersTable({
  data,
  title,
}: {
  data: ExtendedOffer[];
  title: string;
}) {
  const { offers, offerMessages } = useMessages();

  const hasNotification = (itemId: string) =>
    offers?.find((offer) => offer.id === itemId) ||
    offerMessages?.find((message) => message.offer?.id === itemId);

  if (!data?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <Package className="w-10 h-10 mb-3" />
        <p className="text-sm">Brak ofert</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div
          key={item.id}
          className="border border-gray-200 rounded-lg shadow-sm p-4 hover:bg-gray-50/50 transition-colors"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="space-y-2 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Directions transport={item.transport} />
                {hasNotification(item.id) && (
                  <Badge variant="destructive" className="text-xs">
                    Nowa
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
                <span>
                  Od:{" "}
                  <span className="font-medium">{item.creator.username}</span>
                </span>
                <span>
                  Kwota:{" "}
                  <span className="font-medium">
                    {item.brutto} {item.currency}
                  </span>
                  <span className="text-xs text-gray-400 ml-1">brutto</span>
                </span>
              </div>
            </div>

            <Link
              href={`/transport/${item.transport.id}/offer/${item.id}`}
              className="shrink-0"
            >
              <Button variant="outline" size="sm">
                Zobacz
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
