import {createContext, useContext} from "react";
import UserStore from "./modules/UserStore";
import ErrorStore from "./modules/ErrorStore";
import SettingStore from "./modules/SettingStore";
import {action, makeObservable, observable, runInAction} from "mobx";
import {GeolocationService} from "../services/GeolocationService";
import {BackgroundService} from "../services/BackgroundService";
import {StepCounter} from "../services/StepCounter";
import {dataSourse} from "../configs/DataSourse";
import {Training} from "../entity/Training";
import moment from "moment";
import {Polyline} from "../entity/Polyline";

class RootStore {
    // StoreModules
    public userStore: UserStore;
    public settingStore: SettingStore;
    public errorStore: ErrorStore;

    // ServicesModules
    public isRunning: boolean = false;
    public isTraining: boolean = false;
    public timer: string = `00:00:00`;
    public stepCounter: StepCounter;
    public backgroundService: BackgroundService;
    public geolocationService: GeolocationService;

    // DomesticModules
    private ms: number = 0;
    private seconds: number = 0;
    private minute: number = 0;
    private training: Training | null = null;
    private intervalId: NodeJS.Timeout;
    private intervalToSaveTraining: NodeJS.Timeout;
    private trainingRepository = dataSourse.getRepository(Training);

    constructor() {
        this.stepCounter = new StepCounter();
        this.backgroundService = new BackgroundService();
        this.geolocationService = new GeolocationService();

        // StoreModules
        this.errorStore = new ErrorStore();
        this.userStore = new UserStore(this.errorStore, this.stepCounter, this.geolocationService);
        this.settingStore = new SettingStore(this.errorStore);

        makeObservable(this, {
            isRunning: observable,
            isTraining: observable,
            timer: observable,
            stopStepCounterService: action,
            startStepCounterService: action,
            toggleRunning: action,
            clearTimer: action,
        });
    };

    public toggleRunning = async (): Promise<boolean> => {
        console.log(moment(new Date()).format(`MM/DD/YYYY/h:mm a`));
        if (!this.isRunning) {
            this.training = Object.assign(new Training(), {
                user_id: this.userStore.user.auth,
                type: "RUNNING",
                start_data: moment(new Date()).format(`h:mm a`),
                data: moment(new Date()).format(`MM/DD/YYYY`)
            });

            // this.intervalToSaveTraining = setInterval(() => {
            //
            // }, 15000);

            runInAction(() => {
                this.isRunning = true;
                this.intervalId = setInterval(() => {
                    runInAction(() => {
                        this.ms += 1;
                        if (this.ms >= 60) {
                            this.ms = 0;
                            this.seconds += 1
                        };
                        if (this.seconds >= 60) {
                            this.seconds = 0;
                            this.minute += 1;
                        }
                        this.timer = `${this.minute < 10 ? '0'+this.minute : this.minute}:${this.seconds < 10 ? '0'+this.seconds : this.seconds}:${this.ms < 10 ? '0'+this.ms : this.ms}`;
                    });
                }, 1000);
            });
            return true;
        } else {
            runInAction(() => {
                this.isRunning = false;
                clearInterval(this.intervalId);
            });
            return false;
        }
    };


    public clearTimer = () => {
        this.timer = `00:00:00`;
    }

    public startGpsService = async () => {
        await this.backgroundService.startBackgroundTask(this.geolocationService.startGeolocation);
    }

    public stopGpsService = async () => {
        await this.geolocationService.stopGeolocation();
    }

    public startStepCounterService = async () => {
        await this.backgroundService.startBackgroundTask(this.stepCounter.startPedometer);
    }

    public stopStepCounterService = async () => {
        await this.backgroundService.stopBackgroundTask();
    }
};

const rootStore = new RootStore();
const storeContext = createContext(rootStore);
export const useRootStore = () => useContext(storeContext);