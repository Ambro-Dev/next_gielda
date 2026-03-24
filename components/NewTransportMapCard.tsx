import MapWithDirections from "./MapWithDestinations";
import TransportMapSelector from "./TransportMapSelector";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
  FormControl,
  FormDescription,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { MapPin, Navigation, Clock } from "lucide-react";
import React from "react";

type LatLng = { lat: number; lng: number };

type DirectionsData = {
  distance: { text: string; value: number };
  duration: { text: string; value: number };
  start_address: string;
  end_address: string;
} | null;

type NewTransportMapCardProps = {
  setStartDestination: (position: LatLng) => void;
  setEndDestination: (position: LatLng) => void;
  setStartAddress?: (address: string) => void;
  setEndAddress?: (address: string) => void;
  startDestination?: LatLng;
  endDestination?: LatLng;
  directionsData?: DirectionsData;
};

const formSchema = z.object({
  start: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  finish: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
});

const NewTransportMapCard = ({
  setStartDestination,
  setEndDestination,
  setStartAddress,
  setEndAddress,
  startDestination,
  endDestination,
  directionsData,
}: NewTransportMapCardProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      start: startDestination,
      finish: endDestination,
    },
  });

  React.useEffect(() => {
    if (form.watch("start")) {
      setStartDestination(form.watch("start"));
    }
  }, [form.watch("start")]);

  React.useEffect(() => {
    if (form.watch("finish")) {
      setEndDestination(form.watch("finish"));
    }
  }, [form.watch("finish")]);

  return (
    <section className="bg-card rounded-lg shadow-card-lg overflow-hidden animate-fade-in animate-stagger-3 hover:shadow-card-hover transition-shadow duration-300">
      <div className="p-6 space-y-6">
        <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
          <MapPin className="w-[18px] h-[18px] text-brand" />
          Trasa transportu
        </h2>

        <Form {...form}>
          <form className="space-y-6 w-full">
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="start"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Miejsce wysyłki</FormLabel>
                    <FormControl>
                      <TransportMapSelector
                        setPlace={field.onChange}
                        setAddress={setStartAddress}
                      />
                    </FormControl>
                    <FormDescription>
                      Wybierz miejsce wysyłki (Forma wyszukiwania{" "}
                      <b>ulica, miasto, kraj</b>)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="finish"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Miejsce odbioru</FormLabel>
                    <FormControl>
                      <TransportMapSelector
                        setPlace={field.onChange}
                        setAddress={setEndAddress}
                      />
                    </FormControl>
                    <FormDescription>
                      Wybierz miejsce odbioru (Forma wyszukiwania{" "}
                      <b>ulica, miasto, kraj</b>)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>

        {/* Route summary */}
        {directionsData && (
          <div className="flex items-center gap-4 text-sm bg-muted/50 rounded-md px-4 py-3 animate-fade-in">
            <div className="flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-brand" />
              <span className="font-medium tabular-nums">
                {directionsData.distance.text}
              </span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium tabular-nums">
                {directionsData.duration.text}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Map — bleeds to card edges */}
      <div className="w-full min-h-[250px] sm:min-h-[350px] lg:min-h-[400px]">
        <MapWithDirections
          start={form.watch("start")}
          finish={form.watch("finish")}
        />
      </div>
    </section>
  );
};

export default NewTransportMapCard;
