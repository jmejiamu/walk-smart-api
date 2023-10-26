import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { Register } from "./auth-entity";

@Entity("users_events")
export class Event extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  latitude: string;

  @Column()
  longitude: string;

  @Column()
  eventTitle: string;

  @Column()
  eventDescription: string;

  @CreateDateColumn()
  timeStamp: Date;


  @ManyToOne(() => Register, (register) => register.events)
  register: Register;
}
