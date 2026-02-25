"use client";

import * as React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ComboBox } from "@/components/ComboBox";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/DatePicker";
import TransportObjectsCard from "@/components/TransportObjectsCard";
import NewTransportMapCard from "@/components/NewTransportMapCard";
import { useSession } from "next-auth/react";
import { axiosInstance } from "@/lib/axios";
import { useToast } from "@/components/ui/use-toast";
import { Transport } from "../page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CurrentTransportMap from "./CurrentMap";
import { CategoryComboBox } from "@/components/CategoryComboBox";
import { Loader2 } from "lucide-react";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const formSchema = z
  .object({
    category: z
      .string({ required_error: "Wybierz kategorię." })
      .min(1, { message: "Wybierz kategorię." }),
    vehicle: z
      .string({ required_error: "Wybierz typ pojazdu." })
      .min(1, { message: "Wybierz typ pojazdu." }),
    description: z
      .string({ required_error: "Podaj opis." })
      .min(1, { message: "Podaj opis." }),
    sendDate: z
      .date({ required_error: "Podaj datę wysyłki." })
      .min(new Date(), { message: "Nieprawidłowa data wysyłki." }),
    sendTime: z
      .string({ required_error: "Podaj godzinę wysyłki." })
      .min(1, { message: "Podaj godzinę wysyłki." }),
    receiveDate: z
      .date({ required_error: "Podaj datę dostawy." })
      .min(new Date(), { message: "Nieprawidłowa data dostawy." }),
    receiveTime: z
      .string({ required_error: "Podaj godzinę dostawy." })
      .min(1, { message: "Podaj godzinę dostawy." }),
  })
  .refine((data) => data.sendDate < data.receiveDate, {
    message: "Data dostawy musi być równa lub późniejsza niż data wysyłki.",
    path: ["receiveDate"],
  });

type Objects = {
  id: string;
  name: string;
  description: string;
  weight: number;
  width: number;
  height: number;
  length: number;
  amount: number;
};

type Destination = { lat: number; lng: number };

type DirectionsData = {
  distance: { text: string; value: number };
  duration: { text: string; value: number };
  start_address: string;
  end_address: string;
  polyline: string;
};

type School = {
  id: string;
  administrators: { id: string }[];
};

type Settings = { id: string; name: string };

const formatDistance = (meters: number) => {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
};

const formatDuration = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h === 0) return `${m} min`;
  return `${h} godz ${m} min`;
};

export function EditTransportForm({
  school,
  categories,
  vehicles,
  user,
  transport,
}: {
  school: School;
  categories: Settings[];
  vehicles: Settings[];
  user: string;
  transport: Transport & {
    sendTime: string;
    receiveTime: string;
  };
}) {
  const [alert, setAlert] = React.useState<{ error: string }>({ error: "" });
  const { toast } = useToast();
  const router = useRouter();
  const { data } = useSession();

  // Initialize directionsData from the existing transport
  const [directionsData, setDirectionsData] =
    React.useState<DirectionsData | null>(() => {
      if (transport.distance && transport.duration) {
        return {
          distance: transport.distance as { text: string; value: number },
          duration: transport.duration as { text: string; value: number },
          start_address: transport.start_address || "",
          end_address: transport.end_address || "",
          polyline: (transport as any).polyline || "",
        };
      }
      return null;
    });

  const [objects, setObjects] = React.useState<Objects[]>([]);
  const [startDestination, setStartDestination] = React.useState<
    Destination | undefined
  >(undefined);
  const [endDestination, setEndDestination] = React.useState<
    Destination | undefined
  >(undefined);

  // Refs for addresses — initialized from existing transport, updated when user picks a new place
  const startAddressRef = React.useRef<string>(transport.start_address || "");
  const endAddressRef = React.useRef<string>(transport.end_address || "");

  // Track whether the first direction-fetch should be skipped (initial load)
  const skipInitialFetch = React.useRef(true);

  React.useEffect(() => {
    if (transport.objects) {
      setObjects(transport.objects);
    }
    if (transport.directions) {
      setStartDestination(transport.directions.start);
      setEndDestination(transport.directions.finish);
    }
  }, [transport]);

  React.useEffect(() => {
    if (!startDestination || !endDestination) return;
    if (skipInitialFetch.current) {
      skipInitialFetch.current = false;
      return;
    }
    fetchDirections(startDestination, endDestination);
  }, [startDestination, endDestination]);

  const fetchDirections = async (start: Destination, end: Destination) => {
    if (!MAPBOX_TOKEN) return;
    try {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start.lng},${start.lat};${end.lng},${end.lat}?geometries=polyline&access_token=${MAPBOX_TOKEN}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.routes?.[0]) {
        const route = json.routes[0];
        setDirectionsData({
          distance: {
            text: formatDistance(route.distance),
            value: route.distance,
          },
          duration: {
            text: formatDuration(route.duration),
            value: route.duration,
          },
          start_address: startAddressRef.current,
          end_address: endAddressRef.current,
          polyline: route.geometry,
        });
      }
    } catch (error) {
      console.error("Error fetching Mapbox directions:", error);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: transport.description,
      category: transport.category.id,
      vehicle: transport.vehicle.id,
      sendTime: transport.sendTime,
      sendDate: new Date(transport.sendDate),
      receiveDate: new Date(transport.receiveDate),
      receiveTime: transport.receiveTime,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const objectsWithoutId = objects.map(({ id, ...rest }) => rest);

    if (!directionsData || !startDestination || !endDestination) {
      setAlert({ error: "Nie wybrano trasy." });
      return toast({
        title: "Błąd",
        description: "Usupełnij lub popraw trasę transportu",
        variant: "destructive",
      });
    }

    const editTransport = {
      ...values,
      id: transport.id,
      objects: objectsWithoutId,
      directions: {
        start: startDestination,
        finish: endDestination,
      },
      distance: directionsData.distance,
      duration: directionsData.duration,
      start_address: directionsData.start_address,
      end_address: directionsData.end_address,
      polyline: directionsData.polyline,
      creator: data?.user?.id,
      school: school ? school : undefined,
    };

    try {
      const response = await axiosInstance.put(
        "/api/transports/transport/edit",
        editTransport
      );
      if (response.data.status === 201) {
        toast({
          title: "Sukces",
          description: "Transport został zaktualizowany.",
        });
        form.reset();
        router.replace(`/transport/${response.data.transportId}`);
        router.refresh();
      } else {
        toast({
          title: "Błąd",
          description: response.data.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Wystąpił błąd podczas zmiany transportu.",
      });
    }
  };

  const alertBox = (
    <div className="flex items-center gap-3 p-4 rounded-lg border border-red-200 bg-red-50 text-red-800 text-sm">
      <span>{alert.error}</span>
    </div>
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
        id="transport-form"
      >
        {/* Basic info section */}
        <div className="border border-gray-200 rounded-lg p-6 space-y-6">
          <h2 className="text-base font-semibold">Podstawowe informacje</h2>
          <div className="w-full grid sm:grid-cols-2 grid-cols-1 gap-6">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Kategoria*</FormLabel>
                  <FormControl>
                    <CategoryComboBox
                      data={categories}
                      onChange={field.onChange}
                      defaulValue={field.value}
                    />
                  </FormControl>
                  <FormDescription>
                    Wybierz kategorię transportu
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vehicle"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Typ pojazdu transportowego*</FormLabel>
                  <FormControl>
                    <ComboBox
                      data={vehicles}
                      onChange={field.onChange}
                      defaulValue={field.value}
                    />
                  </FormControl>
                  <FormDescription>
                    Wybierz typ pojazdu transportowego
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Opis*</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormDescription>
                  Krótki opis, który pomoże przewoźnikowi w przedstawieniu jak
                  najbardziej szczegółowej oferty.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Dates section */}
        <div className="border border-gray-200 rounded-lg p-6 space-y-6">
          <h2 className="text-base font-semibold">Termin transportu</h2>
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FormField
              control={form.control}
              name="sendDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data wysyłki*</FormLabel>
                  <FormControl>
                    <DatePicker
                      onChange={field.onChange}
                      defaultValue={field.value}
                    />
                  </FormControl>
                  <FormDescription>
                    Kiedy towar ma zostać odebrany
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sendTime"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Godzina wysyłki*</FormLabel>
                  <FormControl>
                    <Input {...field} type="time" />
                  </FormControl>
                  <FormDescription>
                    Wybierz godzinę wysyłki towaru
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="receiveDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data dostawy*</FormLabel>
                  <FormControl>
                    <DatePicker
                      onChange={field.onChange}
                      defaultValue={field.value}
                    />
                  </FormControl>
                  <FormDescription>
                    Kiedy towar ma zostać dostarczony
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="receiveTime"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Godzina dostawy*</FormLabel>
                  <FormControl>
                    <Input {...field} type="time" />
                  </FormControl>
                  <FormDescription>
                    Wybierz godzinę dostawy towaru
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>

      {/* Map section */}
      <Tabs defaultValue="current" className="space-y-4">
        <TabsList>
          <TabsTrigger value="current">Obecna trasa</TabsTrigger>
          <TabsTrigger value="edit">Edytuj trasę</TabsTrigger>
        </TabsList>
        <TabsContent value="current" className="space-y-4">
          <CurrentTransportMap transport={transport} />
        </TabsContent>
        <TabsContent value="edit" className="space-y-4">
          <NewTransportMapCard
            setEndDestination={setEndDestination}
            setStartDestination={setStartDestination}
            startDestination={startDestination}
            endDestination={endDestination}
            setStartAddress={(addr) => {
              startAddressRef.current = addr;
            }}
            setEndAddress={(addr) => {
              endAddressRef.current = addr;
            }}
          />
        </TabsContent>
      </Tabs>

      {alert.error !== "" && alertBox}

      {/* Objects section */}
      <TransportObjectsCard
        objects={objects}
        setObjects={setObjects}
        edit={true}
      />

      {/* Submit */}
      <div className="w-full flex justify-end items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Anuluj
        </Button>
        <Button
          type="button"
          onClick={form.handleSubmit(onSubmit)}
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin w-4 h-4" />
              <span>Zapisywanie...</span>
            </div>
          ) : (
            "Zapisz"
          )}
        </Button>
      </div>
    </Form>
  );
}
