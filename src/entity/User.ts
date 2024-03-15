import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class User {
    @PrimaryColumn({unique: true})
    auth?: boolean

    @Column({nullable: true})
    guest?: boolean

    @Column({nullable: true})
    firstName: string

    @Column({nullable: true})
    lastName: string

    @Column({nullable: false, enum: [`MALE`, `FEMALE`, `NOT_SAY`]})
    gender: string

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