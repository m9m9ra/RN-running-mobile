import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Activity {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, (user) => user.activity)
    user_id: number

    @Column()
    step: number

    // dd/mm/year: 01/07/2024
    @Column()
    data: string

    @Column({nullable: true})
    kcal: number
}