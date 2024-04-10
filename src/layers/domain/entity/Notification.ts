import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: true})
    message: string

    @Column({default: false})
    viewed: boolean
}