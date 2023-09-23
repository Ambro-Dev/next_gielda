"use client";

import React from "react";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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

const resetSchema = z.object({
  email: z
    .string({
      required_error: "Email jest wymagany.",
    })
    .email({
      message: "Niepoprawny adres email.",
    })
    .nonempty({
      message: "Email jest wymagany.",
    }),
});

type Props = {};

const ResetPassword = (props: Props) => {
  const resetForm = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof resetSchema>) => {
    console.log(data);
  };

  return (
    <div>
      <Form {...resetForm}>
        <form onSubmit={resetForm.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={resetForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormDescription>
                  Wpisz email przypisany do konta
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Resetuj hasło</Button>
        </form>
      </Form>
    </div>
  );
};

export default ResetPassword;
