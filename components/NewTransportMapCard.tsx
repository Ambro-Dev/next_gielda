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
import React from "react";

type LatLng = { lat: number; lng: number };

type NewTransportMapCardProps = {
  setStartDestination: (position: LatLng) => void;
  setEndDestination: (position: LatLng) => void;
  setStartAddress?: (address: string) => void;
  setEndAddress?: (address: string) => void;
  startDestination?: LatLng;
  endDestination?: LatLng;
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
    <div className="border border-gray-200 rounded-lg p-6 space-y-6">
      <h2 className="text-base font-semibold">Trasa transportu</h2>
      <div className="grid lg:grid-cols-2 grid-cols-1 w-full gap-6">
      <div className="flex items-center justify-center">
        <Form {...form}>
          <form className="space-y-6 w-full">
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
          </form>
        </Form>
      </div>
      <div className="w-full rounded-lg overflow-hidden min-h-[300px]">
        <MapWithDirections
          start={form.watch("start")}
          finish={form.watch("finish")}
        />
      </div>
      </div>
    </div>
  );
};

export default NewTransportMapCard;
