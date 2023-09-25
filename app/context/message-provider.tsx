"use client";

import { Message } from "@prisma/client";
import React, { createContext, useContext, useState } from "react";

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

export const useMessages = () => useContext(MessagesContext);

const MessageProvider = ({ children }: { children: React.ReactNode }) => {
  const [offerMessages, setOfferMessages] = useState<MessageWithUser[]>([]);
  const [messages, setMessages] = useState<MessageWithUser[]>([]);
  const [offers, setOffers] = useState<OfferWithUser[]>([]);

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
