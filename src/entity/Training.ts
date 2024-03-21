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

    // todo - ??? Массив точек на карте
    @Column({nullable: true})
    polyline: string

    @Column()
    distance: number

    @Column()
    average: string

    // todo - Или ms => number || "00:00:00" => sting.data
    @Column()
    duration: string

    // dd/mm/year: 01/07/2024
    @Column()
    data: string

    @Column({nullable: true})
    kcal: number

}