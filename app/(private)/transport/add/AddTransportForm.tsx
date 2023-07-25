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
import SelectBox from "@/components/SelectBox";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "../../../../components/DatePicker";
import TransportObjectsCard from "../../../../components/TransportObjectsCard";
import TransportMapSelector from "../../../../components/TransportMapSelector";
import NewTransportMapCard from "../../../../components/NewTransportMapCard";
import { useSession } from "next-auth/react";

const formSchema = z.object({
  category: z
    .string({
      required_error: "Wybierz kategorię.",
    })
    .min(1, {
      message: "Wybierz kategorię.",
    }),
  vehicle: z
    .string({
      required_error: "Wybierz typ pojazdu.",
    })
    .min(1, {
      message: "Wybierz typ pojazdu.",
    }),
  type: z
    .string({
      required_error: "Wybierz typ pojazdu.",
    })
    .min(1, {
      message: "Wybierz typ pojazdu.",
    }),
  timeAvailable: z.preprocess(
    (val) => Number(val),
    z.number().min(1, {
      message: "Podaj czas dostępności.",
    })
  ),
  description: z
    .string({
      required_error: "Podaj opis.",
    })
    .min(1, {
      message: "Podaj opis.",
    }),
  sendDate: z
    .date({
      required_error: "Podaj datę wysyłki.",
    })
    .min(new Date(), {
      message: "Nieprawidłowa data wysyłki.",
    }),
  receiveDate: z
    .date({ required_error: "Podaj datę dostawy." })
    .min(new Date(), {
      message: "Nieprawidłowa data dostawy.",
    }),
});

type Objects = {
  name: string;
  description: string;
  weight: number;
  width: number;
  height: number;
  length: number;
  amount: number;
};

type Destination = {
  lat: number;
  lng: number;
};

type School = {
  id: string;
  administrator: {
    id: string;
  };
};

type Settings = {
  id: string;
  name: string;
};

export function AddTransportForm({
  school,
  categories,
  types,
  vehicles,
}: {
  school: School;
  categories: Settings[];
  types: Settings[];
  vehicles: Settings[];
}) {
  const router = useRouter();
  const { data, status } = useSession();

  const [objects, setObjects] = React.useState<Objects[]>([]);
  const [startDestination, setStartDestination] =
    React.useState<Destination | null>(null);
  const [endDestination, setEndDestination] =
    React.useState<Destination | null>(null);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      timeAvailable: 0,
      description: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const newTransport = {
      ...values,
      objects,
      directions: {
        start: startDestination,
        finish: endDestination,
      },
      creator: data?.user?.id,
      school: school.id,
    };

    const response = await fetch("/api/transports", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTransport),
    });

    if (response.ok) {
      router.replace("/");
    } else {
      console.log("Błąd");
    }
  };

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
          id="transport-form"
        >
          <div className="w-full grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-8">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Kategoria*</FormLabel>
                  <FormControl>
                    <ComboBox data={categories} onChange={field.onChange} />
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
                  <FormLabel>Typ pojazdu transportwoego*</FormLabel>
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
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Typ ogłoszenia*</FormLabel>
                  <FormControl>
                    <SelectBox
                      data={types}
                      onChange={field.onChange}
                      title="Typ ogłoszenia"
                    />
                  </FormControl>
                  <FormDescription>Osoba prywatna czy firma?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="timeAvailable"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Ważność ogłoszenia*</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>Ważność ogłoszenia w dniach</FormDescription>
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
                  najbardziej szcegółowej oferty.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="lg:w-1/2 w-full grid-cols-1 grid sm:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="sendDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data wysyłki*</FormLabel>
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
              name="receiveDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data dostawy*</FormLabel>
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
          </div>
        </form>
      </Form>
      <NewTransportMapCard
        setEndDestination={setEndDestination}
        setStartDestination={setStartDestination}
      />
      <TransportObjectsCard objects={objects} setObjects={setObjects} />
      <div className="w-full flex justify-end items-center">
        <Button
          type="button"
          onClick={form.handleSubmit(onSubmit)}
          className="w-full"
        >
          Dodaj
        </Button>
      </div>
    </div>
  );
}