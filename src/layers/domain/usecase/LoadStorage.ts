import {dataSourse} from "../../data/dto/DataSourse";
import {supabase} from "../../data/source/network/Supabase";
import {Polyline} from "../entity/Polyline";
import {Training} from "../entity/Training";
import {User} from "../entity/User";
import {Activity} from "../entity/Activity";

export default class LoadStorage {

    public loadStorage = async () => {
        supabase();
        !dataSourse.isConnected ? await dataSourse.initialize() : false;
    };

    public removeData = async (): Promise<void> => {
        const poly = dataSourse.getRepository(Polyline);
        const training = dataSourse.getRepository(Training);
        const activity = dataSourse.getRepository(Activity);
        const user = dataSourse.getRepository(User);

        await poly.remove(await poly.find({}));
        await training.remove(await training.find({}));
        await activity.remove(await activity.find({}));
        await user.remove(await user.find({}));
    }
}