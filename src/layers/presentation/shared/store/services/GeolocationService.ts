import {action, makeObservable, observable, runInAction} from "mobx";
// import Geolocation from "@react-native-community/geolocation";
import Geolocation from 'react-native-geolocation-service';
import BackgroundTimer from 'react-native-background-timer';
import {Point} from "react-native-yamap";
import {AppState} from "react-native";

export class GeolocationService {
    private watchId;
    public geolocation: Point[] = [];
    public currentPosition: Point = {
        lat: 54.7065,
        lon: 20.511,
    };

    constructor() {
        makeObservable(this, {
            geolocation: observable,
            currentPosition: observable,
            startGeolocation: action,
            stopGeolocation: action,
            setLocation: action
        });

        // Geolocation.getCurrentPosition(position => {
        //     console.log(position);
        //     this.currentPosition = {
        //         lon: position.coords.longitude,
        //         lat: position.coords.latitude
        //     };
        // }, () => {
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
    }

    public setLocation = (polyline: Point[]): void => {
        this.geolocation = polyline;
    };

    public startGeolocation = () => {
        this.watchId = Geolocation.watchPosition(
            position => {
                console.log(position);
                console.log(this.watchId);
                runInAction(() => {
                    this.currentPosition = {
                        lon: position.coords.longitude,
                        lat: position.coords.latitude
                    };
                    this.geolocation.push({
                        lon: position.coords.longitude,
                        lat: position.coords.latitude
                    });
                })
            },
            error => {
                console.log(`error`, error);
            },
            {
                distanceFilter: 0,
                interval: 5000,
                fastestInterval: 5000,
                accuracy: {
                    android: 'high',
                    ios: 'best',
                },
                enableHighAccuracy: false,
                showsBackgroundLocationIndicator: true,
            })
        // BackgroundTimer.runBackgroundTimer(() => {
        //     Geolocation.getCurrentPosition(
        //         (position) => {
        //             console.log(
        //                 'getCurrentPosition background',
        //                 JSON.stringify(position)
        //             );
        //
        //             runInAction(() => {
        //                 this.currentPosition = {
        //                     lon: position.coords.longitude,
        //                     lat: position.coords.latitude
        //                 };
        //                 this.geolocation.push({
        //                     lon: position.coords.longitude,
        //                     lat: position.coords.latitude
        //                 });
        //             })
        //         },
        //         (error) =>
        //             console.log(
        //                 'getCurrentPosition background error',
        //                 JSON.stringify(error)
        //             ),
        //         {
        //             timeout: 5000,
        //             maximumAge: 10000,
        //             enableHighAccuracy: false,
        //             distanceFilter: 0,
        //             forceRequestLocation: true,
        //             accuracy: {
        //                 android: 'high',
        //                 ios: 'best',
        //             },
        //             showLocationDialog: true
        //         }
        //     );
        // }, 9000);
    };

    public stopGeolocation = () => {
        // BackgroundTimer.stopBackgroundTimer(this.watchId);
        console.log(this.watchId);
        Geolocation.clearWatch(this.watchId);
        Geolocation.stopObserving();
    };
};