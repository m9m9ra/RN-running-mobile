import {dataSourse} from "../../data/dto/DataSourse";
import {supabase} from "../../data/source/network/Supabase";

export default class LoadStorage {

    public loadStorage = async () => {
        supabase();
        !dataSourse.isConnected ? await dataSourse.initialize() : false;
    }
}