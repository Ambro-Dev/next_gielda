"use client";

import { useSocket } from "@/app/context/socket-provider";
import { Badge } from "@/components/ui/badge";

export const SocketIndicator = () => {
  const { isConnected } = useSocket();

  return (
    <>
      <Badge
        variant={isConnected ? "default" : "destructive"}
        className={`text-xs ${isConnected && "bg-green-500"}`}
      >
        {isConnected ? "Połączono" : "Rozłączono"}
      </Badge>
    </>
  );
};
