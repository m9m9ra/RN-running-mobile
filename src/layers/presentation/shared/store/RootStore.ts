import UserStore from "./modules/UserStore";
import SettingStore from "./modules/SettingStore";
import DataStore from "./modules/DataStore";
import ErrorStore from "./modules/ErrorStore";
import {StepCounter} from "./services/StepCounter";
import {BackgroundService} from "./services/BackgroundService";
import {GeolocationService} from "./services/GeolocationService";
import {Training} from "../../../domain/entity/Training";
import {action, makeObservable, observable} from "mobx";
import {createContext, useContext} from "react";
import {RunningStore} from "./modules/RunningStore";

class RootStore {
    // StoreModules
    public userStore: UserStore;
    public settingStore: SettingStore;
    public dataStore: DataStore;
    public errorStore: ErrorStore;
    public runningStore: RunningStore;

    // ServicesModules
    public isRunning: boolean = false;
    public isTraining: boolean = false;
    public timer: string = `00:00:00`;
    public stepCounter: StepCounter;
    public backgroundService: BackgroundService;
    public geolocationService: GeolocationService;
    public training: Training | null = null;

    constructor() {
        this.stepCounter = new StepCounter();
        this.backgroundService = new BackgroundService();
        this.geolocationService = new GeolocationService();

        // StoreModules
        this.errorStore = new ErrorStore();
        this.dataStore = new DataStore();
        this.userStore = new UserStore(
            this.dataStore ,
            this.errorStore,
            this.stepCounter, 
            this.geolocationService);

        this.runningStore = new RunningStore(
            this.stepCounter,
            this.userStore
            );

        this.settingStore = new SettingStore(this.errorStore);

        makeObservable(this, {
            isRunning: observable,
            isTraining: observable,
            training: observable,
            timer: observable,
            startStepCounterService: action,
            initialize: action,
        });
    };

    public initialize = async (): Promise<void> => {};

    public startStepCounterService = async () => {
        // await this.geolocationService.startGeolocation();
        await this.backgroundService.startBackgroundTask(this.stepCounter.startPedometer);
        // await this.backgroundService.startBackgroundTask(this.geolocationService.startGeolocation);
        // this.stepCounter.startPedometer();
    }
};

const rootStore = new RootStore();
const storeContext = createContext(rootStore);
export const useRootStore = () => useContext(storeContext);