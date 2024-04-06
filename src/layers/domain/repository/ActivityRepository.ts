import {dataSourse} from "../../data/dto/DataSourse";
import {Activity} from "../entity/Activity";

export abstract class ActivityRepository {
    protected activityRepository = dataSourse.getRepository(Activity);
}