import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";

import { NextApiResponseServerIO } from "@/types";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    // Use the global io instance created by the custom server (server.js / server.prod.js)
    if ((global as any).io) {
      res.socket.server.io = (global as any).io;
    } else {
      // Fallback: create a new Socket.IO instance if not running via custom server
      const path = "/api/socket/io";
      const httpServer: NetServer = res.socket.server as any;
      const io = new ServerIO(httpServer, {
        path: path,
        addTrailingSlash: false,
      });
      res.socket.server.io = io;
    }
  }
  res.end();
};

export default ioHandler;
