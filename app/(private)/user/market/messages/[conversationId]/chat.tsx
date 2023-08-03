import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getServerSession } from "next-auth";
import React from "react";

type Props = {
  messages: {
    id: string;
    createdAt: Date;
    text: string;
    sender: {
      id: string;
      username: string;
    };
  }[];
};

const timeFormat = new Intl.DateTimeFormat("pl", {
  hour: "numeric",
  minute: "numeric",
});

const Chat = async (props: Props) => {
  const session = await getServerSession(authOptions);
  const user = session?.user?.id;
  return (
    <div className="px-5">
      {props.messages.map((message) => {
        const isUser = message.sender.id === user;
        const time = timeFormat.format(new Date(message.createdAt));
        return (
          <div
            key={message.id}
            className={`chat ${isUser ? "chat-end" : "chat-start"}`}
          >
            <div className="chat-image avatar">
              <Avatar>
                <AvatarFallback className="uppercase">
                  {message.sender.username.substring(0, 1)}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="chat-header">
              {message.sender.username}
              <time className="text-xs opacity-50 p-1">{time}</time>
            </div>
            <div
              className={`chat-bubble text-black text-md ${
                isUser ? "chat-bubble-warning" : "bg-neutral-200"
              } `}
            >
              {message.text}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Chat;
