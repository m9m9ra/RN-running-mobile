import {makeAutoObservable, runInAction} from "mobx";
import {dataSourse} from "../../configs/DataSourse";
import {User} from "../../entity/User";
import ErrorStore from "./ErrorStore";
import {StepCounter} from "../../services/StepCounter";
import {Activity} from "../../entity/Activity";
import moment from "moment";
import {GeolocationService} from "../../services/GeolocationService";
import DataStore from "./DataStore";

export default class UserStore {
    public auth: boolean = false;
    public guest: boolean = false;
    public user: User;

    private errorStore: ErrorStore;
    private dataStore: DataStore;
    private stepCounter: StepCounter;
    private geolocationService: GeolocationService;
    private userRepository = dataSourse.getRepository(User);
    private activityRepository = dataSourse.getRepository(Activity);

    constructor(dataStore, errorStore: ErrorStore, stepCounter: StepCounter, geolocationService: GeolocationService) {
        this.dataStore = dataStore;
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

        if (user !== null) {
            console.log(user);
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

            await this.observeStepCount();

            console.log(`Storage loaded!`);
            console.log(user);
        } else {
            const newuser = Object.assign(new User(), {
                auth: false,
                guest: false,
                firstName: ``,
                lastName: ``,
                gender: `NOT_SAY`,
                email: ``,
                password: ``,
                birthdate: ``,
                policy: false,
            });

            runInAction(() => {
                this.user = newuser;
                this.auth = newuser.auth;
                this.guest = newuser.guest;
            });

            await this.observeStepCount();
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

        await this.dataStore.supabase.from('user').update(user).eq('email', this.user.email);

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

            const updateUserInfo = await this.activityRepository.find({});

            runInAction(() => {
                this.user.activity = updateUserInfo;
            });

            console.log(dayActivity);

            if (dayActivity !== null) {
                dayActivity.step = this.stepCounter.stepCount;
                await this.activityRepository.save(dayActivity);
                const remote = await this.dataStore.supabase
                    .from('activity')
                    .update(dayActivity)
                    .eq(`user_id`, this.user.user_id)
                    .eq(`data`, dayActivity.data)
                    .select()

                console.log(remote);
            } else {
                runInAction(() => {
                    this.stepCounter.setStepCount(1);
                });

                const newDayActivity = Object.assign(new Activity(), {
                    user_id: this.user.user_id,
                    step: this.stepCounter.stepCount,
                    data: moment(currentDay).format("L")
                });

                await this.activityRepository.save(newDayActivity);

                const remote = await this.dataStore.supabase
                    .from('activity')
                    .insert({
                        user_id: this.user.user_id,
                        step: this.stepCounter.stepCount,
                        data: moment(currentDay).format("L"),
                        kcal: 1
                    });

                console.log({
                    user_id: this.user.user_id,
                    step: this.stepCounter.stepCount,
                    data: moment(currentDay).format("L")
                }, `local`);

                console.log(remote, `remote`);
            }
        }, (60000));
    };

    public userRegister = async (user: User): Promise<boolean> => {
        if (this.user && this.auth) {
            return true
        }
        // todo - Guest auth
        let remoteUser = await this.dataStore.supabase
            .from('user')
            .select()
            .eq('email', user.email);

        if (remoteUser.data) {
            return false;
        } else {
            remoteUser = await this.dataStore.supabase
                .from('user')
                .insert(user);

            remoteUser = await this.dataStore.supabase
                .from('user')
                .select()
                .eq('email', user.email);

            const {data, error} = await this.dataStore.supabase.auth.signUp({
                email: user.email,
                password: user.password,
            });

            console.log(data, error);
            console.log(await this.dataStore.supabase.auth.getSession());

            runInAction(() => {
                this.user = remoteUser.data[0];
                this.user.auth = true;
                this.user.guest = true;
                this.user.training = [];
                this.user.activity = [];

                console.log('Auth fix', this.user);
            });

            const change = await this.userRepository.save(this.user);

            runInAction(() => {
                this.user = change;
                this.auth = change.auth;
                this.guest = change.guest;
                console.log('Remote fix', this.user);
            });

            return true
        }

    };

    public userAuth = async (password: string, email: string): Promise<boolean> => {
        if (this.user && this.auth) {
            return true
        }
        // todo - Guest auth
        let remoteUser = await this.dataStore.supabase
            .from('user')
            .select()
            .eq('email', email);

        if (remoteUser.data) {
            if (password == remoteUser.data[0].password) {
                const {data, error} = await this.dataStore.supabase.auth.signInWithPassword({
                    email: email,
                    password: password,
                });

                const userTraining = await this.dataStore.supabase
                    .from('training')
                    .select(`*, polyline`)
                    .eq(`userIdUserId`, remoteUser.data[0].user_id);

                console.log(userTraining.data);

                const userActivity = await this.dataStore.supabase
                    .from('activity')
                    .select()
                    .eq(`user_id`, remoteUser.data[0].user_id);

                console.log(data, error);
                console.log(await this.dataStore.supabase.auth.getSession());

                runInAction(() => {
                    this.user = remoteUser.data[0];
                    this.user.auth = true;
                    this.user.guest = true;
                    this.user.training = userTraining.data == null ? [] : userTraining.data;
                    this.user.activity = userActivity.data == null ? [] : userActivity.data;


                });
                console.log(userActivity, "activity");
                console.log(this.user, "activity from user");

                await this.userRepository.save(this.user);
                userActivity.data == null ? [] : await this.activityRepository.save(userActivity.data);

                const change = await this.userRepository.findOne({
                    where: {
                        auth: true || false
                    },
                    relations: {
                        activity: true,
                        training: {
                            polyline: true
                        }
                    }
                })

                runInAction(() => {
                    this.user = change;
                    this.auth = change.auth;
                    this.guest = change.guest;

                });
                console.log(this.user, "activity from user local");

                this.dataStore.supabase.from(`user`).update({...this.user}).eq('email', this.user.email);

                return true;
            }

        } else {

            return false;
        }

    };

    public userLogout = async (): Promise<boolean> => {
        console.log(this.user);

        if (this.user) {
            runInAction(() => {
                this.user.auth = false;
                this.guest = false;
            });

            const change = await this.userRepository.save(this.user);

            runInAction(() => {
                this.user = change;

                this.auth = change.auth;
                this.guest = change.guest;
                console.log("User logout", change.auth, change.guest, this.user);
            })

            await this.dataStore.supabase.from(`user`).update(this.user).eq('email', this.user.email);
        } else {
            return false
        }
    }
};