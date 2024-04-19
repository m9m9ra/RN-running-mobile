import {isLocationEnabled, promptForEnableLocationIfNeeded} from "react-native-android-location-enabler";
import {PermissionsAndroid,} from "react-native";

export const requestLocationPermission = async (): Promise<boolean> => {
    try {
        const checkEnabled: boolean = await isLocationEnabled();

        return  PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
        ).then(async (granted) => {
            try {
                const enableResult = await promptForEnableLocationIfNeeded();
                console.log('enableResult', enableResult);
                // The user has accepted to enable the location services
                // data can be :
                //  - "already-enabled" if the location services has been already enabled
                //  - "enabled" if user has clicked on OK button in the popup
            } catch (error: unknown) {
                throw new Error(String(error));
            }
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        })
    } catch (err) {
        throw new Error(String(err));
    }
    return false
};