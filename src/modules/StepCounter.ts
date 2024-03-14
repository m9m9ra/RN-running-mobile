import {accelerometer, SensorTypes, setUpdateIntervalForType} from "react-native-sensors";
import {createContext, useContext} from "react";
import { Subscription } from "rxjs";
import {action, makeObservable, observable, runInAction} from "mobx";

class StepCounter {
    public stepCount: number = 0;
    private subscription: Subscription

    constructor() {
        makeObservable(this, {
            stepCount: observable,
            startCounter: action,
            stopCounter: action
        })
    }

    public startCounter = () => {
        let oldXposition: number = 0;
        let oldYposition: number = 0;
        let oldZposition: number = 0;
        setUpdateIntervalForType(SensorTypes.accelerometer, 1600);
        this.subscription = accelerometer.subscribe(({x, y, z}) => {
            console.log(x, y, z);
            const newXposition: number = x;
            const newYposition: number = y;
            const newZposition: number = z;


            if (((newXposition - oldXposition) > 1.8) || (newYposition - oldYposition) > 1.2 || (newZposition - oldZposition) > 1.4) {
                runInAction((): void => {
                    this.stepCount = this.stepCount + 1;
                })
                console.log(`step`);
            };
            oldXposition = x;
            oldYposition = y;
            oldZposition = z;
        });
    };

    public stopCounter = () => {
        this.subscription.unsubscribe();
    }
};

const stepCounter = new StepCounter();
const stepContext = createContext(stepCounter);
export const useStepCounter = () => useContext(stepContext);