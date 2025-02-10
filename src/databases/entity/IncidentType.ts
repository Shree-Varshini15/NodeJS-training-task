import { Length } from "class-validator";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Incident } from "./Incident";

@Entity()
export class IncidentType {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  @Length(3,50)
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Incident, (incident) => incident.incidentType)
  incidents: Incident[];
}