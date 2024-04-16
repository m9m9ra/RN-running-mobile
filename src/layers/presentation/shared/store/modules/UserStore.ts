import {makeAutoObservable, runInAction} from "mobx";

import DataStore from "./DataStore";
import {User} from "../../../../domain/entity/User";
import ErrorStore from "./ErrorStore";
import {StepCounter} from "../services/StepCounter";
import {GeolocationService} from "../services/GeolocationService";
import {UserCase} from "../../../../domain/usecase/UserCase";
import {ActivityCase} from "../../../../domain/usecase/ActivityCase";
import moment from "moment";
import {TrainingCase} from "../../../../domain/usecase/TrainingCase";
import {PolylineCase} from "../../../../domain/usecase/PolylineCase";
import LoadStorage from "../../../../domain/usecase/LoadStorage";

export default class UserStore {
    public auth: boolean = false;
    public guest: boolean = false;
    public user: User;

    private errorStore: ErrorStore;
    private userCase: UserCase;
    private dataStore: DataStore;
    private stepCounter: StepCounter;
    private geolocationService: GeolocationService;

    private activityCase: ActivityCase;
    private trainingCase: TrainingCase;
    private polylineCase: PolylineCase;

    constructor(dataStore, errorStore: ErrorStore, stepCounter: StepCounter, geolocationService: GeolocationService) {
        this.dataStore = dataStore;
        this.errorStore = errorStore;
        this.stepCounter = stepCounter;
        this.geolocationService = geolocationService;

        this.userCase = new UserCase();
        this.activityCase = new ActivityCase()
        this.trainingCase = new TrainingCase();
        this.polylineCase = new PolylineCase();

        makeAutoObservable(this);
    };

    public main = async () => {
        const user = await this.userCase.getLocalUser();
        const userActivity = await this.activityCase.getActivity(user);

        runInAction(() => {
            this.user = user;
            this.user.activity = userActivity;
            this.auth = user.auth;
        });

        if (this.user.auth) {
            await this.updatePedometer();
            await new ActivityCase().observeStepCount(this.user.user_id, this.stepCounter);
        }
    };

    public userAuth = async (password: string, email: string): Promise<void> => {
        const user = await this.userCase.authUser(password, email);
        console.log(user, "user case auth store");

        runInAction(() => {
            this.user = user;
            this.auth = user.auth;
        })


        if (this.user.auth) {
            const userActivity = await this.activityCase.getRemote(user);
            const userTraining = await this.trainingCase.getTrainingRemote(user.user_id);

            await this.activityCase.saveActivity(userActivity);

            await this.trainingCase.saveTrainingLocal(userTraining);

            for (let i: number = 0; i < userTraining.length; i++) {
                userTraining[i].polyline = await this.polylineCase.getPolylineRemote(userTraining[i].id);
                console.log(userTraining[i].polyline, 'save line remote to local');

                await this.polylineCase.saveLocal(userTraining[i].polyline);
            }

            await this.updatePedometer();
            await new ActivityCase().observeStepCount(this.user.user_id, this.stepCounter);
            await this.updateUserInfo();

            console.log(this.user);
        }
    };

    public updateUserInfo = async (): Promise<void> => {
        const user = await this.userCase.updateUser();

        runInAction(() => {
            this.user = user;
            this.auth = user.auth;
        })
    };

    public userRegister = async (user: User): Promise<boolean> => {
        const login = await this.userCase.loginUser({...user, auth: false});

        console.log(login, 'login');

        runInAction(() => {
            this.user = login;
            this.auth = login.auth;
        });

        if (this.auth) {
            await new ActivityCase().observeStepCount(this.user.user_id, this.stepCounter);
        }

        return true
    };

    public userLogout = async (): Promise<any> => {
        const change = await this.userCase.userLogout();

        await new LoadStorage().removeData();
        this.stepCounter.stopPedometer();

        runInAction(() => {
            this.user = change;
            this.auth = change.auth;
        });
    };

    private updatePedometer = async (): Promise<void> => {
        let dayActivity: number;
        this.user.activity.forEach(item => {
            console.log(item.data);
            console.log(moment(new Date()).format("L"));
            if (item.data == moment(new Date()).format("L")) {
                dayActivity = item.step
            }
        })
        dayActivity ? this.stepCounter.setStepCount(dayActivity) : false;
    };
};