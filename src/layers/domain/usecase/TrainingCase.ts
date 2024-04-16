import {TrainingRepository} from "../repository/TrainingRepository";
import {Training} from "../entity/Training";
import {supabase} from "../../data/source/network/Supabase";

export class TrainingCase extends TrainingRepository{
    public training: Training[] = [];

    public getTrainingRemote = async (user_id: number): Promise<Training[]> => {
        const { data, error } = await supabase()
            .from(`training`)
            .select()
            .eq(`user_id`, user_id);

        console.log(data, error);
        return data;
    };

    public getTraining = async (training: Training): Promise<Training> => {
        return await this.trainingRepository.findOne({
            where: {
                id: training.id
            },
            relations: {
                polyline: true
            }
        })
    };

    public getAllTrainingLocal = async (user_id: number): Promise<Training[]> => {
        return this.trainingRepository.find({
            where: {
                user_id: user_id
            },
            relations: {
                polyline: true
            }
        });
    };

    public saveTrainingLocal = async (training: Training[]): Promise<Training[]> => {
        return await this.trainingRepository.save(training);
    };

    public updateTrainingLocal = async (training: Training): Promise<Training> => {
        await this.trainingRepository.save(training);

        return await this.trainingRepository.findOne({
            where: {
                id: training.id
            },
            relations: {
                polyline: true
            }
        })
    };

    public initTrainingLocal = async (training: Training): Promise<Training> => {
        const newTraining = await this.trainingRepository.save({
            ...training
        });

        return await this.trainingRepository.findOne({
            where: {
                id: newTraining.id,
                type: training.type,
                distance: training.distance,
                average: training.average,
                duration: training.duration,
                circle: training.circle,
                start_step: training.start_step,
                end_step: training.end_step,
                step_count: training.step_count,
                start_data: training.start_data,
                end_data: training.end_data,
                data: training.data,
                kcal: training.kcal,
                user_id: training.user_id
            },
            relations: {
                polyline: true
            }
        })
    };

    public initTraining = async (training: Training): Promise<Training> => {
        await supabase()
            .from(`training`)
            .insert({
                type: training.type,
                distance: training.distance,
                average: training.average,
                duration: training.duration,
                circle: training.circle,
                start_step: training.start_step,
                end_step: training.end_step,
                step_count: training.step_count,
                start_data: training.start_data,
                end_data: training.end_data,
                data: training.data,
                kcal: training.kcal,
                user_id: training.user_id,
            })

        const {data, error} = await supabase()
            .from(`training`)
            .select()
            .eq(`user_id`, training.user_id)
            .eq(`data`, training.data)
            .eq(`start_data`, training.start_data)
            .eq(`type`, training.type)

        console.log(data[0]);

        await this.trainingRepository.save({
            ...training,
            id: data[0].id
        });

        return await this.trainingRepository.findOne({
            where: {
                id: data[0].id,
                type: training.type,
                distance: training.distance,
                average: training.average,
                duration: training.duration,
                circle: training.circle,
                start_step: training.start_step,
                end_step: training.end_step,
                step_count: training.step_count,
                start_data: training.start_data,
                end_data: training.end_data,
                data: training.data,
                kcal: training.kcal,
                user_id: training.user_id
            }
        })
    };

    public saveTraining = async (training: Training, user_id: number): Promise<Training> => {
        const {data, error} = await supabase()
            .from(`training`)
            .update({
                type: training.type,
                distance: training.distance,
                average: training.average,
                duration: training.duration,
                circle: training.circle,
                start_step: training.start_step,
                end_step: training.end_step,
                step_count: training.step_count,
                start_data: training.start_data,
                end_data: training.end_data,
                data: training.data,
                kcal: 2,
                user_id: user_id,
            })
            .eq(`user_id`, user_id)
            .eq(`data`, training.data)
            .eq(`start_data`, training.start_data)

        console.log(data, error, "training");

        await this.trainingRepository.save(training);

        return await this.trainingRepository.findOne({
            where: {
                type: training.type,
                distance: training.distance,
                average: training.average,
                duration: training.duration,
                circle: training.circle,
                start_step: training.start_step,
                end_step: training.end_step,
                step_count: training.step_count,
                start_data: training.start_data,
                end_data: training.end_data,
                data: training.data,
                kcal: training.kcal,
                user_id: training.user_id
            }
        })
    }
}