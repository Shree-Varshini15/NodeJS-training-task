import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";
import { IncidentStatus } from "../../enums/incident.enum";
import { IncidentType } from "./IncidentType";

@Entity({ name: "incidents" })
export class Incident {
  @PrimaryGeneratedColumn()
  id: string;

  @Column("varchar")
  name: string;

  @Column({type: "varchar", nullable: true})
  location: string;

  @Column({ type: 'varchar', nullable: true})
  latitude: string;

  @Column({ type: 'varchar', nullable: true})
  longitude: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  reportedAt: Date;

  @Column({
    type: "enum",
    enum: IncidentStatus,
    default: IncidentStatus.PENDING,
  })
  status: IncidentStatus;

  @Column({type: "varchar", nullable: true})
  description: string;

  @ManyToOne(() => IncidentType, (incidentType) => incidentType.incidents, { onDelete: 'CASCADE' })
  incidentType: IncidentType;
}