"use client";

import React from "react";

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
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/axios";

const schema = z.object({
  message: z.string().min(1, "Wiadomość nie może być pusta"),
});

type Props = {
  offerId: string;
  receiverId: string;
};

const NewMessage = (props: Props) => {
  const { offerId, receiverId } = props;
  const { data, status } = useSession();
  const [sending, setSending] = React.useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      setSending(true);
      const response = await axiosInstance.put(`/api/offers/offer/message`, {
        message: values.message,
        offerId,
        senderId: data?.user?.id,
        receiverId,
      });

      const resData = response.data;
      if (resData.status === 200) {
        form.reset();
        router.refresh();
      }
    } catch (error) {
      console.log(error);
      throw new Error("Nie udało się wysłać wiadomości");
    }
    setSending(false);
  };

  return (
    <div className="px-5">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-row items-center justify-between space-x-6"
        >
          <div className="w-full">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Nowa wiadomość</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>
                  <FormDescription>Wpisz treść wiadomości</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button className="mb-2" type="submit" disabled={sending}>
            {sending ? "Wysyłanie..." : "Wyślij"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default NewMessage;
