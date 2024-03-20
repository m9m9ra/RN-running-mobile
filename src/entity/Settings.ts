import {Column, Entity, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Settings {
    @PrimaryGeneratedColumn()
    id: number
    
    @Column({unique: true})
    settings: boolean

    @Column({nullable: false, default: "en", enum: ["en", "ru"]})
    language: string

    @Column({nullable: true, default: "light", enum: ["DARK", "LIGHT"]})
    them: string
}