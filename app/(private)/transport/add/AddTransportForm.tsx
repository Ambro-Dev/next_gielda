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
import { axiosInstance } from "@/lib/axios";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z
  .object({
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
    availableDate: z
      .date({
        required_error: "Poda do kiedy ogłoszenie jest ważne.",
      })
      .min(new Date(), {
        message: "Nieprawidłowa data.",
      }),
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
  })
  .refine((data) => data.sendDate < data.receiveDate, {
    message: "Data dostawy musi być równa lub późniejsza niż data wysyłki.",
    path: ["receiveDate"],
  })
  .refine((data) => data.availableDate < data.sendDate, {
    message:
      "Data wysyłki musi być równa lub późniejsza niż data ważności ogłoszenia.",
    path: ["sendDate"],
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
  const { toast } = useToast();
  const router = useRouter();
  const { data, status } = useSession();

  const [objects, setObjects] = React.useState<Objects[]>([]);
  const [startDestination, setStartDestination] =
    React.useState<Destination | null>(null);
  const [endDestination, setEndDestination] =
    React.useState<Destination | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const objectsWithoutId = objects.map((object) => {
      const { id, ...rest } = object;
      return rest;
    });
    const newTransport = {
      ...values,
      objects: objectsWithoutId,
      directions: {
        start: startDestination,
        finish: endDestination,
      },
      creator: data?.user?.id,
      school: school ? school : undefined,
    };

    try {
      const response = await axiosInstance.post(
        "/api/transports",
        newTransport
      );
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
              name="availableDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Ważność ogłoszenia*</FormLabel>
                  <FormControl>
                    <DatePicker onChange={field.onChange} />
                  </FormControl>
                  <FormDescription>Ważność ogłoszenia do</FormDescription>
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
      <TransportObjectsCard
        objects={objects}
        setObjects={setObjects}
        edit={true}
      />
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
