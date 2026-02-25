"use client";

import { useMessages } from "@/app/context/message-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
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

const formatDateLabel = (dateStr: string, today: string, yesterday: string) => {
  if (dateStr === today) return "Dzisiaj";
  if (dateStr === yesterday) return "Wczoraj";
  return new Date(dateStr).toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const Chat = (props: Props) => {
  const { data } = useSession();
  const user = data?.user?.id;

  const newMessages = props.messages;
  const { setMessages, messages } = useMessages();

  const chatRef = React.useRef<HTMLDivElement>(null);
  const bottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!chatRef.current || !bottomRef.current) return;

    const messagesToRemove = messages.filter((message) => {
      const isMessageInNewMessages = newMessages.find(
        (newMessage) => newMessage.id === message.id
      );
      return !isMessageInNewMessages;
    });

    setMessages(messagesToRemove);

    chatRef.current.scrollTop = bottomRef.current.offsetTop;
  }, [props.messages]);

  const today = new Date().toLocaleDateString();
  const yesterday = new Date(
    new Date().setDate(new Date().getDate() - 1)
  ).toLocaleDateString();

  // Group messages by date for date separators
  let lastDate = "";

  return (
    <div
      ref={chatRef}
      className="flex-1 overflow-auto px-4 py-4 space-y-1 bg-gray-50/30"
    >
      {props.messages.map((message) => {
        const isUser = message.sender.id === user;
        const messageDate = new Date(message.createdAt).toLocaleDateString();
        const hourAndMinute = new Intl.DateTimeFormat("pl", {
          hour: "numeric",
          minute: "numeric",
        }).format(new Date(message.createdAt));

        const showDateSeparator = messageDate !== lastDate;
        lastDate = messageDate;

        return (
          <React.Fragment key={message.id}>
            {showDateSeparator && (
              <div className="flex items-center justify-center py-3">
                <span className="text-[11px] text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-100">
                  {formatDateLabel(messageDate, today, yesterday)}
                </span>
              </div>
            )}

            <div
              className={`flex ${isUser ? "justify-end" : "justify-start"} gap-2 mb-1`}
            >
              {!isUser && (
                <Avatar className="h-7 w-7 flex-shrink-0 mt-1">
                  <AvatarFallback className="uppercase text-[10px] bg-primary/10 text-primary font-semibold">
                    {message.sender.username.substring(0, 1)}
                  </AvatarFallback>
                </Avatar>
              )}

              <div className={`max-w-[75%] ${isUser ? "text-right" : ""}`}>
                {!isUser && (
                  <div className="text-[11px] text-gray-400 mb-0.5 ml-1">
                    {message.sender.username}
                  </div>
                )}
                <div
                  className={`inline-block px-3 py-2 text-sm leading-relaxed ${
                    isUser
                      ? "bg-primary text-white rounded-2xl rounded-br-md"
                      : "bg-white text-gray-900 border border-gray-100 rounded-2xl rounded-bl-md"
                  }`}
                >
                  {message.text}
                </div>
                <div
                  className={`text-[10px] text-gray-400 mt-0.5 ${isUser ? "mr-1" : "ml-1"}`}
                >
                  {hourAndMinute}
                </div>
              </div>
            </div>
          </React.Fragment>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
};

export default Chat;
