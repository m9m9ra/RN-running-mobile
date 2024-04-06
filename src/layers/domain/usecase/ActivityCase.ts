import {ActivityRepository} from "../repository/ActivityRepository";
import {Activity} from "../entity/Activity";
import moment from "moment/moment";
import {StepCounter} from "../../presentation/shared/store/services/StepCounter";
import {supabase} from "../../data/source/network/Supabase";
import {User} from "../entity/User";

export class ActivityCase extends ActivityRepository{

    public saveActivity = async (activity: Activity[]):Promise<Activity[] | null> => {
        const change = await this.activityRepository.save(activity)
        return change
    }

    public getActivity = async (user: User):Promise<Activity[] | null> => {
        return await this.activityRepository.find({
            where: {
                user_id: user.user_id
            }
        });
    }

    public observeStepCount = async (user_id: number, stepCounter: StepCounter): Promise<void> => {
        const saveStep: NodeJS.Timeout = setInterval(async () => {
            const data = new Date();
            const currentDay = moment(data);
            console.log(moment(currentDay).format("L"));
            console.log(moment(currentDay).isSame(currentDay));

            const dayActivity = await this.activityRepository.findOne({
                where: {
                    data: moment(currentDay).format("L")
                }
            });

            if (dayActivity !== null) {
                dayActivity.step = stepCounter.stepCount;
                await this.activityRepository.save(dayActivity);
                const remote = await supabase()
                    .from('activity')
                    .update({
                        step: dayActivity.step,
                        kcal: dayActivity.kcal,
                        data: dayActivity.data,
                        user_id: dayActivity.user_id,
                    })
                    .eq(`user_id`, user_id)
                    .eq(`data`, dayActivity.data)
                    .select()

                console.log(remote);
            } else {
                stepCounter.setStepCount(1);

                const newDayActivity = Object.assign(new Activity(), {
                    user_id: user_id,
                    step: stepCounter.stepCount,
                    data: moment(currentDay).format("L")
                });

                await this.activityRepository.save(newDayActivity);

                const remote = await supabase()
                    .from('activity')
                    .insert({
                        user_id: user_id,
                        step: stepCounter.stepCount,
                        data: moment(currentDay).format("L"),
                        kcal: 1
                    });
            }
        }, (60000 * 24));
    };
}