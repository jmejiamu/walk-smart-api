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

  @Column("uuid")
  user_id: string;

  @Column()
  user_name: string;

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
  @Column("uuid")
  user_id: string;

  @PrimaryColumn("uuid")
  event_id: string;

  @Column("real")
  latitude: number;

  @Column("real")
  longitude: number;

  @CreateDateColumn()
  time_stamp: Date;

  @ManyToOne(() => Events, (events) => events.EventLocations)
  event: Events;
}

@Entity("joined_events")
export class JoinedEvents extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  join_id: string;

  @Column("uuid")
  user_id: string;

  @Column()
  user_name: string;

  @Column("uuid")
  event_id: string;

  @Column("bool")
  joined: boolean;

  @OneToMany(() => EventsLocations, (ELocations) => ELocations.user_id)
  EventsLocations: EventsLocations[];

  @OneToMany(() => Events, (events) => events.event_id)
  Events: Events[];
}

@Entity("joined_counter")
export class JoinedCounter extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  joined_id: string;

  @Column("uuid")
  user_id: string; // created by user id

  @Column("uuid")
  event_id: string;

  @Column("int", { default: 0 })
  counter: number = 0;

  @OneToMany(() => JoinedEvents, (JoinedEvents) => JoinedEvents.event_id)
  JoinedEvents: JoinedEvents[];
}
