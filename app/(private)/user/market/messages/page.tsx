import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import React from "react";
import { ExtendedTransport } from "../page";
import { MessagesTable } from "./messages-table";

type Props = {};

const getConversations = async (userId: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/messages/user?userId=${userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (response.ok) {
    const data = await response.json();
    return data;
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
  console.log(conversations);
  return (
    <div>
      <MessagesTable data={conversations} />
    </div>
  );
};

export default MarketMessages;
