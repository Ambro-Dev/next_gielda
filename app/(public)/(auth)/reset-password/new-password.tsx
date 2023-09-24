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
import { toast } from "@/components/ui/use-toast";
import Lottie from "lottie-react";

import success from "@/assets/animations/success.json";
import Link from "next/link";

type Props = {};

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, {
        message: "Hasło musi mieć co najmniej 8 znaków.",
      })
      .max(64, {
        message: "Hasło może mieć maksymalnie 64 znaki.",
      })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/,
        "Hasło musi zawierać co najmniej jedną małą literę, jedną dużą literę, jedną cyfrę i jeden znak specjalny."
      ),

    passwordConfirmation: z
      .string()
      .min(8, {
        message: "Hasło musi mieć co najmniej 8 znaków.",
      })
      .max(64, {
        message: "Hasło może mieć maksymalnie 64 znaki.",
      })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/,
        "Hasło musi zawierać co najmniej jedną małą literę, jedną dużą literę, jedną cyfrę i jeden znak specjalny."
      ),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Hasła muszą być takie same.",
    path: ["passwordConfirmation"],
  });

const NewPassword = (props: Props) => {
  const [success, setSuccess] = React.useState<boolean>(false);
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
    try {
      const response = await axiosInstance.post("api/auth/reset-password", {
        token,
        password: values.password,
        passwordConfirmation: values.passwordConfirmation,
      });
      toast({
        title: "Sukces",
        description: "Hasło zostało zmienione.",
      });
      setSuccess(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {success ? (
        <div className="flex flex-col justify-center items-center">
          <Lottie animationData={success} className="w-1/2 h-1/2" />
          <Button variant="outline" className="w-full">
            <Link href="/signin">Zaloguj się</Link>
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nowe hasło</FormLabel>
                  <FormControl>
                    <Input
                      type={visible ? "text" : "password"}
                      {...field}
                      onKeyDown={(e) => {
                        if (e.key === " ") {
                          e.preventDefault();
                        }
                      }}
                    />
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
                    <Input
                      type={visible ? "text" : "password"}
                      {...field}
                      onKeyDown={(e) => {
                        if (e.key === " ") {
                          e.preventDefault();
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription>Powtórz hasło wpisane wyżej</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-end">
              <Button
                className="flex items-center justify-center"
                variant="ghost"
                onClick={() => setVisible(!visible)}
                type="button"
              >
                {visible ? (
                  <Eye className="cursor-pointer" />
                ) : (
                  <EyeOff className="cursor-pointer" />
                )}
              </Button>
            </div>
            <div className="w-full flex justify-center items-center transition-all duration-500 bg-neutral-800">
              {form.formState.isSubmitting ? (
                <Button
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
                  <LoaderIcon className="animate-spin mr-2" />
                  <span className="text-white font-semibold">
                    Zmiana hasła...
                  </span>
                </Button>
              ) : (
                <Button type="submit" className="w-full">
                  Zmień hasło
                </Button>
              )}
            </div>
          </form>
        </Form>
      )}
    </>
  );
};

export default NewPassword;
