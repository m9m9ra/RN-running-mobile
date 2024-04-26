import {Polyline} from "../entity/Polyline";
import {supabase} from "../../data/source/network/Supabase";
import {WaysRepository} from "../repository/WaysRepository";
import {Ways} from "../entity/Ways";
import {Training} from "../entity/Training";

export class WaysCase extends WaysRepository {
    public polyline: Polyline[] = [];

    public saveLocal = async (ways: Ways): Promise<Ways> => {
        const newWays = await this.waysRepository.save(ways);
        console.log(newWays, "case");

        return newWays;
    };

    public getAllWays = async (trainig: Training): Promise<Ways[]> => {
        return await this.waysRepository.findBy({
            training_id: trainig
        });
    }
}