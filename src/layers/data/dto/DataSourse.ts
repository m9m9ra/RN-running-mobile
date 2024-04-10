import {DataSource} from "typeorm";
import {Notification} from "../../domain/entity/Notification";
import {Polyline} from "../../domain/entity/Polyline";
import {Training} from "../../domain/entity/Training";
import {Activity} from "../../domain/entity/Activity";
import {Settings} from "../../domain/entity/Settings";
import {User} from "../../domain/entity/User";

export const dataSourse = new DataSource({
    type: "react-native",
    database: `default`,
    location: `default`,
    logging: [`error`, `schema`], //`query`,
    synchronize: true,
    entities: [Polyline, Training, Activity, Settings, User, Notification]
});