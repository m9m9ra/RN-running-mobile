import {dataSourse} from "../../data/dto/DataSourse";
import {Polyline} from "../entity/Polyline";
export abstract class PolylineRepository {
    protected polylineRepository = dataSourse.getRepository(Polyline);
}