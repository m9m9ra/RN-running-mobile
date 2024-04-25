import {dataSourse} from "../../data/dto/DataSourse";
import {Ways} from "../entity/Ways";
export abstract class WaysRepository {
    protected waysRepository = dataSourse.getRepository(Ways);
}