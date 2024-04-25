import "reflect-metadata";
import {DataSource} from "typeorm";
import {Notification} from "../../domain/entity/Notification";
import {Polyline} from "../../domain/entity/Polyline";
import {Training} from "../../domain/entity/Training";
import {Activity} from "../../domain/entity/Activity";
import {Settings} from "../../domain/entity/Settings";
import {User} from "../../domain/entity/User";
import {Ways} from "../../domain/entity/Ways";

export const dataSourse = new DataSource({
    type: "react-native",
    database: `default`,
    location: `default`,
    driver: require(`react-native-sqlite-storage`),
    logging: [`error`, `schema`], //`query`,
    synchronize: true,
    entities: [Polyline, Ways, Training, Activity, Settings, User, Notification]
});