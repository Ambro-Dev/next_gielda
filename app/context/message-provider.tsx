"use client";

import { axiosInstance } from "@/lib/axios";
import { Message, Report } from "@prisma/client";
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
  reports: Report[];
  setReports: React.Dispatch<React.SetStateAction<Report[]>>;
};

const MessagesContext = createContext<MessagesContextType>({
  messages: [],
  setMessages(): void {},
  offers: [],
  setOffers(): void {},
  offerMessages: [],
  setOfferMessages(): void {},
  reports: [],
  setReports(): void {},
});

const getMessages = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`/api/messages?userId=${userId}`);
    const messages = response.data;
    return messages || [];
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
};

const getReports = async () => {
  try {
    const response = await axiosInstance.get("/api/report");
    const reports = response.data.reports;
    return reports || [];
  } catch (error) {
    console.error('Error fetching reports:', error);
    return [];
  }
};

export const useMessages = () => useContext(MessagesContext);

const MessageProvider = ({ children }: { children: React.ReactNode }) => {
  const { data } = useSession();
  const [offerMessages, setOfferMessages] = useState<MessageWithUser[]>([]);
  const [messages, setMessages] = useState<MessageWithUser[]>([]);
  const [offers, setOffers] = useState<OfferWithUser[]>([]);
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    if (!data?.user?.id) return;
    getMessages(String(data.user.id)).then((messages) => {
      if (messages && Array.isArray(messages)) {
        setMessages(
          messages.map((message: any) => ({
            ...message,
            sender: message.sender,
            receiver: {
              id: data?.user?.id,
              username: data?.user?.username,
              email: data?.user?.email,
            },
          }))
        );
      }
    }).catch((error) => {
      console.error('Error fetching messages:', error);
      setMessages([]);
    });
    
    if (data?.user?.role === "admin") {
      getReports().then((reports) => {
        if (reports && Array.isArray(reports)) {
          const unseenReports = reports.filter(
            (report: Report) => !report.seen
          );
          setReports(unseenReports);
        }
      }).catch((error) => {
        console.error('Error fetching reports:', error);
        setReports([]);
      });
    }
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
        reports,
        setReports,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
};

export default MessageProvider;
