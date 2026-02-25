"use client";
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ObjectsTable } from "@/components/ObjectsTable";
import { GetExpireTimeLeft } from "@/app/lib/getExpireTimeLeft";
import { Button } from "@/components/ui/button";
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
  Clock,
  Navigation,
  Truck,
  User,
  ArrowDown,
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
        title: "Błąd",
        description: data.error,
      });
    }
  } catch (error) {
    console.error(error);
    toast({
      title: "Błąd",
      description:
        "Wystąpił błąd podczas wykonywania tej operacji, spróbuj ponownie później.",
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
    <div className="space-y-6">
      {/* Status bar */}
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="secondary">{transport.category.name}</Badge>
        {transport.isAccepted ? (
          <Badge className="bg-green-700 hover:bg-green-700">
            Zaakceptowano
          </Badge>
        ) : GetExpireTimeLeft(transport.sendDate).hoursLeft > 0 &&
          transport.isAvailable ? (
          <Badge variant="destructive">
            Wygaśnie za:{" "}
            {GetExpireTimeLeft(transport.sendDate).daysLeft > 0
              ? `${GetExpireTimeLeft(transport.sendDate).daysLeft} dni`
              : `${GetExpireTimeLeft(transport.sendDate).hoursLeft} godz.`}
          </Badge>
        ) : (
          <Badge variant="destructive">Wygasło</Badge>
        )}

        {/* Owner actions */}
        {data?.user.id === transport.creator.id && (
          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/transport/${transport.id}/edit`)}
              disabled={transport.isAccepted}
            >
              Edytuj
            </Button>
            {transport.isAvailable && (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          Usuń
                        </Button>
                      </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Oznacza ogłoszenie jako nieaktywne, znajdziesz je
                        później w zakładce zakończone zlecenia
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Czy na pewno chcesz usunąć ogłoszenie?
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
        )}
      </div>

      {/* Quick info */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-1.5">
          <User className="w-4 h-4 text-gray-400" />
          <span className="font-medium">{transport.creator.username}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Truck className="w-4 h-4 text-gray-400" />
          <span className="capitalize">{transport.vehicle.name}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{formatDate(transport.createdAt)}</span>
        </div>
        {transport.distance?.text && (
          <div className="flex items-center gap-1.5">
            <Navigation className="w-4 h-4 text-gray-400" />
            <span>{transport.distance.text}</span>
          </div>
        )}
        {transport.duration?.text && (
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>{transport.duration.text}</span>
          </div>
        )}
      </div>

      {/* Description */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Opis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 leading-relaxed">
            {transport.description}
          </p>
        </CardContent>
      </Card>

      {/* Route + Objects grid */}
      <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Trasa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3 py-2">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                  <Calendar className="w-3 h-3" />
                  <span>Wysyłka: {formatDate(transport.sendDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-[8px] font-bold text-white">A</span>
                  </div>
                  <span className="text-sm font-medium">
                    {startAddr || "Ładowanie..."}
                  </span>
                </div>
              </div>

              <ArrowDown className="w-5 h-5 text-gray-300" />

              <div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                  <Calendar className="w-3 h-3" />
                  <span>Dostawa: {formatDate(transport.receiveDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-[8px] font-bold text-white">B</span>
                  </div>
                  <span className="text-sm font-medium">
                    {endAddr || "Ładowanie..."}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Przedmioty</CardTitle>
          </CardHeader>
          <CardContent>
            <ObjectsTable data={transport.objects} edit={false} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransportDetails;
