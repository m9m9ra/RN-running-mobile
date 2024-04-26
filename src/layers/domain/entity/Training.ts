import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation} from "typeorm";
import { User } from "./User";
import {Polyline} from "./Polyline";
import {Ways} from "./Ways";
@Entity()
export class Training {
    @PrimaryGeneratedColumn({name: `id`})
    id: number

    @ManyToOne(() => User, (user) => user.training)
    user_id: number

    @Column({enum: ["RUNNING"]})
    type: string

    // todo - ??? Массив точек на карте
    @OneToMany(() => Polyline, (polyline) => polyline.training_id,{cascade: true})
    polyline: Polyline[]

    // todo - ??? Массив точек на карте; замороженные пути
    @OneToMany(() => Ways, (ways) => ways.training_id,{cascade: true})
    ways: Relation<Ways[]>

    @Column({nullable: false, default: false})
    remote?: boolean

    @Column({nullable: false, default: 0})
    pauseCount?: number

    @Column({nullable: false, default: false})
    pause?: boolean

    @Column({nullable: true})
    distance?: string

    @Column({nullable: true})
    max_speed?: string

    @Column({nullable: true})
    average?: string

    @Column({nullable: true})
    average_pace?: string

    @Column({nullable: true})
    average_step?: string

    // todo - Или ms => number || "00:00:00" => sting.data
    @Column({nullable: true})
    duration?: string

    // todo - Или ms => number || "00:00:00" => sting.data
    @Column({nullable: true})
    circle?: string

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
    kcal: string

}