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
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ComboBox } from "@/components/ComboBox";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "../../../../components/DatePicker";
import TransportObjectsCard from "../../../../components/TransportObjectsCard";
import NewTransportMapCard from "../../../../components/NewTransportMapCard";
import { useSession } from "next-auth/react";
import { axiosInstance } from "@/lib/axios";
import { useToast } from "@/components/ui/use-toast";
import { CategoryComboBox } from "@/components/CategoryComboBox";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  ArrowRight,
  ArrowDown,
  Clock,
  Package,
  CalendarClock,
  MapPin,
  Box,
  AlertCircle,
} from "lucide-react";

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

export function AddTransportForm({
  school,
  categories,
  vehicles,
}: {
  school: School;
  categories: Settings[];
  vehicles: Settings[];
}) {
  const [alert, setAlert] = React.useState<{ error: string }>({ error: "" });
  const { toast } = useToast();
  const router = useRouter();
  const { data } = useSession();

  const [directionsData, setDirectionsData] =
    React.useState<DirectionsData | null>(null);
  const [startDestination, setStartDestination] =
    React.useState<Destination | null>(null);
  const [endDestination, setEndDestination] =
    React.useState<Destination | null>(null);

  // Refs for addresses — updated synchronously when user picks a place
  const startAddressRef = React.useRef<string>("");
  const endAddressRef = React.useRef<string>("");

  React.useEffect(() => {
    if (!startDestination || !endDestination) return;
    fetchDirections(startDestination, endDestination);
  }, [startDestination, endDestination]);

  const fetchDirections = async (start: Destination, end: Destination) => {
    if (!MAPBOX_TOKEN) return;
    try {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start.lng},${start.lat};${end.lng},${end.lat}?geometries=polyline&overview=full&access_token=${MAPBOX_TOKEN}`;
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

  const [objects, setObjects] = React.useState<Objects[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      sendTime: "10:00",
      receiveTime: "12:00",
    },
  });

  const descriptionValue = form.watch("description");

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

    const newTransport = {
      ...values,
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
      const response = await axiosInstance.post("/api/transports", newTransport);
      if (response.data.status === 201) {
        toast({
          title: "Sukces",
          description: "Transport został dodany.",
        });
        form.reset();
        router.push(`/transport/${response.data.transportId}`);
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
        description: "Wystąpił błąd podczas dodawania transportu.",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-10"
        id="transport-form"
      >
        {/* Section 1: Basic Info — primary card */}
        <section className="bg-card rounded-lg shadow-card p-6 space-y-6 animate-fade-in animate-stagger-1">
          <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
            <Package className="w-[18px] h-[18px] text-brand" />
            Podstawowe informacje
          </h2>
          <div className="w-full grid sm:grid-cols-2 grid-cols-1 gap-6">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    Kategoria <span className="text-brand">*</span>
                  </FormLabel>
                  <FormControl>
                    <CategoryComboBox
                      data={categories}
                      onChange={field.onChange}
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
                  <FormLabel>
                    Typ pojazdu <span className="text-brand">*</span>
                  </FormLabel>
                  <FormControl>
                    <ComboBox data={vehicles} onChange={field.onChange} />
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
                <FormLabel>
                  Opis <span className="text-brand">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea {...field} className="leading-relaxed" />
                </FormControl>
                <FormDescription className="flex justify-between">
                  <span className="max-w-[65ch]">
                    Krótki opis, który pomoże przewoźnikowi w przedstawieniu jak
                    najbardziej szczegółowej oferty.
                  </span>
                  <span className="tabular-nums text-xs shrink-0 ml-4">
                    {descriptionValue?.length || 0}
                  </span>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        {/* Section 2: Dates — open, border-t */}
        <section className="border-t border-border pt-8 space-y-6 animate-fade-in animate-stagger-2">
          <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
            <CalendarClock className="w-[18px] h-[18px] text-brand" />
            Termin transportu
          </h2>

          <div className="flex flex-col lg:flex-row gap-6 lg:items-start">
            {/* Send group */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-brand" />
                Wysyłka
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-brand/[0.03] rounded-lg p-4 border border-brand/10">
                <FormField
                  control={form.control}
                  name="sendDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>
                        Data <span className="text-brand">*</span>
                      </FormLabel>
                      <FormControl>
                        <DatePicker onChange={field.onChange} />
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
                      <FormLabel>
                        Godzina <span className="text-brand">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type="time"
                            className="pl-9 [color-scheme:light]"
                          />
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Godzina wysyłki towaru
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Arrow separator */}
            <div className="hidden lg:flex items-center pt-12 text-muted-foreground">
              <ArrowRight className="w-5 h-5" />
            </div>
            <div className="flex lg:hidden justify-center text-muted-foreground">
              <ArrowDown className="w-5 h-5" />
            </div>

            {/* Receive group */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-navy" />
                Dostawa
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-navy/[0.03] rounded-lg p-4 border border-navy/10">
                <FormField
                  control={form.control}
                  name="receiveDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>
                        Data <span className="text-brand">*</span>
                      </FormLabel>
                      <FormControl>
                        <DatePicker onChange={field.onChange} />
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
                      <FormLabel>
                        Godzina <span className="text-brand">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type="time"
                            className="pl-9 [color-scheme:light]"
                          />
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Godzina dostawy towaru
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </section>
      </form>

      {/* Map section */}
      <NewTransportMapCard
        setEndDestination={setEndDestination}
        setStartDestination={setStartDestination}
        setStartAddress={(addr) => {
          startAddressRef.current = addr;
        }}
        setEndAddress={(addr) => {
          endAddressRef.current = addr;
        }}
        directionsData={directionsData}
      />

      {alert.error !== "" && (
        <div className="flex items-center gap-3 p-4 rounded-lg border border-destructive/20 bg-destructive/5 text-destructive text-sm animate-fade-in">
          <AlertCircle className="shrink-0 w-5 h-5" />
          <span>{alert.error}</span>
        </div>
      )}

      {/* Objects section */}
      <TransportObjectsCard
        objects={objects}
        setObjects={setObjects}
        edit={true}
      />

      {/* Sticky submit bar */}
      <div className="sticky bottom-0 z-10 bg-background/80 backdrop-blur-sm border-t border-border -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 mt-10 animate-fade-in animate-stagger-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
          {/* Left: contextual info */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {directionsData && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                {directionsData.distance.text}
              </span>
            )}
            {objects.length > 0 && (
              <span className="flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5" />
                {objects.length}{" "}
                {objects.length === 1 ? "przedmiot" : "przedmiotów"}
              </span>
            )}
          </div>

          {/* Right: CTA */}
          <Button
            type="button"
            size="lg"
            onClick={form.handleSubmit(onSubmit)}
            className="sm:w-auto w-full active:scale-[0.98] transition-transform"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin w-4 h-4" />
                <span>Dodawanie...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>Dodaj ogłoszenie</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </Button>
        </div>
      </div>
    </Form>
  );
}
