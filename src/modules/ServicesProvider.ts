import {createContext, useContext} from "react";
import {StepCounter} from "./services/StepCounter";
import {action, makeObservable, observable, runInAction} from "mobx";
import {BackgroundService} from "./services/BackgroundService";
import {GeolocationService} from "./services/GeolocationService";

class ServicesProvider {
    public isRunning: boolean = false;
    public timer: string = `00:00:00`;
    public stepCounter: StepCounter;
    public backgroundService: BackgroundService;
    public geolocationService: GeolocationService;


    private ms: number = 0;
    private seconds: number = 0;
    private minute: number = 0;
    private intervalId: NodeJS.Timeout;


    constructor() {
        this.stepCounter = new StepCounter();
        this.backgroundService = new BackgroundService();
        this.geolocationService = new GeolocationService();

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

const serviceProvider = new ServicesProvider();
const serviceContext = createContext(serviceProvider);
export const useServiceProvider = () => useContext(serviceContext);