import {PermissionsAndroid, Platform} from "react-native";
import {isLocationEnabled} from "react-native-android-location-enabler";

export const requestLocationPermission = async (): Promise<boolean> => {
    // try {
    //     const granted = await PermissionsAndroid.request(
    //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    //     );
    //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //         console.log("You can use locations ");
    //         return true;
    //     } else {
    //         console.log("Location permission denied");
    //         return false;
    //     }
    // } catch (err) {
    //     console.warn(err, 'permission error');
    //     return false;
    // }
    if (Platform.OS === 'android') {
        const checkEnabled: boolean = await isLocationEnabled();
        console.log('checkEnabled', checkEnabled);
        return checkEnabled
    }
};