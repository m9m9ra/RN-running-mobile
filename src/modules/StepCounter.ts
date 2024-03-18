import {accelerometer, SensorTypes, setUpdateIntervalForType} from "react-native-sensors";
import {createContext, useContext} from "react";
import { Subscription } from "rxjs";
import {action, makeObservable, observable, runInAction} from "mobx";

class StepCounter {
    public isRunning: boolean = false;
    public timer: string = `00:00:00`;
    public stepCount: number = 0;

    private ms: number = 0;
    private seconds: number = 0;
    private minute: number = 0;
    private subscription: Subscription

    constructor() {

        makeObservable(this, {
            isRunning: observable,
            stepCount: observable,
            timer: observable,
            // @ts-ignore
            ms: observable,
            seconds: observable,
            minute: observable,
            toggleRunning: action,
            startCounter: action,
            stopCounter: action,
        })
    }

    public startCounter = () => {
        let oldXposition: number = 0;
        let oldYposition: number = 0;
        let oldZposition: number = 0;
        setUpdateIntervalForType(SensorTypes.accelerometer, 1600);
        this.subscription = accelerometer.subscribe(({x, y, z}) => {
            // console.log(x, y, z);
            const newXposition: number = x;
            const newYposition: number = y;
            const newZposition: number = z;


            if (((newXposition - oldXposition) > 1.8) || (newYposition - oldYposition) > 1.2 || (newZposition - oldZposition) > 1.4) {
                runInAction((): void => {
                    this.stepCount = this.stepCount + 1;
                })
                // console.log(`step`);
            };
            oldXposition = x;
            oldYposition = y;
            oldZposition = z;
        });
    };

    public toggleRunning = async () => {
        let interval: NodeJS.Timeout;
        if (!this.isRunning) {
            runInAction(() => {
                this.isRunning = true;
            });

            interval = setInterval(() => {
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
                })
                console.log(this.ms);
            }, 1000);
        } else {
            clearInterval(interval);
            runInAction(() => {
                this.isRunning = false;
            });
        };
    }

    public stopCounter = () => {
        this.subscription.unsubscribe();
    }
};

const stepCounter = new StepCounter();
const stepContext = createContext(stepCounter);
export const useStepCounter = () => useContext(stepContext);