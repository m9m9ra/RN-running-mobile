import {makeAutoObservable, runInAction} from "mobx";
import {dataSourse} from "../../configs/DataSourse";
import {User} from "../../entity/User";
import ErrorStore from "./ErrorStore";
import {StepCounter} from "../../services/StepCounter";
import {Activity} from "../../entity/Activity";
import moment from "moment";
import {GeolocationService} from "../../services/GeolocationService";

export default class UserStore {
    public auth: boolean = false;
    public guest: boolean = false;
    public user: User;

    private errorStore: ErrorStore;
    private stepCounter: StepCounter;
    private geolocationService: GeolocationService;
    private userRepository = dataSourse.getRepository(User);
    private activityRepository = dataSourse.getRepository(Activity);

    constructor(errorStore: ErrorStore, stepCounter: StepCounter, geolocationService: GeolocationService) {
        this.errorStore = errorStore;
        this.stepCounter = stepCounter;
        this.geolocationService = geolocationService;

        makeAutoObservable(this);
    };

    public main = async () => {
        !dataSourse.isConnected ? await dataSourse.initialize() : false;

        const user = await this.userRepository.findOne({
            where: {
                auth: true || false
            },
            relations: {
                activity: true,
                training: {
                    polyline: true
                }
            }
        });

        await this.observeStepCount();

        if (user !== null) {
            const loadPedometer = await this.activityRepository.findOne({
                where: {
                    data: moment(new Date()).format("L")
                }
            });

            if (loadPedometer !== null) {
                this.stepCounter.setStepCount(loadPedometer.step);
            }

            runInAction(() => {
                this.auth = user.auth;
                this.guest = user.guest;
                this.user = user;

                this.user.training = this.user.training.sort((a, b) => {
                    // @ts-ignore
                    return moment(b.data, 'DD.MM.YY') - moment(a.data, 'DD.MM.YY');
                });
            });
            console.log(`Storage loaded!`);
            console.log(user);
        }

    };

    public updateUserInfo = async (): Promise<void> => {
        const user = await this.userRepository.findOne({
            where: {
                auth: true || false
            },
            relations: {
                activity: true,
                training: {
                    polyline: true
                }
            }
        });
        runInAction(() => {
           this.user = user;
           this.user.training = this.user.training.sort((a, b) => {
               // @ts-ignore
               return moment(b.data, 'DD.MM.YY') - moment(a.data, 'DD.MM.YY');
           });
        });
    };

    private observeStepCount = async (): Promise<void> => {
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

            const updateUserInfo = await this.activityRepository.find({

            });

            runInAction(() => {
                this.user.activity = updateUserInfo;
            });

            console.log(dayActivity);

            if (dayActivity !== null) {
                dayActivity.step = this.stepCounter.stepCount;
                await this.activityRepository.save(dayActivity);
            } else {
                this.stepCounter.setStepCount(1);

                const newDayActivity = Object.assign(new Activity(), {
                    user_id: this.user.auth,
                    step: this.stepCounter.stepCount,
                    data: moment(currentDay).format("L")
                });

                await this.activityRepository.save(newDayActivity);
            }
        }, (60000 * 25));
    };

    public userRegister = async (user: User): Promise<boolean> => {
        if (this.user && this.auth) {
            return true
        }
        // todo - Guest auth
        const newUser = Object.assign(new User(), {
            ...user,
            auth: true,
            guest: false
        })
        const response = await this.userRepository.save(newUser);

        if (response !== null) {
            runInAction(() => {
                this.auth = true;
            })
            return true
        } else {
            return false
        }
    };

    public userLogout = async (): Promise<boolean> => {
        console.log(this.user);

        if (this.user) {
            const cacheUser = Object.assign(new User(), {
                ...this.user,
                auth: false,
                guest: false
            });

            await this.userRepository.remove(this.user);

            await this.userRepository.save(cacheUser)
                .finally(() => {
                    runInAction(() => {
                        this.auth = false;
                        this.guest = false;
                    })
                });
        } else {
            return false
        }
    }
};