import 'reflect-metadata'
import { Repository } from "typeorm";
import { Notification } from "../databases/entity/Notification";
import { AppDataSource } from "../data-source";
import { Incident } from "../databases/entity/Incident";
import { User } from "../databases/entity/User";
import { UserRepository } from "./user.repository";
import { UserNotification } from '../databases/entity/UserNotification';
import { Server } from 'socket.io';

export class NotificationRepository {
  private notificationRepository: Repository<Notification>;
  private userRepository;
  private userNotificationRepository: Repository<UserNotification>;
  private io: Server;

  constructor(io?: Server) {
    this.notificationRepository = AppDataSource.getRepository(Notification);
    this.userNotificationRepository = AppDataSource.getRepository(UserNotification);
    this.userRepository = new UserRepository();
    this.io = io;
  }

  private notificationTypeToBodyMappings = {
    newIncident: async (sender: User, associatedIncident: Incident) => ({
      title: `New incident reported`,
      description: `${sender.name} created an incident of ${associatedIncident?.incidentType?.name}`,
      receivers: (await this.userRepository.findAll()).filter((receiver: User) => receiver.id !== sender.id)
    })
  };

  async createNotification(type: string, resource: Partial<Incident>, sender_id: number, receiver_type?: string[]) {
    const sender = await this.userRepository.findById(sender_id);

    if (!sender) throw new Error(`User with id ${sender_id} not found`);

    const notificationMapping = this.notificationTypeToBodyMappings[type];
    if (!notificationMapping) throw new Error(`Notification type ${type} is not supported`);

    const { title, description, receivers } = await notificationMapping(sender, resource);

    const notification = new Notification();
    notification.title = title;
    notification.description = description;
    notification.sender = sender;

    const savedNotification = await this.notificationRepository.save(notification);

    for (const receiver of receivers) {
      const userNotification = new UserNotification();
      userNotification.user = receiver;
      userNotification.notification = savedNotification;

      await this.userNotificationRepository.save(userNotification);

      const socketChannel = `user_${receiver.id}_notifications`;
      this.io.to(socketChannel).emit('newNotification', savedNotification);
    }
  }
}