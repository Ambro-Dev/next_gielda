import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import React from "react";
import { ExtendedTransport } from "../../page";
import Chat from "./chat";
import NewMessage from "./new-meesage";
import { axiosInstance } from "@/lib/axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package } from "lucide-react";

type Props = {
  params: {
    conversationId: string;
  };
};

const getConversations = async (
  conversationId: string
): Promise<ExtendedConversation> => {
  try {
    const response = await axiosInstance.get(
      `/api/messages/conversation?conversationId=${conversationId}`
    );
    const data = response.data;
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

  return (
    <div className="flex flex-col space-y-8">
      <div className="px-5 flex gap-4 flex-wrap items-center justify-around">
        <Link href="/user/market/messages">
          <Button variant="ghost">
            <ArrowLeft size={24} />
            <span className="pl-2">Wszystkie rozmowy</span>
          </Button>
        </Link>
        <h3 className="text-lg font-bold">Rozmowa z {otherUser?.username}</h3>
        <Link href={`/transport/${conversation.transport.id}`}>
          <Button variant="ghost">
            Przejdź do ogłoszenia <Package size={24} className="ml-2" />
          </Button>
        </Link>
      </div>
      <Chat messages={conversation.messages} />
      <NewMessage conversation={conversation} />
    </div>
  );
};

export default ConversationPage;
