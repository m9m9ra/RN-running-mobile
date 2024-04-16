import UserStore from "./modules/UserStore";
import SettingStore from "./modules/SettingStore";
import DataStore from "./modules/DataStore";
import ErrorStore from "./modules/ErrorStore";
import {StepCounter} from "./services/StepCounter";
import {BackgroundService} from "./services/BackgroundService";
import {GeolocationService} from "./services/GeolocationService";
import {Training} from "../../../domain/entity/Training";
import {Polyline} from "../../../domain/entity/Polyline";
import {action, makeObservable, observable, runInAction} from "mobx";
import moment from "moment";
import {pointToDistance} from "../../../../core/utils/PointToDistance";
import {createContext, useContext} from "react";
import {TrainingCase} from "../../../domain/usecase/TrainingCase";
import {PolylineCase} from "../../../domain/usecase/PolylineCase";
import {KcalPerMinute} from "../../../../core/utils/KcalCalc";
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

    // DomesticModules
    private ms: number = 0;
    private seconds: number = 0;
    private minute: number = 0;
    private intervalId: NodeJS.Timeout;
    private intervalToSaveTraining: NodeJS.Timeout;
    private trainingCase: TrainingCase;
    private polylineCase: PolylineCase;

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
            stopStepCounterService: action,
            startStepCounterService: action,
            toggleRunning: action,
            initialize: action,
        });
    };

    public initialize = async (): Promise<void> => {
        this.trainingCase = new TrainingCase();
        this.polylineCase = new PolylineCase();
    };

    // todo - deprecated
    public toggleRunning = async (): Promise<boolean> => {
        this.geolocationService.setLocation([]);
        const current_data = moment(new Date()).format(`h:mm a`);
        console.log(current_data);

        if (!this.isRunning) {
            this.geolocationService.startGeolocation()

            runInAction(() => {
                this.training = Object.assign(new Training(), {
                    user_id: this.userStore.user.user_id,
                    type: "RUNNING",
                    start_data: current_data,
                    start_step: this.stepCounter.stepCount,
                    data: moment(new Date()).format(`MM/DD/YYYY`)
                });
            })

            const change = await this.trainingCase.initTraining(this.training);

            runInAction(() => {
                this.training = change;
            });

            this.intervalToSaveTraining = setInterval(async () => {
                const newPolyline = Object.assign(new Polyline(), {
                    training_id: this.training.id,
                    lat: this.geolocationService.currentPosition.lat,
                    lon: this.geolocationService.currentPosition.lon
                });
                console.log(this.training, `root store training`);

                await this.polylineCase.savePolyline(newPolyline);

                const Kcal = KcalPerMinute({height: 172, weight: 64, averageSpeed: this.training.average});
                // this.training.kcal = Number(Kcal) * this.seconds;
                // console.log(Kcal, this.training.kcal);

                const override = await this.trainingCase.getTraining(this.training);

                runInAction(() => {
                    this.training = override;

                    let currentDistance: number = 0;
                    if (this.training.polyline.length > 1 && this.training.polyline) {
                        for (let i = 0; i < this.training.polyline.length - 1; i++) {
                            const distance = pointToDistance(
                                this.training.polyline[i].lat,
                                this.training.polyline[i].lon,
                                this.training.polyline[i + 1].lat,
                                this.training.polyline[i + 1].lon);

                            currentDistance += distance;
                        }

                        this.seconds > 0 ? this.training.average = Number(currentDistance / this.seconds).toFixed(2) : this.training.average = `00.00`;

                        this.training.distance = currentDistance.toFixed(2);
                    }

                });

            }, 5000);

            runInAction(() => {
                this.isRunning = true;
                this.intervalId = setInterval(() => {
                    runInAction(() => {
                        this.ms += 1;
                        if (this.ms >= 60) {
                            this.ms = 0;
                            this.seconds += 1
                        }
                        ;
                        if (this.seconds >= 60) {
                            this.seconds = 0;
                            this.minute += 1;
                        }
                        this.timer = `${this.minute < 10 ? '0' + this.minute : this.minute}:${this.seconds < 10 ? '0' + this.seconds : this.seconds}:${this.ms < 10 ? '0' + this.ms : this.ms}`;
                    });
                }, 1000);
            });
            return true;
        } else {
            runInAction(() => {
                clearInterval(this.intervalId);
                clearInterval(this.intervalToSaveTraining);

                this.isRunning = false;
                this.training.polyline ? this.training.polyline = this.training.polyline : this.training.polyline = [];
                this.training.end_data = moment(new Date()).format(`h:mm a`);
                this.training.end_step = this.stepCounter.stepCount;
                this.training.step_count = this.training.end_step - this.training.start_step;
                this.training.duration = this.timer;

                this.timer = `00:00:00`;

                this.ms = 0;
                this.seconds = 0;
                this.minute = 0;
            });

            const change = await this.trainingCase.saveTraining(this.training, this.userStore.user.user_id);

            await this.userStore.updateUserInfo();

            runInAction(() => {
                this.training = change;
            })
            this.geolocationService.setLocation([]);
            this.geolocationService.stopGeolocation();

            return false;
        }
    };

    public startStepCounterService = async () => {
        // await this.geolocationService.startGeolocation();
        await this.backgroundService.startBackgroundTask(this.stepCounter.startPedometer);
        // await this.backgroundService.startBackgroundTask(this.geolocationService.startGeolocation);
        // this.stepCounter.startPedometer();
    }

    public stopStepCounterService = async () => {
        await this.backgroundService.stopBackgroundTask();
    }
};

const rootStore = new RootStore();
const storeContext = createContext(rootStore);
export const useRootStore = () => useContext(storeContext);