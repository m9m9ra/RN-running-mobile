import {PolylineRepository} from "../repository/PolylineRepository";
import {Polyline} from "../entity/Polyline";
import {supabase} from "../../data/source/network/Supabase";

export class PolylineCase extends PolylineRepository {
    public polyline: Polyline[] = [];

    public savePolylineLocal = async (polyline: Polyline): Promise<Polyline[]> => {
        return await this.polylineRepository.save([polyline]);
    };

    public getPolylineRemote = async (training_id: number): Promise<Polyline[]> => {
        const {data, error} = await supabase().from(`polyline`).select().eq('training_id', training_id);
        console.log(data, error);

        return data
    };

    public saveLocal = async (polyline: Polyline[]): Promise<void> => {
        await this.polylineRepository.save(polyline);
    };

    public savePolyline = async (polyline: Polyline): Promise<Polyline[]> => {
        await supabase()
            .from(`polyline`)
            .insert({
                lat: polyline.lat,
                lon: polyline.lon,
                training_id: polyline.training_id,
            });

        const {data, error} = await supabase()
            .from(`polyline`)
            .select()
            .eq(`training_id`, polyline.training_id)

        await this.polylineRepository.save(data.length > 1 ? data : [polyline])

        return await this.polylineRepository.find({
            where: {
                training_id: polyline.training_id
            }
        });
    };
    public uploadPolyline = async (polyline: Polyline[]): Promise<Polyline[]> => {
        polyline.forEach(item => {
            supabase()
                .from(`polyline`)
                .insert({
                    lat: item.lat,
                    lon: item.lon,
                    training_id: item.training_id,
                });
        });

        return
    };
    public updatePolylineLocal = async (training_id: number, pause_id: number): Promise<Polyline[]> => {
        let isUniq = await this.polylineRepository.find({
            where: {
                training_id: training_id
            }
        });

        // const tempPoly = isUniq;
        //
        // await this.polylineRepository.remove(isUniq);
        //
        // isUniq = isUniq.map((item) => {
        //     item.pause_id = pause_id;
        //     item.training_id = undefined;
        //     return item
        // });

        return await this.polylineRepository.save(isUniq);
    };
}