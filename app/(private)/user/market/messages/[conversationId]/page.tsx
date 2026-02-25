import { auth } from "@/auth";
import React from "react";
import { ExtendedTransport } from "../../page";
import Chat from "./chat";
import NewMessage from "./new-meesage";
import { axiosInstance } from "@/lib/axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { redirect } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

type Props = {
  params: Promise<{
    conversationId: string;
  }>;
};

const getConversations = async (
  conversationId: string,
  userId: string
): Promise<ExtendedConversation> => {
  try {
    const response = await axiosInstance.get(
      `/api/messages/conversation?conversationId=${conversationId}&userId=${userId}`
    );
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    toast({
      title: "Wystąpił błąd",
      description: "Nie udało się pobrać rozmowy",
      variant: "destructive",
    });
    redirect("/user/market/messages");
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
  const { conversationId } = await props.params;
  const session = await auth();

  const conversation: ExtendedConversation = await getConversations(
    conversationId,
    String(session?.user.id)
  );

  const userInConversation = conversation.users.find(
    (user) => user.id === session?.user.id
  );

  if (!userInConversation) redirect("/user/market/messages");

  const otherUser = conversation.users.find(
    (user) => user.id !== session?.user.id
  );

  return (
    <div className="flex flex-col h-[calc(100vh-14rem)] max-h-[800px] border border-gray-200 rounded-lg overflow-hidden bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <Link href="/user/market/messages">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h3 className="text-sm font-semibold">{otherUser?.username}</h3>
            <p className="text-xs text-gray-500">Rozmowa prywatna</p>
          </div>
        </div>
        {conversation.transport && (
          <Link href={`/transport/${conversation.transport.id}`}>
            <Button variant="ghost" size="sm" className="text-xs gap-1.5 text-gray-500">
              Ogłoszenie
              <ExternalLink className="w-3 h-3" />
            </Button>
          </Link>
        )}
      </div>

      {/* Chat messages */}
      <Chat messages={conversation.messages} />

      {/* Message input */}
      <NewMessage conversation={conversation} />
    </div>
  );
};

export default ConversationPage;
