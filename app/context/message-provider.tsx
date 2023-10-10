"use client";

import { axiosInstance } from "@/lib/axios";
import { Message } from "@prisma/client";
import { useSession } from "next-auth/react";
import React, { createContext, useContext, useEffect, useState } from "react";

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

type MessagesContextType = {
  messages: MessageWithUser[];
  setMessages: React.Dispatch<React.SetStateAction<MessageWithUser[]>>;
  offers: OfferWithUser[];
  setOffers: React.Dispatch<React.SetStateAction<OfferWithUser[]>>;
  offerMessages: MessageWithUser[];
  setOfferMessages: React.Dispatch<React.SetStateAction<MessageWithUser[]>>;
};

const MessagesContext = createContext<MessagesContextType>({
  messages: [],
  setMessages(): void {},
  offers: [],
  setOffers(): void {},
  offerMessages: [],
  setOfferMessages(): void {},
});

const getMessages = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`/api/messages?userId=${userId}`);
    const messages = response.data;
    return messages;
  } catch (error) {
    console.error(error);
  }
};

export const useMessages = () => useContext(MessagesContext);

const MessageProvider = ({ children }: { children: React.ReactNode }) => {
  const { data } = useSession();
  const [offerMessages, setOfferMessages] = useState<MessageWithUser[]>([]);
  const [messages, setMessages] = useState<MessageWithUser[]>([]);
  const [offers, setOffers] = useState<OfferWithUser[]>([]);

  useEffect(() => {
    if (!data?.user?.id) return;
    getMessages(String(data.user.id)).then((messages) => {
      setMessages(
        messages.map((message: any) => ({
          id: message.id,
          createdAt: message.createdAt,
          text: message.text,
          sender: message.sender,
          conversation: message.conversation,
          receiver: {
            id: data?.user?.id,
            username: data?.user?.username,
            email: data?.user?.email,
          },
        }))
      );
    });
  }, [data?.user?.id]);

  return (
    <MessagesContext.Provider
      value={{
        offerMessages,
        setOfferMessages,
        offers,
        setOffers,
        messages,
        setMessages,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
};

export default MessageProvider;
