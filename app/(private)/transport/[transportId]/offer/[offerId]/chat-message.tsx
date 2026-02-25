import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  message: {
    id: string;
    text: string;
    createdAt: Date;
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
  };
  user: string;
  className?: string;
};

const ChatMessage = (props: Props) => {
  const { message, user, className } = props;
  const isUser = message.sender.id === user;
  const hourAndMinute = new Intl.DateTimeFormat("pl", {
    hour: "numeric",
    minute: "numeric",
  }).format(new Date(message.createdAt));
  const today = new Date().toLocaleDateString();
  const yesterday = new Date(
    new Date().setDate(new Date().getDate() - 1)
  ).toLocaleDateString();
  const date = new Date(message.createdAt).toLocaleDateString();
  return (
    <div
      className={cn(
        `flex ${isUser ? "justify-end" : "justify-start"} gap-2 mb-3`,
        className
      )}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback className="uppercase text-xs">
            {message.sender.username.substring(0, 1)}
          </AvatarFallback>
        </Avatar>
      )}

      <div className={`max-w-[75%] ${isUser ? "text-right" : ""}`}>
        <div className="text-xs text-gray-500 mb-0.5">
          {message.sender.username}
          <span className="ml-1.5 opacity-70">
            {date === today ? "Dzisiaj" : date === yesterday ? "Wczoraj" : date}
            , {hourAndMinute}
          </span>
        </div>
        <div
          className={`inline-block px-3 py-2 rounded-lg text-sm ${
            isUser
              ? "bg-gray-900 text-white rounded-br-sm"
              : "bg-gray-100 text-gray-900 rounded-bl-sm"
          }`}
        >
          {message.text}
        </div>
      </div>

      {isUser && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback className="uppercase text-xs">
            {message.sender.username.substring(0, 1)}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
