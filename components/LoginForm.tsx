"use client";

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

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Nazwa użytkownika musi mieć co najmniej 2 znaki.",
  }),
  password: z.string().min(8, {
    message: "Hasło musi mieć co najmniej 8 znaków.",
  }),
});

export function LoginForm() {
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const response = await signIn("credentials", {
      username: values.username,
      password: values.password,
      redirect: false,
    });

    if (response?.error) {
      form.setError("username", {
        type: "manual",
        message: "Nazwa użytkownika lub hasło jest nieprawidłowe.",
      });
      form.setError("password", {
        type: "manual",
        message: "Nazwa użytkownika lub hasło jest nieprawidłowe.",
      });
    }
    router.replace("/");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nazwa użytkownika</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormDescription>Wpisz swoją nazwę użytkownika.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hasło</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormDescription>Wpisz swoje hasło.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Zaloguj</Button>
      </form>
    </Form>
  );
}
