import { io as Client } from "socket.io-client";
import { httpServer } from "../../index";
import { redisConnection } from "../../config/redis-connection";
import { NotificationRepository } from "../../repositories/notification.repository";
import { UserRepository } from "../../repositories/user.repository";
import { getIO } from "../../socket/socket";
import { AppDataSource } from "../../data-source";
import { User } from "../../databases/entity/User";

let clientSocket: any;

beforeAll(async () => {
  await AppDataSource.initialize();

  httpServer.listen(4000, () => {
    console.log("Server is listening on port 4000");
  });
});

afterAll(async () => {
  await clientSocket.close();
  httpServer.close();
  await redisConnection.quit();
  await AppDataSource.destroy();
});

describe("Notification Emission", () => {
  let notificationRepository: NotificationRepository;
  let userRepository: UserRepository;

  beforeEach(() => {
    notificationRepository = new NotificationRepository(getIO());
    userRepository = new UserRepository();
  });

  it("should emit a notification to the correct user channel", async () => {
    const user = await AppDataSource.getRepository(User).save({name: "Shree", email: "sh@gmail.com", password: "Pass", "role": "admin"});
    const receiver = await AppDataSource.getRepository(User).save({name: "Neve", email: "ne@gmail.com", password: "Pass", "role": "admin"});
    const userId = user.id;
    const receiverId = receiver.id;
    const mockIncident = { id: '123' };
    const notificationType = 'newIncident';

    clientSocket = Client("http://localhost:4000");

    clientSocket.on('connect', () => {
      expect(clientSocket.connected).toBe(true);
      console.log("Client connected:", clientSocket.id);

      clientSocket.emit('joinChannel', receiverId);

      clientSocket.on('newNotification', (notification) => {
        expect(notification.title).toBe('New incident reported');
        expect(notification.description).toMatch(/created an incident of/);
        console.log("Notification received on client:", notification);

        clientSocket.disconnect();
        expect(clientSocket.connected).toBe(false);
      });

      notificationRepository.createNotification(notificationType, mockIncident, Number(userId))
        .then(() => {
          console.log("Notification emitted");
        })
        .catch((err) => {
          console.error('Error creating notification:', err);
        });
    });

    clientSocket.on('connect_error', (err) => {
      console.error('Connection error:', err);
    });
  });
});
