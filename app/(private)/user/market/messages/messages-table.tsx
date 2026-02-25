"use client";

import { Button } from "@/components/ui/button";
import { ExtendedConversation } from "./page";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import { useMessages } from "@/app/context/message-provider";

export function MessagesTable({
  data,
  userId,
}: {
  data: ExtendedConversation[];
  userId: string;
}) {
  const { messages } = useMessages();

  if (!data?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <MessageCircle className="w-10 h-10 mb-3" />
        <p className="text-sm">Brak wiadomości</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.map((item) => {
        const otherUser = item.users.filter((user) => user.id !== userId)[0];
        const lastMessage = item.messages[item.messages.length - 1];
        const hasNew = messages?.find(
          (message) => message.conversation?.id === item.id
        );

        return (
          <Link
            key={item.id}
            href={`/user/market/messages/${item.id}`}
            className="block"
          >
            <div
              className={`border border-gray-200 rounded-lg p-4 hover:bg-gray-50/50 transition-colors ${
                hasNew ? "border-primary/30 bg-primary/5" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarFallback className="text-sm">
                    {otherUser?.username?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium">
                      {otherUser?.username}
                    </span>
                    {hasNew && (
                      <Badge variant="destructive" className="text-xs">
                        Nowa
                      </Badge>
                    )}
                  </div>
                  <p
                    className={`text-sm line-clamp-1 ${
                      hasNew
                        ? "font-medium text-gray-900"
                        : "text-gray-500"
                    }`}
                  >
                    {lastMessage?.text}
                  </p>
                  {item.transport && (
                    <p className="text-xs text-gray-400 mt-1">
                      Dotyczy ogłoszenia
                    </p>
                  )}
                </div>

                <Button variant="outline" size="sm" className="flex-shrink-0">
                  Odpowiedz
                </Button>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
