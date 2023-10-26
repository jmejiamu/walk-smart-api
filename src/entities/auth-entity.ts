import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Event } from "./event-entity";


@Entity("register")
export class Register extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fullName: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @OneToMany(() => Event, (event) => event.register)
    events: Event[];

    register:Register;
}

@Entity("signin")
export class Signin extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number; 

    @Column()
    email: string;

    @Column()
    password: string;

    @OneToMany(()=> Register, (reg) => reg.register)
    signin: Signin;
}