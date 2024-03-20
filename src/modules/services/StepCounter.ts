import {accelerometer, SensorTypes, setUpdateIntervalForType} from "react-native-sensors";
import { Subscription } from "rxjs";
import {action, makeObservable, observable, runInAction} from "mobx";

export class StepCounter {
    public stepCount: number = 0;

    private subscription: Subscription;

    constructor() {

        makeObservable(this, {
            stepCount: observable,
            startPedometer: action,
            stopPedometer: action,
        })
    }

    public startPedometer = () => {
        let oldXposition: number = 0;
        let oldYposition: number = 0;
        let oldZposition: number = 0;
        setUpdateIntervalForType(SensorTypes.accelerometer, 1600);
        this.subscription = accelerometer.subscribe(({x, y, z}) => {
            // console.log(x, y, z);
            const newXposition: number = x;
            const newYposition: number = y;
            const newZposition: number = z;
            
            // todo - y: 1.2, z: 1.4?
            if (((newXposition - oldXposition) > 1.8) || (newYposition - oldYposition) > 1.4 || (newZposition - oldZposition) > 1.6) {
                runInAction((): void => {
                    this.stepCount = this.stepCount + 1;
                })
                // console.log(`step`);
            };
            oldXposition = x;
            oldYposition = y;
            oldZposition = z;
        });

        this.observeStepService();
    };

    private observeStepService = async () => {
        // todo - Перестать говнакодить!!!
        // const saveTimer: NodeJS.Timeout = setInterval(() => {
        //     // console.log(this.stepCount);
        // }, 1200);
    };

    public stopPedometer = () => {
        this.subscription.unsubscribe();
    }
};