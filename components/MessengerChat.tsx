"use client";

import { MessengerChat } from "react-messenger-chat-plugin";

const MessengerChatBox = (props: any) => {
  return (
    <MessengerChat
      pageId="104411836066567"
      language="pl_PL"
      themeColor="#FF5CA1"
      loggedInGreeting="Cześć! W czym możemy Ci pomóc?"
      loggedOutGreeting="Cześć! W czym możemy Ci pomóc?"
    />
  );
};

export default MessengerChatBox;
