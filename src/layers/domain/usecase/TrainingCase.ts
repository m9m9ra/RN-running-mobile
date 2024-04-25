import {TrainingRepository} from "../repository/TrainingRepository";
import {Training} from "../entity/Training";
import {supabase} from "../../data/source/network/Supabase";
import {dataSourse} from "../../data/dto/DataSourse";

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
        console.log(`training_id error`, training.id);
        const trainig_id = training.id;
        return await dataSourse.manager.findOne(Training, {
            relations: {
                polyline: true,
                ways: true
            },
            where: {
                id: trainig_id,
                polyline: {
                    training_id: trainig_id
                }
            }})

        // return await this.trainingRepository.findOne({
        //     relations: {
        //         polyline: true,
        //         ways: true
        //     },
        //     where: {
        //         id: trainig_id,
        //         polyline: {
        //             training_id: trainig_id
        //         }
        //     }
        // })
    };

    public getAllTrainingLocal = async (user_id: number): Promise<Training[]> => {
        return this.trainingRepository.find({
            where: {
                user_id: user_id
            },
            relations: {
                polyline: true
            },
        });
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

    public saveTrainingLocal = async (training: Training): Promise<Training> => {
        return await this.trainingRepository.save(training);
    };

    public uploadLocalTrainigManual = async (localTraining: Training[], user_id: number): Promise<void> => {
        localTraining.forEach((training) => {
            supabase()
                .from(`training`)
                .insert({
                    user_id: user_id,
                    type: training.type,
                    polyline: training.polyline,
                    remote: true,

                    distance: training.distance,
                    max_speed: training.max_speed,
                    average: training.average,
                    average_pace: training.average_pace,
                    average_step: training.average_step,

                    duration: training.duration,
                    circle: training.circle,
                    start_step: training.start_step,
                    end_step: training.end_step,
                    step_count: training.step_count,
                    start_data: training.start_data,
                    end_data: training.end_data,
                    data: training.data,
                    kcal: training.kcal,

                }).then((data) => {
                console.log(data);
            })
        });

        const update = localTraining.map((training) => {
            training.remote = true;
            return training;
        })

        await this.trainingRepository.save(update);
    };

    public uploadTrainingInfo = async (training: Training): Promise<Training> => {
        await supabase()
            .from(`training`)
            .insert({
                type: training.type,
                distance: training.distance,
                average: training.average,
                average_pace: training.average_pace,
                polyline: training.polyline,
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

        return await this.trainingRepository.save(training);
    };

    public initTraining = async (training: Training): Promise<Training> => {
        await supabase()
            .from(`training`)
            .insert({
                type: training.type,
                distance: training.distance,
                average: training.average,
                average_pace: training.average_pace,
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
                average_pace: training.average_pace,
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