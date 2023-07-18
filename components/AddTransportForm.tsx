"use client";

import * as React from "react";

import Link from "next/link";
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
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ComboBox } from "@/components/ComboBox";
import SelectBox from "@/components/SelectBox";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "./DatePicker";
import TransportObjectsCard from "./TransportObjectsCard";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Nazwa użytkownika musi mieć co najmniej 2 znaki.",
  }),
  password: z.string().min(8, {
    message: "Hasło musi mieć co najmniej 8 znaków.",
  }),
  category: z.enum(["samochody", "meble", "elektronika", "inne"], {
    required_error: "Wybierz kategorię.",
  }),
  transportVehicle: z.enum(
    ["bus", "osobowy", "ciężarowy", "motocykl", "inne"],
    {
      required_error: "Wybierz typ pojazdu.",
    }
  ),
  type: z.enum(["prywatne", "firmowe"], {
    required_error: "Wybierz typ pojazdu.",
  }),
  timeAvailable: z.string().min(1, {
    message: "Podaj czas dostępności.",
  }),
  description: z.string().min(1, {
    message: "Podaj opis.",
  }),
  sendDate: z.date().min(new Date(), {
    message: "Nieprawidłowa data wysyłki.",
  }),
  recieveDate: z.date().min(new Date(), {
    message: "Nieprawidłowa data dostawy.",
  }),
});

export function AddTransportForm() {
  const [objects, setObjects] = React.useState([]);

  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      timeAvailable: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  const categories = [
    {
      value: "meble",
      label: "Meble",
    },
    {
      value: "samochody",
      label: "Samochody",
    },
    {
      value: "elektronika",
      label: "Elektronika",
    },
    {
      value: "inne",
      label: "Inne",
    },
  ];

  const transportVehicles = [
    {
      value: "bus",
      label: "Bus",
    },
    {
      value: "osobowy",
      label: "Osobowy",
    },
    {
      value: "ciężarowy",
      label: "Ciężarowy",
    },
    {
      value: "motocykl",
      label: "Motocykl",
    },
    {
      value: "inne",
      label: "Inne",
    },
  ];

  const types = [
    {
      value: "prywatne",
      label: "Prywatne",
    },
    {
      value: "firmowe",
      label: "Firmowe",
    },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="w-full grid grid-cols-4 gap-8">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Kategoria*</FormLabel>
                <FormControl>
                  <ComboBox data={categories} onChange={field.onChange} />
                </FormControl>
                <FormDescription>Wybierz kategorię transportu</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="transportVehicle"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Typ pojazdu transportwoego*</FormLabel>
                <FormControl>
                  <ComboBox
                    data={transportVehicles}
                    onChange={field.onChange}
                  />
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
        <div className="w-1/2 grid grid-cols-2 gap-8">
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
            name="recieveDate"
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
        <div className="w-full grid grid-cols-2 gap-8">
          <TransportObjectsCard />
        </div>
        <div className="w-full flex justify-end items-center">
          <Button type="submit" className="w-full">
            Dodaj
          </Button>
        </div>
      </form>
    </Form>
  );
}
