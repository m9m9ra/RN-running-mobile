import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Training} from "./Training";

@Entity()
export class Ways {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Training, (training) => training.ways)
    training_id: number;

    @Column({type: "bigint", nullable: true})
    timestamp: number;
}