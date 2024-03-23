import {action, makeObservable, observable, runInAction} from "mobx";
import Geolocation from "@react-native-community/geolocation";
import {Point} from "react-native-yamap";

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
        Geolocation.setRNConfiguration({
            authorizationLevel: 'always', // Request "always" location permission
            skipPermissionRequests: false, // Prompt for permission if not granted
            enableBackgroundLocationUpdates: true,
            locationProvider: 'auto'
        });
        // @ts-ignore
        Geolocation.getCurrentPosition(position => {
            console.log(position);
            this.currentPosition = {
                lon: position.coords.longitude,
                lat: position.coords.latitude
            };
        });
    }

    public setLocation = (polyline: Point[]): void => {
        this.geolocation = polyline;
    };

    public startGeolocation = async () => {
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
                // Send the position data to the server
            },
            error => {
                console.log(`error`, error);
            },
            {
                distanceFilter: 0, // Minimum distance (in meters) to update the location
                interval: 6000, // Update interval (in milliseconds), which is 15 minutes
                fastestInterval: 3000, // Fastest update interval (in milliseconds)
                accuracy: {
                    android: 'highAccuracy',
                    ios: 'best',
                },
                showsBackgroundLocationIndicator: false,
                pausesLocationUpdatesAutomatically: false,
                activityType: 'fitness', // Specify the activity type (e.g., 'fitness' or 'other')
                useSignificantChanges: false,
                deferredUpdatesInterval: 0,
                deferredUpdatesDistance: 0,
                foregroundService: {
                    notificationTitle: 'Tracking your location',
                    notificationBody: 'Enable location tracking to continue', // Add a notification body
                },
        })
    };

    public stopGeolocation = async () => {
        console.log(this.watchId);
        Geolocation.clearWatch(this.watchId);
    };
};