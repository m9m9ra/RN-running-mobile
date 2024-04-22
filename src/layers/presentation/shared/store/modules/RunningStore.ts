import {makeAutoObservable, runInAction} from "mobx";
import moment from "moment/moment";
import {Training} from "../../../../domain/entity/Training";
import {Polyline} from "../../../../domain/entity/Polyline";
import {KcalPerMinute} from "../../../../../core/utils/KcalCalc";
import {pointToDistance} from "../../../../../core/utils/PointToDistance";
import Geolocation, {GeoError} from "react-native-geolocation-service";
import UserStore from "./UserStore";
import {StepCounter} from "../services/StepCounter";
import {PolylineCase} from "../../../../domain/usecase/PolylineCase";
import {TrainingCase} from "../../../../domain/usecase/TrainingCase";
import {Point} from "react-native-yamap";
import {AppState, NativeEventSubscription} from "react-native";

export class RunningStore {
    public timer: string = `00:00:00`;
    public isRunning: boolean = false;
    public isRunningPause: boolean = false;
    public gpsEnable: boolean = false;
    public training: Training | null = null;
    public geolocation: Point[] = [];
    public currentPosition: Point = {
        lat: 54.7065,
        lon: 20.511,
    };

    // DomesticModules
    private backgroundTracker: number = 0;
    private appState;
    private subscription: NativeEventSubscription;

    private seconds: number = 0;
    private minute: number = 0;
    private hour: number = 0;

    private watchId: number = 0;
    private userStore: UserStore;
    private stepCounter: StepCounter;
    private intervalId: NodeJS.Timeout;
    private intervalUpdateTrainig: NodeJS.Timeout;
    private intervalToSaveTraining: NodeJS.Timeout;
    private trainingCase: TrainingCase;
    private polylineCase: PolylineCase;

    constructor(stepCounter: StepCounter, userStore: UserStore) {
        this.trainingCase = new TrainingCase();
        this.polylineCase = new PolylineCase();
        this.stepCounter = stepCounter;
        this.userStore = userStore;

        // Geolocation.getCurrentPosition(position => {
        //     console.log(position);
        //     this.gpsEnable = true;
        //     this.currentPosition = {
        //         lon: position.coords.longitude,
        //         lat: position.coords.latitude
        //     };
        // }, (error: GeoError) => {
        //     this.gpsEnable = false;
        // }, {
        //     timeout: 5000,
        //     maximumAge: 10000,
        //     enableHighAccuracy: false,
        //     distanceFilter: 0,
        //     forceRequestLocation: true,
        //     accuracy: {
        //         android: 'high',
        //         ios: 'best',
        //     },
        //     showLocationDialog: true
        // });
        !this.isRunning ? this.runTrackBackground() : false;

        makeAutoObservable(this);
    };

    public toggleRunning = async () => {
        this.removeTrackBackground();

        if (!this.isRunning) {
            this.isRunning = true;
            const current_data = moment(new Date()).format(`h:mm a`);

            // todo - user_id | stepCount
            const training = Object.assign(new Training(), {
                user_id: this.userStore.user.user_id,
                type: "RUNNING",
                start_data: current_data,
                start_step: this.stepCounter.stepCount,
                data: moment(new Date()).format(`MM/DD/YYYY`),
                remote: false,
            });

            // todo - init Training
            const change = await this.trainingCase.initTrainingLocal(training);

            runInAction(() => {
                this.training = change;
            });

            await this.startRunning();

            return true;
        } else if (this.isRunning && this.isRunningPause) {
            await this.startRunning();
            return true
        } else {
            Geolocation.clearWatch(this.watchId);
            Geolocation.stopObserving();

            runInAction(() => {
                clearInterval(this.intervalId);
                clearInterval(this.intervalToSaveTraining);
                this.isRunningPause = false;

                this.isRunning = false;
                this.training.polyline ? this.training.polyline = this.training.polyline : this.training.polyline = [];
                this.training.end_data = moment(new Date()).format(`h:mm a`);
                this.training.end_step = this.stepCounter.stepCount;
                this.training.step_count = this.training.end_step - this.training.start_step;
                this.training.duration = this.timer;
                this.training.average_step = ((this.hour * 3600 + this.minute * 60 + this.seconds) / 60 / this.training.step_count).toFixed(2);

                this.geolocation = [];

                this.timer = `00:00:00`;

                this.seconds = 0;
                this.minute = 0;
                this.hour = 0;
            });

            const change = await this.trainingCase.saveTrainingLocal(this.training);
            runInAction(() => {
                this.training = change;
                // console.log()
            })

            await this.userStore.updateUserInfo();

            // todo - Под вопросом!
            this.runTrackBackground();

            return false;
        }
    };

    private startRunning = async (): Promise<void> => {
        runInAction(() => {
            this.isRunningPause = false;
        });

        // todo - GPS tracker ----------------------------------------------------
        this.watchId = Geolocation.watchPosition(
            async (position) => {
                runInAction(() => {
                    this.gpsEnable = true;
                });

                const currentPosition = {
                    lon: position.coords.longitude,
                    lat: position.coords.latitude
                };

                const newPolyline = Object.assign(new Polyline(), {
                    training_id: this.training.id,
                    lat: currentPosition.lat,
                    lon: currentPosition.lon
                });

                await this.polylineCase.savePolylineLocal(newPolyline);

                const kcalPerMinute = KcalPerMinute({height: 172, weight: 64, averageSpeed: this.training.average});
                const Kcal = (Number(kcalPerMinute) * (this.minute * 60 + this.seconds / 60)).toFixed(2);
                const override = await this.trainingCase.getTraining(this.training);

                runInAction(() => {
                    this.training = override;
                    this.training.kcal = Number(Kcal) !== Infinity ? String(parseInt(Kcal)) : this.training.kcal;

                    // todo - Не забудь, а то запомнишь!!!
                    this.currentPosition = {
                        lon: position.coords.longitude,
                        lat: position.coords.latitude
                    };

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

                        let time: number;

                        // todo - avg_pace
                        if (this.hour > 0 && this.minute > 0) {
                            time = this.hour > 0 ? this.hour * 60 * 60 + this.minute * 60: this.minute * 60 + this.seconds;
                        } else if (this.minute > 0) {
                            time = this.minute * 60 + this.seconds;
                        } else {
                            time = this.seconds
                        }
                        // time = this.hour > 0 ? this.hour * 60 + this.minute : this.minute;
                        const average_pace = ((time / 60) / Number(this.training.distance)).toFixed(2);

                        this.training.average_pace = Number(average_pace) !== Infinity ? average_pace : this.training.average_pace;

                        // todo - avg_speed
                        if (Number(this.training.distance) > 0.01) {
                            this.training.average = (Number(this.training.distance) / (time / 60 / 60)).toFixed(2)
                        } else {
                            this.training.average = `0.00`;
                        }

                        if (this.training.average > this.training.max_speed) {
                            this.training.max_speed = this.training.average;
                        }

                        console.log(this.training.average, `avg`);
                        console.log(this.training.max_speed, `max_speed`);
                    }
                });
            },
            async (error) => {
                // todo - error catch
                console.log(`error`, error);
                runInAction(() => {
                    this.gpsEnable = false;
                });
                throw new Error(`Какой-то умник выключил gps во время бега :с` + JSON.stringify(error));
            },
            {
                distanceFilter: 0,
                interval: 1250,
                fastestInterval: 900,
                accuracy: {
                    android: 'high',
                    ios: 'best',
                },
                //high - false is good
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
                    // this.training.duration = this.timer;
                })
            }, 1000);
        });
    };

    public pauseRunning = async (): Promise<void> => {
        Geolocation.clearWatch(this.watchId);
        clearInterval(this.intervalId);
        runInAction(() => {
            this.isRunningPause = true;
        })
    };

    private runTrackBackground = (): void => {
        this.subscription = AppState.addEventListener('change', nextAppState => {
            console.log('AppState', nextAppState);
            // const indicator: boolean = nextAppState == `active`;

            if (nextAppState == `active` && !this.isRunning) {
                this.backgroundTracker = Geolocation.watchPosition(
                    async (position) => {
                        runInAction(() => {
                            this.currentPosition = {
                                lon: position.coords.longitude,
                                lat: position.coords.latitude
                            };
                        });
                        console.log(`background checking`);
                        runInAction(() => {
                            this.gpsEnable = true;
                        });
                    },
                    async (error) => {
                        // todo - error catch
                        console.log(`error`, error);
                        // try {
                        //     const enableResult = await promptForEnableLocationIfNeeded();
                        //     console.log('enableResult', enableResult);
                        //     // The user has accepted to enable the location services
                        //     // data can be :
                        //     //  - "already-enabled" if the location services has been already enabled
                        //     //  - "enabled" if user has clicked on OK button in the popup
                        //     runInAction(() => {
                        //         this.gpsEnable = true;
                        //     });
                        // } catch (error: unknown) {
                        //     runInAction(() => {
                        //         this.gpsEnable = false;
                        //     });
                        //     throw new Error(String(error));
                        // }
                        runInAction(() => {
                            this.gpsEnable = false;
                        });
                        // throw new Error(String(error));
                    },
                    {
                        distanceFilter: 0,
                        interval: 60000,
                        // interval: 2000,
                        fastestInterval: 5000,
                        accuracy: {
                            android: 'high',
                            ios: 'best',
                        },
                        //high - false is good
                        enableHighAccuracy: false,
                        showLocationDialog: false,
                        showsBackgroundLocationIndicator: false,
                    });
            } else {
                this.clearTrackBackground();
            }
        });
    };

    private removeTrackBackground = (): void => {
        Geolocation.clearWatch(this.backgroundTracker);
        this.subscription.remove();
    };

    private clearTrackBackground = (): void => {
        Geolocation.clearWatch(this.backgroundTracker);
        Geolocation.stopObserving();
    };
}