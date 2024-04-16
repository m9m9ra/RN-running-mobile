import {makeAutoObservable, runInAction} from "mobx";
import moment from "moment/moment";
import {Training} from "../../../../domain/entity/Training";
import {Polyline} from "../../../../domain/entity/Polyline";
import {KcalPerMinute} from "../../../../../core/utils/KcalCalc";
import {pointToDistance} from "../../../../../core/utils/PointToDistance";
import Geolocation from "react-native-geolocation-service";
import UserStore from "./UserStore";
import {StepCounter} from "../services/StepCounter";
import {PolylineCase} from "../../../../domain/usecase/PolylineCase";
import {TrainingCase} from "../../../../domain/usecase/TrainingCase";
import {Point} from "react-native-yamap";

export class RunningStore {
    public timer: string = `00.00.00`;
    public isRunning: boolean = false;
    public training: Training | null = null;
    public geolocation: Point[] = [];
    public currentPosition: Point = {
        lat: 54.7065,
        lon: 20.511,
    };

    // DomesticModules
    private seconds: number = 0;
    private minute: number = 0;
    private hour: number = 0;

    private watchId: number = 0;
    private userStore: UserStore;
    private stepCounter: StepCounter;
    private intervalId: NodeJS.Timeout;
    private intervalToSaveTraining: NodeJS.Timeout;
    private trainingCase: TrainingCase;
    private polylineCase: PolylineCase;

    constructor(stepCounter: StepCounter, userStore: UserStore) {
        this.trainingCase = new TrainingCase();
        this.polylineCase = new PolylineCase();
        this.stepCounter = stepCounter;
        this.userStore = userStore;

        Geolocation.getCurrentPosition(position => {
            console.log(position);
            this.currentPosition = {
                lon: position.coords.longitude,
                lat: position.coords.latitude
            };
        }, () => {
        }, {
            timeout: 5000,
            maximumAge: 10000,
            enableHighAccuracy: false,
            distanceFilter: 0,
            forceRequestLocation: true,
            accuracy: {
                android: 'high',
                ios: 'best',
            },
            showLocationDialog: true
        });

        makeAutoObservable(this);
    };

    public toggleRunning = async () => {
        if (!this.isRunning) {
            this.isRunning = true;
            const current_data = moment(new Date()).format(`h:mm a`);

            // todo - user_id | stepCount
            const training = Object.assign(new Training(), {
                user_id: this.userStore.user.user_id,
                type: "RUNNING",
                start_data: current_data,
                start_step: this.stepCounter.stepCount,
                data: moment(new Date()).format(`MM/DD/YYYY`)
            });

            // todo - init Training
            const change = await this.trainingCase.initTrainingLocal(training);

            runInAction(() => {
                this.training = change;
            });

            // todo - GPS tracker ----------------------------------------------------
            this.watchId = Geolocation.watchPosition(
                async (position) => {
                    runInAction(() => {
                        this.currentPosition = {
                            lon: position.coords.longitude,
                            lat: position.coords.latitude
                        };
                    })

                    const newPolyline = Object.assign(new Polyline(), {
                        training_id: this.training.id,
                        lat: this.currentPosition.lat,
                        lon: this.currentPosition.lon
                    });

                    await this.polylineCase.savePolylineLocal(newPolyline);

                    const kcalPerMinute = KcalPerMinute({height: 172, weight: 64, averageSpeed: this.training.average});
                    const Kcal = (Number(kcalPerMinute) * this.minute).toFixed(2);

                    console.log(this.training.polyline);

                    // await this.trainingCase.updateTrainingLocal(this.training);
                    const override = await this.trainingCase.getTraining(this.training);

                    runInAction(() => {
                        this.training = override;
                        this.training.kcal = Kcal;

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
                            this.training.distance = currentDistance.toFixed(2);

                            if (Number(this.training.distance)) {
                                this.training.average = (Number(this.training.distance) / this.minute).toFixed(2)
                            } else {
                                this.training.average = `00.00`;
                            }
                        }

                    });
                    console.log(this.training.polyline, `training poly`);
                    console.log(this.training.distance, `training distance`);
                    console.log(this.training.duration, `training duration`);
                },
                error => {
                    // todo - error catch
                    console.log(`error`, error);
                },
                {
                    distanceFilter: 0,
                    interval: 2500,
                    fastestInterval: 1500,
                    accuracy: {
                        android: 'high',
                        ios: 'best',
                    },
                    enableHighAccuracy: false,
                    showsBackgroundLocationIndicator: true,
                })

            runInAction(() => {
                this.intervalId = setInterval(() => {
                    runInAction(() => {
                        this.seconds += 1;
                        if (this.seconds >= 60) {
                            this.minute += 1;
                            this.seconds = 0;
                        }
                        if (this.minute >= 60) {
                            this.minute = 0;
                            this.hour += 1;
                        }
                        this.timer = `${this.hour < 10 ? '0' + this.hour : this.hour}:${this.minute < 10 ? '0' + this.minute : this.minute}:${this.seconds < 10 ? '0' + this.seconds : this.seconds}`;
                    })
                }, 1000);
            });

            // this.timer = `${this.hour < 10 ? '0' + this.hour : this.hour}:${this.minute < 10 ? '0' + this.minute : this.minute}:${this.seconds < 10 ? '0' + this.seconds : this.seconds}`;

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

                this.geolocation = [];

                this.timer = `00:00:00`;

                this.seconds = 0;
                this.minute = 0;
                this.hour = 0;
            });

            Geolocation.clearWatch(this.watchId);
            Geolocation.stopObserving();

            const change = await this.trainingCase.saveTrainingLocal([this.training]);

            await this.userStore.updateUserInfo();

            return false;
        }
    };
}