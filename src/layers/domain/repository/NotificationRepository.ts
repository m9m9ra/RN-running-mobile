import {dataSourse} from "../../data/dto/DataSourse";
import {Notification} from "../entity/Notification";

export class NotificationRepository {
    protected notificationRepository = dataSourse.getRepository(Notification);
}