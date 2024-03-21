import {createContext, useContext} from "react";
import UserStore from "./modules/UserStore";
import ErrorStore from "./modules/ErrorStore";
import SettingStore from "./modules/SettingStore";
import {action, makeObservable, observable, runInAction} from "mobx";
import {GeolocationService} from "../services/GeolocationService";
import {BackgroundService} from "../services/BackgroundService";
import {StepCounter} from "../services/StepCounter";

class RootStore {
    // StoreModules
    public userStore: UserStore;
    public settingStore: SettingStore;
    public errorStore: ErrorStore;

    // ServicesModules
    public isRunning: boolean = false;
    public timer: string = `00:00:00`;
    public stepCounter: StepCounter;
    public backgroundService: BackgroundService;
    public geolocationService: GeolocationService;

    // DomesticModules
    private ms: number = 0;
    private seconds: number = 0;
    private minute: number = 0;
    private intervalId: NodeJS.Timeout;

    constructor() {
        this.stepCounter = new StepCounter();
        this.backgroundService = new BackgroundService();
        this.geolocationService = new GeolocationService();

        // StoreModules
        this.errorStore = new ErrorStore();
        this.userStore = new UserStore(this.errorStore, this.stepCounter);
        this.settingStore = new SettingStore(this.errorStore);

        makeObservable(this, {
            isRunning: observable,
            timer: observable,
            stopStepCounterService: action,
            startStepCounterService: action,
            toggleRunning: action,
            clearTimer: action,
        });
    };

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

    public toggleRunning = async (): Promise<boolean> => {

        if (!this.isRunning) {
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
};

const rootStore = new RootStore();
const storeContext = createContext(rootStore);
export const useRootStore = () => useContext(storeContext);