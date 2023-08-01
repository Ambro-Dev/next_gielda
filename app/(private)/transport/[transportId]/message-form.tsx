"use client";

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
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { axiosInstance } from "@/lib/axios";

type Props = {
  transportId: string;
  transportOwnerId: string;
};

const formSchema = z.object({
  message: z.string().nonempty({
    message: "Wiadomość nie może być pusta",
  }),
});

const MessageForm = (props: Props) => {
  const { toast } = useToast();
  const { data, status } = useSession();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const newMessage = {
      message: values.message,
      senderId: data?.user?.id,
      receiverId: props.transportOwnerId,
      transportId: props.transportId,
    };
    const response = await axiosInstance.post(
      `/api/messages/message`,
      newMessage
    );
    if (response.data.status === 200) {
      form.reset();
      toast({
        title: "Wiadomość została wysłana",
        description: "Twoja wiadomość została wysłana",
      });
    } else {
      toast({
        title: "Wystąpił błąd",
        description: "Nie udało się wysłać wiadomości",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Treść*</FormLabel>
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

export default MessageForm;
