"use client";

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import SelectBox from "./select-box";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/DatePicker";

type Props = {};

const formSchema = z.object({
  message: z.string().nonempty({
    message: "Wiadomość nie może być pusta",
  }),
  currency: z.string({
    required_error: "Nieprawidłowa waluta",
  }),
  vat: z.string({
    required_error: "Nieprawidłowa stawka VAT",
  }),
  netto: z.preprocess((val) => {
    String(val);
  }, z.string()),
  loadDate: z.string().nonempty({
    message: "Data załadunku nie może być pusta",
  }),
  unloadDate: z.string().nonempty({
    message: "Data rozładunku nie może być pusta",
  }),
  daysToUnload: z.preprocess((val) => {
    String(val);
  }, z.string()),
  number: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/),
});

const currencyOptions = [
  { name: "PLN", label: "PLN" },
  { name: "EUR", label: "EUR" },
  { name: "USD", label: "USD" },
];

const vatOptions = [
  { name: "0", label: "0%" },
  { name: "23", label: "23%" },
];

const OfferForm = (props: Props) => {
  const [brutto, setBrutto] = React.useState<Number>(0);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
      currency: "PLN",
      vat: "23",
      netto: "",
      loadDate: "",
      unloadDate: "",
      daysToUnload: "",
      number: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Waluta</FormLabel>
                  <FormControl>
                    <SelectBox
                      data={currencyOptions}
                      value={field.value}
                      onChange={field.onChange}
                      title="Waluta"
                    />
                  </FormControl>
                  <FormDescription>Wybierz walutę</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vat"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>VAT</FormLabel>
                  <FormControl>
                    <SelectBox
                      data={vatOptions}
                      value={field.value}
                      onChange={field.onChange}
                      title="VAT"
                    />
                  </FormControl>
                  <FormDescription>Wybierz wartość podatku VAT</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="netto"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Kwota netto</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
                <FormDescription>Wpisz kwotę netto</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="loadDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Załadunek od</FormLabel>
                  <FormControl>
                    <DatePicker onChange={field.onChange} />
                  </FormControl>
                  <FormDescription>Wybierz datę załadunku</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="unloadDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Załadunek do</FormLabel>
                  <FormControl>
                    <DatePicker onChange={field.onChange} />
                  </FormControl>
                  <FormDescription>Wybierz datę rozaładunku</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="daysToUnload"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Dni rozładunku</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormDescription>Wpisz ilość dni rozładunku</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Numer</FormLabel>
                  <FormControl>
                    <Input {...field} type="tel" />
                  </FormControl>
                  <FormDescription>Wpisz numer telefonu</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Widamość</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormDescription>Wpisz treść wiadomości</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Wyślij</Button>
        </form>
      </Form>
    </div>
  );
};

export default OfferForm;
