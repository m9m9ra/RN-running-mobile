import {Platform} from "react-native";
import {isLocationEnabled} from "react-native-android-location-enabler";

export const requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
        const checkEnabled: boolean = await isLocationEnabled();
        console.log('checkEnabled', checkEnabled);
        return checkEnabled
    }
};