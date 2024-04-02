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
import {Polyline} from "../entity/Polyline";
import moment from "moment";
import {pointToDistance} from "../utils/PointToDistance";

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
    public training: Training | null = null;

    // DomesticModules
    private ms: number = 0;
    private seconds: number = 0;
    private minute: number = 0;
    private intervalId: NodeJS.Timeout;
    private intervalToSaveTraining: NodeJS.Timeout;
    private trainingRepository = dataSourse.getRepository(Training);
    private polylineRepository = dataSourse.getRepository(Polyline);

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
            training: observable,
            timer: observable,
            stopStepCounterService: action,
            startStepCounterService: action,
            toggleRunning: action,
            clearTimer: action,
        });
    };

    public toggleRunning = async (): Promise<boolean> => {
        console.log(moment(new Date()).format(`MM/DD/YYYY/h:mm a`));
        const start_data: string = moment(new Date()).format(`h:mm a`);

        if (!this.isRunning) {
            await runInAction(async () => {
                this.training = Object.assign(new Training(), {
                    user_id: this.userStore.user.auth,
                    type: "RUNNING",
                    start_data: moment(new Date()).format(`h:mm a`),
                    start_step: this.stepCounter.stepCount,
                    data: moment(new Date()).format(`MM/DD/YYYY`)
                });

                this.intervalToSaveTraining = setInterval(async () => {
                    const newPolyline = Object.assign(new Polyline(), {
                        training_id: this.training.id,
                        lat: this.geolocationService.currentPosition.lat,
                        lon: this.geolocationService.currentPosition.lon
                    });
                    console.log(Polyline, newPolyline);

                    const oldChange = await this.trainingRepository.save(this.training);

                    runInAction(() => {
                        this.training = oldChange;
                    });

                    await this.polylineRepository.save(newPolyline);

                    const change = await this.trainingRepository.findOne({
                        where: {
                            start_data: start_data,
                        },
                        relations: {
                            polyline: true
                        }
                    });

                    runInAction(() => {
                        this.training = change;
                        let currentDistance: number = 0;

                        if (this.training.polyline.length > 1 && this.training.polyline) {
                            for (let i = 0; i < this.training.polyline.length - 1; i++) {
                                const distance = pointToDistance(this.training.polyline[i].lat, this.training.polyline[i].lon, this.training.polyline[i + 1].lat, this.training.polyline[i + 1].lon);
                                currentDistance += distance;
                            }
                            console.log(currentDistance, "Distance");
                            console.log(this.seconds, "Minute");

                            this.seconds > 0 ? this.training.average = Number(currentDistance / this.seconds).toFixed(2) : this.training.average = `00.00`;

                            this.training.distance = currentDistance.toFixed(2);
                            console.log(this.training.distance, "Training Distance");
                            console.log(this.training.average, "Training Average");
                        }

                    });

                }, 10000);
            });

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
                this.isRunning = false;
                clearInterval(this.intervalId);
                clearInterval(this.intervalToSaveTraining);
                this.training.end_data = moment(new Date()).format(`h:mm a`);
                this.training.end_step = this.stepCounter.stepCount;
                this.training.step_count = this.training.end_step - this.training.start_step;
                this.training.duration = this.timer;
                this.clearTimer();
                this.ms = 0;
                this.seconds = 0;
                this.minute = 0;
            });

            const change = await this.trainingRepository.save(this.training);

            await this.userStore.updateUserInfo();

            runInAction(() => {
                this.training = change;
            })
            this.geolocationService.setLocation([]);

            return false;
        }
    };


    public clearTimer = () => {
        this.timer = `00:00:00`;
    }

    public startGpsService = async () => {
        await this.geolocationService.startGeolocation()
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