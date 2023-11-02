import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";


@Entity("register")
export class Register extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    user_id: string;

    @Column()
    fullName: string;

    @Column()
    email: string;

    @Column()
    username: string;

    @OneToMany(() => Signin, (signin) => signin.signin)
    register:Register;
}

@Entity("signin")
export class Signin extends BaseEntity {
    @PrimaryColumn('uuid')
    user_id: string; 

    @Column()
    email: string;

    @Column()
    username: string; 

    @Column()
    password: string;

    @OneToMany(()=> Register, (reg) => reg.register)
    signin: Signin;
}