"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/axios";
import { useSession } from "next-auth/react";
import { toast } from "@/components/ui/use-toast";
import Lottie from "lottie-react";

import report_sent from "@/assets/animations/report_sent.json";

type Props = {};

const formSchema = z.object({
  place: z
    .string({
      required_error: "Pole wymagane",
    })
    .min(3)
    .max(50),
  content: z
    .string({
      required_error: "Pole wymagane",
    })
    .min(10)
    .max(500),
});

const Page = (props: Props) => {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const router = useRouter();

  const { data } = useSession();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      place: "",
      content: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (status === "success") return;

    if (!form.formState.isValid) return;

    try {
      await axiosInstance.post("/api/report", {
        ...values,
        userId: data?.user.id,
      });
      setStatus("success");
      form.reset();
    } catch (error: any) {
      toast({
        title: "Wystąpił błąd",
        description: error.response.data.error,
        variant: "destructive",
      });
      setStatus("error");
    }
  };

  return (
    <div className="flex justify-center items-center mb-5 mx-1">
      <Card
        className={`${
          status === "success" ? "max-w-lg" : "max-w-2xl"
        } space-y-4 duration-500 transition-all`}
      >
        {status === "success" ? (
          <>
            <CardHeader className="p-5 text-center">
              <CardTitle>Uwaga została wysłana</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Lottie
                className="w-1/2 mx-auto"
                animationData={report_sent}
                loop={false}
              />
              <CardDescription className="text-center">
                Twoja uwaga została wysłana. Dziękujemy za pomoc w rozwoju
                systemu.
              </CardDescription>
            </CardContent>
            <CardFooter>
              <Button
                variant="secondary"
                onClick={() => router.back()}
                className="w-full"
              >
                Wróć
              </Button>
            </CardFooter>
          </>
        ) : (
          <>
            <CardHeader className="p-5 space-y-4">
              <CardTitle>Zgłoś uwagę do działania systemu</CardTitle>
              <CardDescription>
                Jeśli napotkałeś problem lub masz sugestię dotyczącą działania
                systemu, możesz zgłosić to tutaj. Wszystkie zgłoszenia są
                weryfikowane przez administratorów.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="place"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="font-semibold">
                          Miejsce wystąpienia
                        </FormLabel>
                        <FormControl>
                          <Input {...field} type="text" />
                        </FormControl>
                        <FormDescription>
                          Podaj miejsce wystąpienia problemu
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="font-semibold">
                          Treść uwagi
                        </FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormDescription>
                          Opisz jak najdokładniej problem lub sugestię
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => router.back()}
                    >
                      Anuluj
                    </Button>
                    <Button
                      type="submit"
                      disabled={
                        form.formState.isSubmitting || !form.formState.isValid
                      }
                    >
                      {form.formState.isSubmitting ? "Wysyłanie..." : "Wyślij"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
};

export default Page;
