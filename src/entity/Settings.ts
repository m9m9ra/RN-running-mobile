import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class Settings {
    @PrimaryColumn()
    settings: boolean

    @Column({nullable: false, default: "en", enum: ["en", "ru"]})
    language: string

    @Column({nullable: false, default: "light", enum: ["DARK", "LIGHT"]})
    them: string
}