import {dataSourse} from "../../data/dto/DataSourse";
import {User} from "../entity/User";

export class UserRepository {
    protected userRepository = dataSourse.getRepository(User);
}