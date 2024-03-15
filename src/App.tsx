import {PermissionsAndroid, Platform, SafeAreaView, StatusBar, useColorScheme, View} from "react-native";
import {Colors} from "react-native/Libraries/NewAppScreen";
import {MD3LightTheme, PaperProvider} from "react-native-paper";
import {useRootStore} from "./store/RootStore";
import {observer} from "mobx-react-lite";
import {useEffect, useState} from "react";
import {useStepCounter} from "./modules/StepCounter";
import {enGB, registerTranslation} from 'react-native-paper-dates'

registerTranslation('en-GB', enGB)

import BackgroundJob from 'react-native-background-actions';
import Geolocation from "@react-native-community/geolocation";
import {getLocales} from "react-native-localize";
import {useTranslation} from "react-i18next";
import {NavigationContainer} from "@react-navigation/native";
import {AuthStack} from "./navigation/AuthStack";
import {MainStack} from "./navigation/MainStack";

const options = {
    taskName: 'Example',
    taskTitle: 'ExampleTask title',
    taskDesc: 'ExampleTask desc',
    taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
    },
    color: '#ff00ff',
    parameters: {
        delay: 1000,
    },
};

// Configure Geolocation
Geolocation.setRNConfiguration({
    authorizationLevel: 'always', // Request "always" location permission
    skipPermissionRequests: false, // Prompt for permission if not granted
});

// To stop tracking (for example, when the component unmounts):
// Geolocation.clearWatch(watchId);

export const App = observer((): JSX.Element => {
    const isDarkMode = useColorScheme() === 'dark';
    const {startCounter} = useStepCounter();
    const {userStore} = useRootStore();
    const [location, setLocation] = useState<Array<any>>([]);
    let playing = BackgroundJob.isRunning();
    const {t} = useTranslation();

    const taskRandom = async (taskData: any): Promise<void> => {
        if (Platform.OS === 'ios') {
            console.warn(
                'This task will not keep your app alive in the background by itself, use other library like react-native-track-player that use audio,',
                'geolocalization, etc. to keep your app alive in the background while you excute the JS from this library.'
            );
        }
        await new Promise(async (resolve): Promise<void> => {
            startCounter();
        });
    };

    const toggleBackground = async (): Promise<void> => {
        playing = !playing;
        if (playing) {
            try {
                console.log('Trying to start background service');
                await BackgroundJob.start(taskRandom, options);
                console.log('Successful start!');
            } catch (e) {
                console.log('Error', e);
            }
        } else {
            console.log('Stop background service');
            await BackgroundJob.stop();
        }
    };

    // Watch for position updates
    const watchId = Geolocation.watchPosition(
        position => {
            console.log(position);
            setLocation([...location, position]);
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
        }
    );


    useEffect(() => {
        console.log(getLocales());

        async function requestLocationPermission() {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                )
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log("You can use locations ")
                } else {
                    console.log("Location permission denied")
                }
            } catch (err) {
                console.warn(err)
            }
        };
        requestLocationPermission().then();

        userStore.main()
            .then(() => {
                console.log(1);
            });
    }, []);

    const backgroundStyle = {
        backgroundColor: Colors.lighter // isDarkMode ? Colors.darker :
    };

    return (
        <PaperProvider theme={MD3LightTheme}>
            <SafeAreaView style={{...backgroundStyle, flex: 1}}>
                <StatusBar barStyle={'dark-content'}
                           backgroundColor={backgroundStyle.backgroundColor}/>
                <NavigationContainer independent={true}>
                    {userStore.auth ?
                        <MainStack/>
                        :
                        <AuthStack/>}
                </NavigationContainer>
            </SafeAreaView>
        </PaperProvider>
    );
});