import {DataSource} from "typeorm";
import { User } from "../entity/User";
import { Training } from "../entity/Training";
import { Activity } from "../entity/Activity";
import { Settings } from "../entity/Settings";

export const dataSourse = new DataSource({
    type: "react-native",
    database: `default`,
    location: `default`,
    logging: [`query`, `error`, `schema`],
    synchronize: true,
    entities: [User, Training, Activity, Settings]
});