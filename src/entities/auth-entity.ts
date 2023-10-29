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
    username: string;

    @OneToMany(() => Signin, (signin) => signin.signin)
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
    username: string; 

    @Column()
    password: string;

    @OneToMany(()=> Register, (reg) => reg.register)
    signin: Signin;
}