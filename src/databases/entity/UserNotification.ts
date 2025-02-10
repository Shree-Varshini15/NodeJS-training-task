import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Notification } from "./Notification";

@Entity({ name: "user_notifications" })
export class UserNotification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userNotifications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Notification, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "notification_id" })
  notification: Notification;;

  @Column({ type: 'timestamp', nullable: true})
  read_at: Date;
}