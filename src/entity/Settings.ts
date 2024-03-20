import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class Settings {
    @PrimaryColumn({unique: true})
    settings: boolean

    @Column({nullable: false, default: "en", enum: ["en", "ru"]})
    language: string

    @Column({nullable: true, default: "light", enum: ["DARK", "LIGHT"]})
    them: string
}