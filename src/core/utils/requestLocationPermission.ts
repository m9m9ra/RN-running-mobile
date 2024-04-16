import {isLocationEnabled} from "react-native-android-location-enabler";
import {PermissionsAndroid,} from "react-native";

export const requestLocationPermission = async (): Promise<boolean> => {
    try {
        const checkEnabled: boolean = await isLocationEnabled();

        return  PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
        ).then((granted) => {
            console.log(granted, checkEnabled, `wtf`);
            console.log(granted === PermissionsAndroid.RESULTS.GRANTED, `wtf`);
            if (granted === PermissionsAndroid.RESULTS.GRANTED && checkEnabled) {
                return true
            } else {
                return false
            }
        })
    } catch (err) {
        console.warn(err);
        return false
    }
};