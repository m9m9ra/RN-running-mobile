import {Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import { Activity } from "./Activity";
import { Training } from "./Training";

@Entity()
export class User {
    @PrimaryColumn({default: false})
    auth?: boolean

    @Column({nullable: true})
    user_id?: number

    @Column({nullable: true})
    guest?: boolean

    @Column({nullable: true})
    firstName: string

    @Column({nullable: true})
    lastName: string

    @Column({nullable: false, enum: [`MALE`, `FEMALE`, `NOT_SAY`]})
    gender: string

    @OneToMany(() => Activity, (activity) => activity.user_id)
    activity?: Activity[]

    @OneToMany(() => Training, (training) => training.user_id)
    training?: Training[]

    @Column({nullable: false})
    email: string

    @Column({nullable: true})
    password: string

    @Column({nullable: true})
    birthdate: string

    @Column({nullable: true})
    policy: boolean

    @Column({nullable: true})
    height?: number

    @Column({nullable: true})
    weight?: number

    @Column({nullable: true})
    phone?: string

    @Column({nullable: true})
    token?: string

    @Column({nullable: true})
    avatar?: string
}