import {makeObservable, runInAction} from "mobx";
import Geolocation from "@react-native-community/geolocation";

export class GeolocationService {
    private watchId;
    public geolocation: Array<any> = [];

    constructor() {
        makeObservable(this, {});
        Geolocation.setRNConfiguration({
            authorizationLevel: 'always', // Request "always" location permission
            skipPermissionRequests: false, // Prompt for permission if not granted
        });
    }

    public startGeolocation = async () => {
        this.watchId = Geolocation.watchPosition(
            position => {
                console.log(position);
                runInAction(() => {
                    this.geolocation = [...this.geolocation, position];
                })
                // Send the position data to the server
            },
            error => {
                console.log(`error`, error);
            },
            {
                distanceFilter: 0, // Minimum distance (in meters) to update the location
                interval: 600, // Update interval (in milliseconds), which is 15 minutes
                fastestInterval: 600, // Fastest update interval (in milliseconds)
                accuracy: {
                    android: 'highAccuracy',
                    ios: 'best',
                },
                showsBackgroundLocationIndicator: true,
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
        Geolocation.clearWatch(this.watchId);
    }
};