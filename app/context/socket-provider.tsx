"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Message } from "@prisma/client";
import { MoveRight } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, {
  createContext,
  use,
  useContext,
  useEffect,
  useState,
} from "react";

import { io as ClinetIO } from "socket.io-client";
import { useMessages } from "./message-provider";

type SocketContextType = {
  socket: any | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

type MessageWithUser = Message & {
  sender: {
    id: string;
    username: string;
    email: string;
  };
  receiver: {
    id: string;
    username: string;
    email: string;
  };
  conversation?: {
    id: string;
  };
  offer?: {
    id: string;
    creator: { id: string };
  };
  transport?: {
    id: string;
    creator: { id: string };
  };
};

type OfferWithUser = {
  id: string;
  createdAt: string;
  text: string;
  sender: {
    id: string;
    username: string;
    email: string;
  };
  receiver: {
    id: string;
    username: string;
    email: string;
  };
  transport: {
    id: string;
  };
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();
  const [socket, setSocket] = useState<any>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const params = useParams();
  const { setMessages, setOffers, setOfferMessages } = useMessages();

  const { data, status } = useSession();

  const userId = data?.user?.id;

  useEffect(() => {
    if (!userId) return;

    const socketInstance = new (ClinetIO as any)(
      process.env.NEXTAUTH_PUBLIC_SITE_URL!,
      {
        path: "/api/socket/io",
        addTrailingSlash: false,
      }
    );

    socketInstance.on("connect", () => {
      setIsConnected(true);
    });

    socketInstance.on(`user:${userId}:message`, (message: MessageWithUser) => {
      if (message?.sender?.id === userId) return;

      if (
        message?.conversation?.id &&
        message?.conversation?.id === params?.conversationId
      )
        return;
      if (message?.offer?.id && message?.offer?.id === params?.offerId) return;
      const audio = new Audio(
        "https://drive.google.com/uc?export=download&id=1M95VOpto1cQ4FQHzNBaLf0WFQglrtWi7"
      );

      if (message?.conversation?.id) {
        setMessages((prev) => [...prev, message]);
      } else if (message?.offer?.id) {
        setOfferMessages((prev) => [...prev, message]);
      }
      audio.play();
      toast({
        title: `Nowa wiadomość od ${message?.sender?.username}, ${new Date(
          message?.createdAt
        ).toLocaleTimeString()}`,
        description: message?.text,
        action: (
          <Link
            href={
              message.conversation?.id
                ? `/user/market/messages/${message?.conversation?.id}`
                : `/transport/${message?.transport?.id}/offer/${message?.offer?.id}`
            }
          >
            <Button variant="outline">
              Otwórz
              <MoveRight className="ml-2" size={16} />
            </Button>
          </Link>
        ),
      });
    });

    socketInstance.on(`user:${userId}:offer`, (offer: OfferWithUser) => {
      if (offer?.sender?.id === userId) return;
      setOffers((prev) => [...prev, offer]);
      if (offer?.id && offer?.id === params?.offerId) return;
      const audio = new Audio(
        "https://drive.google.com/uc?export=download&id=1M95VOpto1cQ4FQHzNBaLf0WFQglrtWi7"
      );
      audio.play();
      toast({
        title: `Nowa oferta od ${offer?.sender?.username}, ${new Date(
          offer?.createdAt
        ).toLocaleTimeString()}`,
        description: offer?.text,
        action: (
          <Link href={`/transport/${offer?.transport?.id}/offer/${offer?.id}`}>
            <Button variant="outline">
              Otwórz
              <MoveRight className="ml-2" size={16} />
            </Button>
          </Link>
        ),
      });
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.off(`user:${userId}:message`);
      socketInstance.disconnect();
    };
  }, [userId]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
