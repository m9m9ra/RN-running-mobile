import {accelerometer, SensorTypes, setUpdateIntervalForType} from "react-native-sensors";
import {createContext, useContext} from "react";
import { Subscription } from "rxjs";
import {action, makeObservable, observable, runInAction} from "mobx";

class StepCounter {
    public stepCount: number = 0;
    private oldYposition: number;
    private newYposition: number;
    private subscription: Subscription

    constructor() {
        makeObservable(this, {
            stepCount: observable,
            startCounter: action,
            stopCounter: action
        })
    }

    public startCounter = () => {
        setUpdateIntervalForType(SensorTypes.accelerometer, 600);
        this.subscription = accelerometer.subscribe(({x, y, z, timestamp}) => {

            runInAction(() => {
                this.newYposition = y;
            })
            if ((this.newYposition - this.oldYposition) > 1.2) {
                runInAction(() => {
                    this.stepCount = this.stepCount + 1;
                })
                console.log(`step`);
            };
            runInAction(() => {
                this.oldYposition = y;
            })
        });
    };

    public stopCounter = () => {
        this.subscription.unsubscribe();
    }
};

const stepCounter = new StepCounter();
const stepContext = createContext(stepCounter);
export const useStepCounter = () => useContext(stepContext);