import {TrainingRepository} from "../repository/TrainingRepository";
import {Training} from "../entity/Training";

export class TrainingCase extends TrainingRepository{
    public training: Training[] = [];
}