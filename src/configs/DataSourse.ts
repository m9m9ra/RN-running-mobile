import {DataSource} from "typeorm";
import { User } from "../entity/User";
import { Training } from "../entity/Training";
import { Activity } from "../entity/Activity";
import { Settings } from "../entity/Settings";
import {Polyline} from "../entity/Polyline";

export const dataSourse = new DataSource({
    type: "react-native",
    database: `default`,
    location: `default`,
    logging: [`error`, `schema`], //`query`,
    synchronize: true,
    entities: [Polyline, Training, Activity, Settings, User]
});