import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import { User } from "./User";
import {Polyline} from "./Polyline";

@Entity()
export class Training {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, (user) => user.training)
    user_id: boolean

    @Column({enum: ["RUNNING"]})
    type: string

    // todo - ??? Массив точек на карте
    @OneToMany(() => Polyline, (polyline) => polyline.training_id)
    polyline?: Polyline[]

    @Column({nullable: true})
    distance?: number

    @Column({nullable: true})
    average?: string

    // todo - Или ms => number || "00:00:00" => sting.data
    @Column({nullable: true})
    duration?: string

    @Column({nullable: true})
    start_step?: number

    @Column({nullable: true})
    end_step?: number

    @Column({nullable: true})
    step_count?: number

    // dd/mm/year: 8:54 pm
    @Column({nullable: true})
    start_data?: string

    // dd/mm/year: 8:54 pm
    @Column({nullable: true})
    end_data?: string

    // dd/mm/year: 01/07/2024
    @Column()
    data?: string

    @Column({nullable: true})
    kcal: number

}