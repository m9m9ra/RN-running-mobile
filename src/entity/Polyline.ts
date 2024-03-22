import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Training} from "./Training";

@Entity()
export class Polyline {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Training, (training) => training.polyline)
    training_id: boolean

    @Column()
    lat: number

    @Column()
    lon: number
}