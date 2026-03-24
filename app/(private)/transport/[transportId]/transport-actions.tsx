import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { GetExpireTimeLeft } from "@/app/lib/getExpireTimeLeft";
import { Transport } from "./page";
import { auth } from "@/auth";
import MessageForm from "./message-form";
import OfferForm from "./offer-form";
import Link from "next/link";
import { MessageSquare, Send } from "lucide-react";

function ExpiryProgressBar({ daysLeft, hoursLeft }: { daysLeft: number; hoursLeft: number }) {
  const totalHours = daysLeft * 24 + hoursLeft;
  // Assume max 14 days (336h) as "full"
  const maxHours = 336;
  const percentage = Math.min(Math.max((totalHours / maxHours) * 100, 2), 100);
  const isUrgent = totalHours <= 24;

  return (
    <div className="h-1.5 rounded-full bg-muted overflow-hidden mt-2">
      <div
        className={`h-full rounded-full transition-all duration-500 ${isUrgent ? "bg-destructive" : "bg-brand"}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

const TransportActions = async ({
  transport,
}: {
  transport: Transport;
}) => {
  const session = await auth();
  const isOwner = session?.user.id === transport.creator.id;
  const { daysLeft, hoursLeft } = GetExpireTimeLeft(transport.sendDate);
  const isExpired = daysLeft <= 0 && hoursLeft <= 0;

  return (
    <div className="p-1.5 bg-gradient-to-b from-brand/8 to-navy/5 rounded-2xl animate-fade-in animate-stagger-2">
      <Card className="border-t-2 border-t-brand">
        <CardContent className="p-5 space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            {transport.isAccepted ? (
              <Badge variant="success" className="px-3 py-1">Zaakceptowano</Badge>
            ) : transport.isAvailable ? (
              <Badge variant="success" className="px-3 py-1">Dostepne</Badge>
            ) : (
              <Badge variant="destructive" className="px-3 py-1">Niedostepne</Badge>
            )}
          </div>

          {/* Expiry with progress bar */}
          {!transport.isAccepted && transport.isAvailable && (
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Wygasa</span>
                {isExpired ? (
                  <span className="text-sm font-semibold text-destructive">Wygaslo</span>
                ) : (
                  <span className="text-sm font-semibold text-destructive">
                    {daysLeft > 0 ? `za ${daysLeft} dni` : `za ${hoursLeft} godz.`}
                  </span>
                )}
              </div>
              {!isExpired && (
                <ExpiryProgressBar daysLeft={daysLeft} hoursLeft={hoursLeft} />
              )}
            </div>
          )}

          {/* CTA buttons for non-owners */}
          {!isOwner && (
            <>
              <Separator />
              {transport.isAvailable ? (
                <p className="text-xs text-muted-foreground">
                  Oferty mozna skladac do zakonczenia ogloszenia.
                </p>
              ) : (
                <p className="text-xs text-destructive">
                  Oferty nie sa juz przyjmowane. Mozesz wyslac wiadomosc do zleceniodawcy.
                </p>
              )}
              <div className="space-y-2.5 group/cta">
                {session?.user ? (
                  <MessageForm
                    transportId={transport.id}
                    transportOwnerId={transport.creator.id}
                    triggerClassName="w-full"
                    triggerVariant="brand"
                    triggerSize="lg"
                  />
                ) : (
                  <Link href="/signin" className="block">
                    <Button variant="brand" className="w-full" size="lg">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Napisz wiadomosc
                    </Button>
                  </Link>
                )}
                {session?.user ? (
                  <OfferForm
                    transport={transport}
                    triggerClassName="w-full"
                    triggerVariant="dark"
                    triggerSize="lg"
                  />
                ) : (
                  <Link href="/signin" className="block">
                    <Button
                      variant="dark"
                      className="w-full group"
                      size="lg"
                      disabled={!transport.isAvailable}
                    >
                      <Send className="w-4 h-4 mr-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      Zloz oferte
                    </Button>
                  </Link>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransportActions;
