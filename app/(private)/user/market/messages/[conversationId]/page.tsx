import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import React from "react";
import { ExtendedTransport } from "../../page";
import Chat from "./chat";
import NewMessage from "./new-meesage";
import { ArrowLeft, MoveLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = {
  params: {
    conversationId: string;
  };
};

const getConversations = async (
  conversationId: string
): Promise<ExtendedConversation> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/messages/conversation?conversationId=${conversationId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-cache",
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Nie udało się pobrać konwersacji");
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

const ConversationPage = async (props: Props) => {
  const session = await getServerSession(authOptions);
  const conversation: ExtendedConversation = await getConversations(
    String(props.params.conversationId)
  );

  const otherUser = conversation.users.find(
    (user) => user.id !== session?.user.id
  );

  console.log(conversation);
  return (
    <div className="flex flex-col space-y-8">
      <div className="px-5 flex space-x-4 flex-row items-center">
        <Link href="/user/market/messages">
          <Button variant="ghost">
            <ArrowLeft size={24} />
            <span className="pl-2">Powrót</span>
          </Button>
        </Link>

        <h3 className="text-xl font-bold">Rozmowa z {otherUser?.username}</h3>
      </div>
      <Chat messages={conversation.messages} />
      <NewMessage conversation={conversation} />
    </div>
  );
};

export default ConversationPage;
