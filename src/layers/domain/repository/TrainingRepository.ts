import {dataSourse} from "../../data/dto/DataSourse";
import {Training} from "../entity/Training";

export class TrainingRepository {
    protected trainingRepository = dataSourse.getRepository(Training);
}