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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  const [dialogOpen, setDialogOpen] = React.useState(false);
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
    <div className="flex items-center gap-3 p-4 rounded-lg border border-red-200 bg-red-50 text-red-800 text-sm">
      <span>{alert.error}</span>
      <Link href={`/user/market/messages/${alert.conversation}`} className="underline font-medium">
        Przejdź do konwersacji
      </Link>
    </div>
  );

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const newMessage = {
        message: values.message,
        senderId: data?.user?.id,
        receiverId: props.transportOwnerId,
        transportId: props.transportId,
      };
      const response = await axiosInstance.post(
        `/api/socket/messages`,
        newMessage
      );

      form.reset();
      toast({
        title: "Wiadomość została wysłana",
        description: "Twoja wiadomość została wysłana",
        action: (
          <ToastAction
            altText="Przejdź do wiadomości"
            onClick={() =>
              router.push(
                `/user/market/messages/${response.data.message.conversationId}`
              )
            }
          >
            Przejdź do wiadomości
          </ToastAction>
        ),
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Wystąpił błąd",
        description: "Nie udało się wysłać wiadomości",
        variant: "destructive",
      });
    } finally {
      setDialogOpen(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          Napisz wiadomość
        </Button>
      </DialogTrigger>

      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>Wiadomość</DialogTitle>
          <DialogDescription>
            Wpisz wiadomość, którą chcesz wysłać
          </DialogDescription>
        </DialogHeader>

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
      </DialogContent>
    </Dialog>
  );
};

export default MessageForm;
