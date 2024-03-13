import {Entity, PrimaryColumn} from "typeorm";

@Entity()
export class Settings {
    @PrimaryColumn()
    user: number
}