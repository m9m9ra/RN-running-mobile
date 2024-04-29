import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Training} from "./Training";
import {Polyline} from "./Polyline";

@Entity()
export class Ways {
    @PrimaryGeneratedColumn()
    id: number;

    // @JoinColumn({name: 'training_id', referencedColumnName: "id"})

    @ManyToOne(() => Training, (training) => training.ways)
    @JoinColumn({name: `training_id`})
    training_id!: Training;

    @OneToMany(() => Polyline, (polyline) => polyline.ways_id, {cascade: true})
    polyline: Polyline[]

    @Column({type: "bigint", nullable: true})
    timestamp: number;

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

    // dd/mm/year: 8:54 pm
    @Column({nullable: true})
    end_data?: string

    @Column({nullable: true})
    kcal: string
}