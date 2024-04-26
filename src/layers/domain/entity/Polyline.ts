import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Training} from "./Training";
import {Ways} from "./Ways";

@Entity()
export class Polyline {
    @PrimaryGeneratedColumn()
    public id: number

    @ManyToOne(() => Training, (training) => training.polyline)
    training_id: number

    @ManyToOne(() => Ways, (ways) => ways.polyline)
    ways_id: number

    @Column({type: "float"})
    lat: number

    @Column({type: "float"})
    lon: number

    @Column({type: "bigint", nullable: true})
    timestamp: number

    @Column({enum: ["START", "END", "MIDDLE"], default: "MIDDLE"})
    type: string
}