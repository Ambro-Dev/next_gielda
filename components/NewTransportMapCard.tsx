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

type NewTransportMapCardProps = {
  setStartDestination: (position: google.maps.LatLngLiteral) => void;
  setEndDestination: (position: google.maps.LatLngLiteral) => void;
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
}: NewTransportMapCardProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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
    <div className="grid grid-cols-2 w-full gap-8 py-10">
      <div className="flex items-center justify-center">
        <Form {...form}>
          <form className="space-y-8 w-full">
            <FormField
              control={form.control}
              name="start"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Miejsce wysyłki</FormLabel>
                  <FormControl>
                    <TransportMapSelector setPlace={field.onChange} />
                  </FormControl>
                  <FormDescription>Wybierz miejsce wysyłki</FormDescription>
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
                    <TransportMapSelector setPlace={field.onChange} />
                  </FormControl>
                  <FormDescription>Wybierz miejsce odbioru</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
      <div className="w-full">
        <MapWithDirections
          start={form.watch("start")}
          finish={form.watch("finish")}
        />
      </div>
    </div>
  );
};

export default NewTransportMapCard;
