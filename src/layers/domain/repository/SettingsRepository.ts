import {dataSourse} from "../../data/dto/DataSourse";
import {Settings} from "../entity/Settings";

export class SettingsRepository {
    protected settingsRepository = dataSourse.getRepository(Settings);
}