import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { UserNotification } from "./UserNotification";

@Entity({ name: "notifications"})
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar'})
  title: string;

  @Column({ type: 'varchar' })
  description: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "sender_id" })
  sender: User;

  @OneToMany(() => UserNotification, (userNotification) => userNotification.notification)
  userNotifications: UserNotification[];
}