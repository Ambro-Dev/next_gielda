"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { axiosInstance } from "@/lib/axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { Transport } from "./page";
import {
  Calendar,
  User,
  Pencil,
  Trash2,
  Navigation,
  Clock,
} from "lucide-react";

const formatDate = (date: Date) => {
  const newDate = new Date(date);
  return newDate.toLocaleDateString("pl-PL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const setTransportUnavailable = async (transportId: string, userId: string) => {
  try {
    const response = await axiosInstance.put(
      `/api/transports/transport/unavailable`,
      {
        transportId,
        userId,
      }
    );
    const data = response.data;
    if (data.message) {
      toast({
        title: "Sukces",
        description: data.message,
      });
    } else {
      toast({
        title: "Blad",
        description: data.error,
      });
    }
  } catch (error) {
    console.error(error);
    toast({
      title: "Blad",
      description:
        "Wystapil blad podczas wykonywania tej operacji, sprobuj ponownie pozniej.",
    });
  }
};

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  try {
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?types=address,place&language=pl&access_token=${MAPBOX_TOKEN}`
    );
    const data = await res.json();
    return data.features?.[0]?.place_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
};

const TransportDetails = ({ transport }: { transport: Transport }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [startAddr, setStartAddr] = useState(transport.start_address || "");
  const [endAddr, setEndAddr] = useState(transport.end_address || "");
  const router = useRouter();

  const { data } = useSession();
  const isOwner = data?.user.id === transport.creator.id;

  useEffect(() => {
    if (!transport.start_address) {
      reverseGeocode(
        transport.directions.start.lat,
        transport.directions.start.lng
      ).then(setStartAddr);
    }
    if (!transport.end_address) {
      reverseGeocode(
        transport.directions.finish.lat,
        transport.directions.finish.lng
      ).then(setEndAddr);
    }
  }, [transport]);

  return (
    <div className="space-y-10">
      {/* Header + Description */}
      <div className="animate-fade-in animate-stagger-1">
        {/* Title with inline vehicle badge */}
        <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tighter text-foreground">
          {startAddr ? startAddr.split(",")[0] : "..."}
          <span className="text-brand mx-2">&rarr;</span>
          {endAddr ? endAddr.split(",")[0] : "..."}
          <Badge variant="secondary" className="ml-3 align-middle text-xs font-medium capitalize">
            {transport.vehicle.name}
          </Badge>
        </h1>

        {/* Meta — separated */}
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            <span className="font-medium">{transport.creator.username}</span>
          </div>
          <span className="text-border">|</span>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(transport.createdAt)}</span>
          </div>
        </div>

        {/* Description — editorial pull-quote */}
        {transport.description && (
          <p className="mt-5 text-base text-muted-foreground leading-relaxed max-w-[65ch] border-l-2 border-brand/30 pl-4">
            {transport.description}
          </p>
        )}
      </div>

      {/* Route Timeline */}
      <div className="animate-fade-in animate-stagger-2">
        <h2 className="text-lg font-semibold tracking-tight mb-5">Trasa</h2>
        <div className="relative pl-10">
          {/* Timeline line */}
          <div className="absolute left-[13px] top-3 bottom-3 w-1 rounded-full bg-gradient-to-b from-brand to-navy" />

          {/* Start point */}
          <div className="relative pb-10 group/point">
            <div className="absolute left-[-27px] top-1 w-7 h-7 rounded-full border-2 border-brand bg-background flex items-center justify-center ring-4 ring-brand/10 z-10">
              <div className="w-2.5 h-2.5 rounded-full bg-brand" />
            </div>
            <div className="text-xs font-medium text-brand uppercase tracking-wider mb-1">
              Wysylka
            </div>
            <div className="text-base font-semibold group-hover/point:text-brand transition-colors">
              {startAddr || "Ladowanie..."}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(transport.sendDate)}</span>
            </div>
            {transport.sendTime && (
              <div className="text-xs text-muted-foreground mt-0.5">
                Godzina: {transport.sendTime}
              </div>
            )}
          </div>

          {/* Transit stats between points */}
          {(transport.distance?.text || transport.duration?.text) && (
            <div className="relative pb-10 flex items-center gap-2 -ml-10 pl-10">
              <div className="flex items-center gap-2">
                {transport.distance?.text && (
                  <Badge variant="secondary" className="text-xs gap-1 font-normal">
                    <Navigation className="w-3 h-3" />
                    {transport.distance.text}
                  </Badge>
                )}
                {transport.duration?.text && (
                  <Badge variant="secondary" className="text-xs gap-1 font-normal">
                    <Clock className="w-3 h-3" />
                    {transport.duration.text}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* End point */}
          <div className="relative group/point">
            <div className="absolute left-[-27px] top-1 w-7 h-7 rounded-full border-2 border-navy bg-background flex items-center justify-center ring-4 ring-navy/10 z-10">
              <div className="w-2.5 h-2.5 rounded-full bg-navy" />
            </div>
            <div className="text-xs font-medium text-navy uppercase tracking-wider mb-1">
              Dostawa
            </div>
            <div className="text-base font-semibold group-hover/point:text-navy transition-colors">
              {endAddr || "Ladowanie..."}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(transport.receiveDate)}</span>
            </div>
            {transport.receiveTime && (
              <div className="text-xs text-muted-foreground mt-0.5">
                Godzina: {transport.receiveTime}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Owner actions */}
      {isOwner && (
        <Card className="animate-fade-in animate-stagger-3">
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider font-medium">
              Zarzadzanie
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                size="sm"
                onClick={() => router.push(`/transport/${transport.id}/edit`)}
                disabled={transport.isAccepted}
              >
                <Pencil className="w-3.5 h-3.5 mr-1.5" />
                Edytuj
              </Button>
              {transport.isAvailable && (
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                          <Button variant="destructive" className="flex-1" size="sm">
                            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                            Usun
                          </Button>
                        </DialogTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Oznacza ogloszenie jako nieaktywne, znajdziesz je
                          pozniej w zakladce zakonczone zlecenia
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Czy na pewno chcesz usunac ogloszenie?
                      </DialogTitle>
                    </DialogHeader>
                    <div className="flex gap-3 pt-4">
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() =>
                          setTransportUnavailable(
                            transport.id,
                            String(data?.user.id)
                          ).then(() => {
                            setDialogOpen(false);
                            router.refresh();
                          })
                        }
                      >
                        Tak
                      </Button>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="flex-1">
                          Nie
                        </Button>
                      </DialogTrigger>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TransportDetails;
