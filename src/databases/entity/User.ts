import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
  } from "typeorm";
import { IsEmail, Length } from 'class-validator';
import { UserRoles } from "../../enums/user.enum";
import { Notification } from "./Notification";
import { UserNotification } from "./UserNotification";

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ type: 'varchar', length: 50, nullable: false })
    @Length(3, 50)
    name: string;

    @Column({ 
      type: 'varchar', 
      length: 255, 
      nullable: false, 
      unique: true  
    })
    @IsEmail({})
    email: string;

    @Column({ 
      type: 'varchar', 
      length: 255, 
      nullable: false, 
    })
    @Length(8, 255)
    password: string;

    @Column({
      type: 'varchar',
      default: UserRoles.FIRE_FIGHTER,
      enum: UserRoles,
    })
    role!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToMany(() => UserNotification, (userNotification) => userNotification.user)
    userNotifications: UserNotification[];
}