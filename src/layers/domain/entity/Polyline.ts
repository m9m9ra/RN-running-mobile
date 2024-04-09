import {Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {Training} from "./Training";

@Entity()
export class Polyline {
    @PrimaryColumn()
    id: number

    @ManyToOne(() => Training, (training) => training.polyline)
    training_id: number

    @Column({type: "float"})
    lat: number

    @Column({type: "float"})
    lon: number
}