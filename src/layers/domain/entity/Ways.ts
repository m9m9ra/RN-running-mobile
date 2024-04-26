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
}