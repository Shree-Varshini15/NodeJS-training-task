import { Server as SocketServer} from "socket.io";
import { Http2Server } from "http2";
import { IncomingMessage, Server, ServerResponse } from "http";

let io: SocketServer | undefined;

console.log('Socket.io logic is being initialized');

const socketServer = (server: Server<typeof IncomingMessage, typeof ServerResponse> | Http2Server) => {
  io = new SocketServer(server);
  io.on("connection", (socket) => {
    console.log('User connected:', socket.id);
  
    socket.on('joinChannel', (userId) => {
      socket.join(`user_${userId}_notifications`);
      console.log(`User ${userId} joined the notifications channel`);
    });
  
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  return io;
}

export const getIO = () => {
  if (!io) throw new Error("Socket.io server has not been initialized yet.");
  return io;
};

export default socketServer;