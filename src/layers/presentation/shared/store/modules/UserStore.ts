import {makeAutoObservable, runInAction} from "mobx";

import DataStore from "./DataStore";
import {User} from "../../../../domain/entity/User";
import ErrorStore from "./ErrorStore";
import {StepCounter} from "../services/StepCounter";
import {GeolocationService} from "../services/GeolocationService";
import {UserCase} from "../../../../domain/usecase/UserCase";
import {ActivityCase} from "../../../../domain/usecase/ActivityCase";
import moment from "moment";

export default class UserStore {
    public auth: boolean = false;
    public guest: boolean = false;
    public user: User;

    private errorStore: ErrorStore;
    private userCase: UserCase;
    private activityCase: ActivityCase;
    private dataStore: DataStore;
    private stepCounter: StepCounter;
    private geolocationService: GeolocationService;

    constructor(dataStore, errorStore: ErrorStore, stepCounter: StepCounter, geolocationService: GeolocationService) {
        this.dataStore = dataStore;
        this.errorStore = errorStore;
        this.stepCounter = stepCounter;
        this.geolocationService = geolocationService;
        this.userCase = new UserCase();
        this.activityCase = new ActivityCase();

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
            await new ActivityCase().saveActivity(this.user.activity);
            await this.updatePedometer();
            await new ActivityCase().observeStepCount(this.user.user_id, this.stepCounter);
            console.log(this.user);
        }
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
    }

    public updateUserInfo = async (): Promise<void> => {
        const user = await this.userCase.updateUser();

        runInAction(() => {
            this.user = user;
            this.auth = user.auth;
        })
    };

    public userRegister = async (user: User): Promise<boolean> => {
        const login = await this.userCase.loginUser(user);

        runInAction(() => {
            this.user = login;
            this.auth = login.auth;
        });

        if (this.user.auth) {
            await new ActivityCase().observeStepCount(this.user.user_id, this.stepCounter);
        }

        return true
    };

    public userLogout = async (): Promise<any> => {
        const change = await this.userCase.userLogout();

        runInAction(() => {
            this.user = change;
            this.auth = change.auth;
            console.log(this.user);
        });
    }
};