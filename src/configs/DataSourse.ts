import {DataSource} from "typeorm";

export const dataSourse = new DataSource({
    type: "react-native",
    database: `default`,
    location: `default`,
    logging: [`query`, `error`, `schema`],
    synchronize: true,
    entities: [`./../entity/*ts`]
});