"use client";

import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

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

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { ObjectsTable } from "@/components/ObjectsTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ObjectFormSchema = z.object({
  name: z.string().min(2, {
    message: "Nazwa przedmiotu musi mieć co najmniej 2 znaki.",
  }),
  weight: z.preprocess(
    (val) => Number(val),
    z.number().min(1, {
      message: "Podaj wagę przedmiotu.",
    })
  ),
  description: z.string().min(2, {
    message: "Opis przedmiotu musi mieć co najmniej 2 znaki.",
  }),
  width: z.preprocess(
    (val) => Number(val),
    z
      .number({
        required_error: "Podaj szerokość przedmiotu.",
      })
      .min(0.1, {
        message: "Szerokość przedmiotu musi być wieksza niż 0.1.",
      })
  ),
  height: z.preprocess(
    (val) => Number(val),
    z.number().min(1, {
      message: "Podaj wysokość przedmiotu.",
    })
  ),
  length: z.preprocess(
    (val) => Number(val),
    z.number().min(1, {
      message: "Podaj długość przedmiotu.",
    })
  ),
  amount: z.preprocess(
    (val) => Number(val),
    z.number().min(1, {
      message: "Podaj ilość przedmiotów.",
    })
  ),
});
type Object = z.infer<typeof ObjectFormSchema>;

type Props = {
  objects: Object[];
  setObjects: React.Dispatch<React.SetStateAction<Object[]>>;
};

const TransportObjectsCard = ({ objects, setObjects }: Props) => {
  const [open, setOpen] = React.useState(false);

  const objectForm = useForm<z.infer<typeof ObjectFormSchema>>({
    resolver: zodResolver(ObjectFormSchema),
    defaultValues: {
      name: "",
      description: "",
      weight: 0,
      width: 0,
      height: 0,
      length: 0,
      amount: 0,
    },
  });

  const submitForm = async (values: z.infer<typeof ObjectFormSchema>) => {
    const newObject = {
      name: values.name,
      description: values.description,
      weight: values.weight,
      width: values.width,
      height: values.height,
      length: values.length,
      amount: values.amount,
    };
    setObjects((prev) => [...prev, newObject]);
    setOpen(false);

    objectForm.reset();
  };

  return (
    <Card className="border-none">
      <CardHeader className="text-center">
        <CardTitle>Przedmioty do transportu</CardTitle>
        <CardDescription>
          Dodaj wszystkie przedmioty podlegające pod transport.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex w-full justify-center items-center my-3">
              Dodaj przedmiot
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Nowy przedmiot</DialogTitle>
              <DialogDescription>
                Podaj wszystkie dane dotyczące przedmiotu.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Form {...objectForm}>
                <form
                  onSubmit={objectForm.handleSubmit(submitForm)}
                  className="space-y-8"
                  id="objectForm"
                >
                  <FormField
                    control={objectForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Nazwa*</FormLabel>
                        <FormControl>
                          <Input {...field} type="text" />
                        </FormControl>
                        <FormDescription>
                          Podaj nazwę przedmiotu
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={objectForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Opis*</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormDescription>Podaj opis przedmiotu</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={objectForm.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Waga*</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" />
                        </FormControl>
                        <FormDescription>
                          Podaj wagę przedmiotu w kg
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={objectForm.control}
                    name="width"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Szerokość*</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" />
                        </FormControl>
                        <FormDescription>
                          Podaj szerokość przedmiotu w cm
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={objectForm.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Wysokość*</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" />
                        </FormControl>
                        <FormDescription>
                          Podaj wysokość przedmiotu w cm
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={objectForm.control}
                    name="length"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Długość*</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" />
                        </FormControl>
                        <FormDescription>
                          Podaj długość przedmiotu w cm
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={objectForm.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Ilość*</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" />
                        </FormControl>
                        <FormDescription>
                          Podaj ilość przedmiotów
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">Zapisz przedmiot</Button>
                  </DialogFooter>
                </form>
              </Form>
            </div>
          </DialogContent>
        </Dialog>

        <ObjectsTable data={objects} />
      </CardContent>
    </Card>
  );
};

export default TransportObjectsCard;
