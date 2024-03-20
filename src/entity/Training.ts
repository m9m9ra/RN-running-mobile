import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Training {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, (user) => user.training)
    user_id: boolean

    @Column({enum: ["RUNNING"]})
    type: string

    @Column()
    data: string
}