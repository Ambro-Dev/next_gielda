"use client";

import React from "react";
import { ExtendedConversation } from "./page";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/axios";
import { useSocket } from "@/app/context/socket-provider";
import { toast } from "@/components/ui/use-toast";
import { Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  message: z.string().min(1, "Wiadomość nie może być pusta"),
});

type Props = {
  conversation: ExtendedConversation;
};

const NewMessage = (props: Props) => {
  const { data } = useSession();
  const [sending, setSending] = React.useState(false);
  const { socket } = useSocket();

  const router = useRouter();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      message: "",
    },
  });

  React.useEffect(() => {
    if (!socket) return;

    socket.on(`conversation:${props.conversation.id}:message`, () => {
      router.refresh();
    });

    return () => {
      socket.off(`conversation:${props.conversation.id}:message`);
    };
  }, [socket]);

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      setSending(true);
      const response = await axiosInstance.post(`/api/socket/messages`, {
        conversationId: props.conversation.id,
        message: values.message,
        senderId: data?.user?.id,
      });

      if (response.status === 201) {
        form.reset();
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Błąd",
        description: "Nie udało się wysłać wiadomości",
        variant: "destructive",
      });
    }
    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white px-4 py-3">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-end gap-2"
        >
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="flex-1 space-y-0">
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Napisz wiadomość..."
                    className="min-h-[40px] max-h-[120px] resize-none text-sm border-gray-200 focus-visible:ring-primary/20"
                    rows={1}
                    onKeyDown={handleKeyDown}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            size="icon"
            disabled={sending}
            className="h-10 w-10 flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default NewMessage;
