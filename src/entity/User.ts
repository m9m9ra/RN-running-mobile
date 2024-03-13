import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class User {
    @PrimaryColumn({unique: true})
    auth: boolean

    @Column({nullable: true})
    height: number

    @Column({nullable: true})
    weight: number

    @Column({nullable: true})
    firstName: string

    @Column({nullable: true})
    lastName: string

    @Column({nullable: true})
    phone: string

    @Column({nullable: true})
    token: string

    @Column({nullable: true})
    avatar: string
}