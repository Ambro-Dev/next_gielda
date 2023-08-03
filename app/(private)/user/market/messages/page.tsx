import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import React from "react";
import { ExtendedTransport } from "../page";
import { MessagesTable } from "./messages-table";
import { axiosInstance } from "@/lib/axios";

type Props = {};

const getConversations = async (
  userId: string
): Promise<ExtendedConversation[]> => {
  try {
    const response = await axiosInstance.get(
      `/api/messages/user?userId=${userId}`
    );
    const data = response.data;
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export type ExtendedConversation = {
  id: string;
  transport: ExtendedTransport;
  messages: {
    id: string;
    createdAt: Date;
    text: string;
    sender: {
      id: string;
      username: string;
    };
  }[];
  users: {
    id: string;
    username: string;
  }[];
};

const MarketMessages = async (props: Props) => {
  const session = await getServerSession(authOptions);
  const conversations: ExtendedConversation[] = await getConversations(
    String(session?.user?.id)
  );
  return (
    <div>
      <MessagesTable data={conversations} />
    </div>
  );
};

export default MarketMessages;
