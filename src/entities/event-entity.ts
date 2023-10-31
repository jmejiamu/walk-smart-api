import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";

@Entity("events")
export class Events extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  event_id: string;

  @Column()
  user_id: number; 

  @Column()
  event_title: string;

  @Column()
  event_description: string;

  @CreateDateColumn()
  time_stamp: Date;

  @OneToMany(() => EventsLocations, (ELocation) => ELocation.event)
  EventLocations: EventsLocations[]; // Changed to match the entity name
}

@Entity("events_location")
export class EventsLocations extends BaseEntity {
  @Column()
  user_id: number;

  @PrimaryColumn()
  event_id: string;

  @Column()
  latitude: string;

  @Column()
  longitude: string;

  @CreateDateColumn()
  time_stamp: Date;

  @ManyToOne(() => Events, (events) => events.EventLocations) 
  event: Events; 
}

@Entity("joined_events")
export class JoinedEvents extends BaseEntity {
  @Column()
  user_id: number;

  @PrimaryColumn()
  event_id: string;

  @Column()
  joined: boolean;

  @Column()
  time_stamp: Date;

  @OneToMany(()=> JoinedEvents, (joinEvents) => joinEvents.event_id)
  JoinedEvents: JoinedEvents;
}