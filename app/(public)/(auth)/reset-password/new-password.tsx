"use client";

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
import { redirect, useSearchParams } from "next/navigation";
import React from "react";
import { Eye, EyeOff, LoaderIcon } from "lucide-react";
import { axiosInstance } from "@/lib/axios";

type Props = {};

const formSchema = z.object({
  password: z.string().min(8, {
    message: "Hasło musi mieć co najmniej 8 znaków.",
  }),
  passwordConfirmation: z.string().min(8, {
    message: "Hasło musi mieć co najmniej 8 znaków.",
  }),
});

const NewPassword = (props: Props) => {
  const searchParams = useSearchParams();
  if (!searchParams) redirect("/");
  const token = searchParams.get("token");

  const [visible, setVisible] = React.useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      passwordConfirmation: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nowe hasło</FormLabel>
              <FormControl>
                <Input type={visible ? "text" : "password"} {...field} />
              </FormControl>
              <FormDescription>Podaj nowe hasło</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="passwordConfirmation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Powtórz hasło</FormLabel>
              <FormControl>
                <Input type={visible ? "text" : "password"} {...field} />
              </FormControl>
              <FormDescription>Powtórz hasło wpisane wyżej</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-end">
          {visible ? (
            <Eye className="cursor-pointer" />
          ) : (
            <EyeOff className="cursor-pointer" />
          )}
        </div>
        <div className="w-full flex justify-center items-center transition-all duration-500 bg-neutral-800">
          {form.formState.isSubmitting ? (
            <Button className="w-full" disabled>
              <LoaderIcon className="animate-spin mr-2" />
              <span className="text-white font-semibold">Zmiana hasła...</span>
            </Button>
          ) : (
            <Button type="submit" className="w-full">
              Zmień hasło
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default NewPassword;
