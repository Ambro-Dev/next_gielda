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
import { ToastAction } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
  const [alert, setAlert] = React.useState({ error: "", conversation: "" });
  const [showAlert, setShowAlert] = React.useState(false);
  const { toast } = useToast();
  const { data, status } = useSession();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const alertBox = (
    <div className="alert alert-error">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="stroke-current shrink-0 h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{alert.error}</span>
      <Link href={`/user/market/messages/${alert.conversation}`}>
        Przejdź do konwersacji
      </Link>
    </div>
  );

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
        action: (
          <ToastAction
            altText="Przejdź do wiadomości"
            onClick={() =>
              router.push(
                `/user/market/messages/${response.data.conversationId}`
              )
            }
          >
            Przejdź do wiadomości
          </ToastAction>
        ),
      });
    } else if (response.data.status === 409) {
      setAlert({
        error: response.data.error,
        conversation: response.data.conversationId,
      });
      setShowAlert(true);
    } else {
      toast({
        title: "Wystąpił błąd",
        description: "Nie udało się wysłać wiadomości",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      {showAlert && alertBox}
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
