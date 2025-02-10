import { io as Client } from "socket.io-client";
import { ioSocket as serverSocket, httpServer } from "../../index";
import { redisConnection } from "../../config/redis-connection";

let clientSocket: any;

beforeAll((done) => {
  httpServer.listen(4000, () => {
    console.log("Server is listening on port 4000");
    done();
  });
});

afterAll((done) => {
  clientSocket.close();
  serverSocket.close();
  httpServer.close(() => {
    done();
  });
  redisConnection.quit();
});

describe("Socket.io Connection and Disconnection", () => {
  it("should connect and disconnect socket client", (done) => {
    clientSocket = Client("http://localhost:4000");

    clientSocket.on('connect', () => {
      expect(clientSocket.connected).toBe(true);
      console.log("Client connected:", clientSocket.id);

      clientSocket.emit('joinChannel', 123);

      setTimeout(() => {
        clientSocket.disconnect();
        expect(clientSocket.connected).toBe(false);
        done();
      }, 500);
    });

    clientSocket.on('connect_error', (err) => {
      console.error('Connection error:', err);
      done(err);
    });
  });
});