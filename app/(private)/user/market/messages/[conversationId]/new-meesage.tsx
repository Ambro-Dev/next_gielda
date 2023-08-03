"use client";

import React from "react";
import { ExtendedConversation } from "./page";

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
  conversation: ExtendedConversation;
};

const NewMessage = (props: Props) => {
  const { data, status } = useSession();

  const router = useRouter();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      const response = await axiosInstance.post(
        `/api/messages/conversation/message`,
        {
          conversationId: props.conversation.id,
          message: values.message,
          userId: data?.user?.id,
          transportId: props.conversation.transport.id,
        }
      );

      const resData = response.data;
      if (resData.status === 200) {
        form.reset();
        router.refresh();
      }
    } catch (error) {
      console.log(error);
      throw new Error("Nie udało się wysłać wiadomości");
    }
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

          <Button className="mb-2" type="submit">
            Wyślij
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default NewMessage;
